import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BookingStatus, EntityType, LessonStatus, PaymentStatus, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { PackagesService } from '../packages/packages.service';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly packagesService: PackagesService,
  ) {}

  private toMinutes(time: string) {
    const [hour = 0, minute = 0] = time.split(':').map(Number);
    return hour * 60 + minute;
  }

  private validateWindow(start: Date, end: Date) {
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid schedule date/time.');
    }

    if (end <= start) {
      throw new BadRequestException('scheduledEnd must be greater than scheduledStart.');
    }

    if (start <= new Date()) {
      throw new BadRequestException('Booking must be scheduled in the future.');
    }
  }

  private getWeekdayUtc(date: Date) {
    return date.getUTCDay();
  }

  private getMinutesUtc(date: Date) {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }

  private async validateInstructorAvailability(instructorProfileId: string, start: Date, end: Date) {
    const weekday = this.getWeekdayUtc(start);
    const startMinutes = this.getMinutesUtc(start);
    const endMinutes = this.getMinutesUtc(end);

    const slots = await this.prisma.availabilitySlot.findMany({
      where: {
        instructorProfileId,
        weekday,
        isActive: true,
      },
    });

    const isCompatible = slots.some((slot) => {
      const slotStart = this.toMinutes(slot.startTime);
      const slotEnd = this.toMinutes(slot.endTime);
      return startMinutes >= slotStart && endMinutes <= slotEnd;
    });

    if (!isCompatible) {
      throw new BadRequestException('Requested schedule is outside instructor availability.');
    }
  }

  private async validateInstructorConflict(instructorProfileId: string, start: Date, end: Date, excludeBookingId?: string) {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        instructorProfileId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.RESCHEDULED] },
        scheduledStart: { lt: end },
        scheduledEnd: { gt: start },
      },
    });

    if (conflict) {
      throw new BadRequestException('Instructor already has a booking in this time range.');
    }
  }

  private async calculateAmounts(dto: CreateBookingDto) {
    if (dto.packageId) {
      const packageItem = await this.packagesService.findOne(dto.packageId);
      return {
        priceTotal: Number(packageItem.price),
        platformFee: Number((Number(packageItem.price) * 0.12).toFixed(2)),
      };
    }

    const priceTotal = dto.priceTotal;
    if (priceTotal === undefined) {
      throw new BadRequestException('priceTotal is required when packageId is not provided.');
    }

    const platformFee = dto.platformFee ?? Number((priceTotal * 0.12).toFixed(2));
    return { priceTotal, platformFee };
  }

  private buildPinCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  private normalizeBooking<T extends { priceTotal: unknown; platformFee: unknown }>(booking: T) {
    return {
      ...booking,
      priceTotal: Number(booking.priceTotal),
      platformFee: Number(booking.platformFee),
    };
  }

  private async resolveActorScope(userId: string, role: UserRole) {
    const [candidate, instructor, school] = await Promise.all([
      role === UserRole.CANDIDATE ? this.prisma.candidateProfile.findUnique({ where: { userId } }) : null,
      role === UserRole.INSTRUCTOR ? this.prisma.instructorProfile.findUnique({ where: { userId } }) : null,
      role === UserRole.SCHOOL_MANAGER ? this.prisma.school.findUnique({ where: { managerUserId: userId } }) : null,
    ]);

    return {
      candidateProfileId: candidate?.id,
      instructorProfileId: instructor?.id,
      schoolId: school?.id,
    };
  }

  private async assertBookingAccess(booking: { candidateProfileId: string; instructorProfileId: string | null; schoolId: string | null }, userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return;
    }

    const scope = await this.resolveActorScope(userId, role);
    const allowed =
      (scope.candidateProfileId && booking.candidateProfileId === scope.candidateProfileId) ||
      (scope.instructorProfileId && booking.instructorProfileId === scope.instructorProfileId) ||
      (scope.schoolId && booking.schoolId === scope.schoolId);

    if (!allowed) {
      throw new UnauthorizedException('You are not allowed to manage this booking.');
    }
  }

  async create(dto: CreateBookingDto, actorUserId?: string) {
    if (!dto.candidateProfileId) {
      throw new UnauthorizedException('candidateProfileId is required.');
    }
    const candidateProfileId = dto.candidateProfileId;

    const scheduledStart = new Date(dto.scheduledStart);
    const scheduledEnd = new Date(dto.scheduledEnd);
    this.validateWindow(scheduledStart, scheduledEnd);

    if (!dto.instructorProfileId) {
      throw new BadRequestException('instructorProfileId is required.');
    }

    const instructorProfile = await this.prisma.instructorProfile.findUnique({
      where: { id: dto.instructorProfileId },
    });

    if (!instructorProfile || !instructorProfile.isActive) {
      throw new BadRequestException('Instructor is not active or does not exist.');
    }

    await this.validateInstructorAvailability(dto.instructorProfileId, scheduledStart, scheduledEnd);
    await this.validateInstructorConflict(dto.instructorProfileId, scheduledStart, scheduledEnd);

    const { priceTotal, platformFee } = await this.calculateAmounts(dto);

    const booking = await this.prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          candidateProfileId,
          instructorProfileId: dto.instructorProfileId,
          schoolId: dto.schoolId,
          packageId: dto.packageId,
          scheduledStart,
          scheduledEnd,
          priceTotal,
          platformFee,
          status: BookingStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PENDING,
        } satisfies Prisma.BookingUncheckedCreateInput,
      });

      await tx.payment.create({
        data: {
          bookingId: created.id,
          candidateProfileId: created.candidateProfileId,
          instructorProfileId: created.instructorProfileId,
          schoolId: created.schoolId,
          amount: Number(priceTotal),
          platformFee: Number(platformFee),
          status: PaymentStatus.PENDING,
          method: 'MANUAL',
          currency: 'BRL',
          provider: 'stub',
          splitMetadataJson: { providerHint: 'stripe|pagarme|asaas' },
        },
      });

      if (created.instructorProfileId) {
        await tx.lesson.create({
          data: {
            bookingId: created.id,
            candidateProfileId: created.candidateProfileId,
            instructorProfileId: created.instructorProfileId,
            pinCode: this.buildPinCode(),
            status: LessonStatus.SCHEDULED,
          },
        });
      }

      return created;
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.BOOKING,
      entityId: booking.id,
      action: 'BOOKING_CREATED',
      metadataJson: {
        candidateProfileId: booking.candidateProfileId,
        instructorProfileId: booking.instructorProfileId,
        scheduledStart: booking.scheduledStart,
        scheduledEnd: booking.scheduledEnd,
      },
    });

    return this.normalizeBooking(booking);
  }

  async createForCandidate(userId: string, dto: CreateBookingDto) {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidateProfile) {
      throw new UnauthorizedException('Candidate profile not found for this user.');
    }

    return this.create({
      ...dto,
      candidateProfileId: candidateProfile.id,
    }, userId);
  }

  async list(filters: { candidateProfileId?: string; instructorProfileId?: string; schoolId?: string }) {
    const bookings = await this.prisma.booking.findMany({
      where: filters,
      orderBy: { scheduledStart: 'asc' },
      include: {
        candidateProfile: {
          select: {
            id: true,
            fullName: true,
          },
        },
        instructorProfile: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        package: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return bookings.map((item) => this.normalizeBooking(item));
  }

  async listMine(userId: string, role: UserRole) {
    if (role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
      if (!candidate) throw new NotFoundException('Candidate profile not found.');
      return this.list({ candidateProfileId: candidate.id });
    }

    if (role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
      if (!instructor) throw new NotFoundException('Instructor profile not found.');
      return this.list({ instructorProfileId: instructor.id });
    }

    if (role === UserRole.SCHOOL_MANAGER) {
      const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
      if (!school) throw new NotFoundException('School not found.');
      return this.list({ schoolId: school.id });
    }

    return this.prisma.booking.findMany({ orderBy: { scheduledStart: 'asc' }, take: 100 });
  }

  async cancel(id: string, dto: CancelBookingDto, actorUser?: { userId: string; role: UserRole }) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');

    if (actorUser) {
      await this.assertBookingAccess(booking, actorUser.userId, actorUser.role);
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled.');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Completed bookings cannot be cancelled.');
    }

    const lesson = await this.prisma.lesson.findFirst({ where: { bookingId: id } });
    if (lesson?.status === LessonStatus.IN_PROGRESS || lesson?.status === LessonStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel booking with lesson already in progress or completed.');
    }

    const hoursToStart = (booking.scheduledStart.getTime() - Date.now()) / (1000 * 60 * 60);
    if (actorUser?.role === UserRole.CANDIDATE && hoursToStart < 24) {
      throw new BadRequestException('Candidate cancellation requires at least 24 hours notice.');
    }
    if (actorUser?.role === UserRole.INSTRUCTOR && hoursToStart < 6) {
      throw new BadRequestException('Instructor cancellation requires at least 6 hours notice.');
    }

    const cancelled = await this.prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.CANCELLED,
        cancelReason: dto.reason,
      },
    });

    await this.prisma.lesson.updateMany({
      where: {
        bookingId: id,
        status: { in: [LessonStatus.SCHEDULED, LessonStatus.CHECK_IN_PENDING] },
      },
      data: {
        status: LessonStatus.CANCELLED,
        notes: dto.reason,
      },
    });

    await this.prisma.payment.updateMany({
      where: {
        bookingId: id,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.AUTHORIZED] },
      },
      data: {
        status: PaymentStatus.CANCELLED,
      },
    });

    await this.auditService.log({
      actorUserId: actorUser?.userId,
      entityType: EntityType.BOOKING,
      entityId: id,
      action: 'BOOKING_CANCELLED',
      metadataJson: {
        previousStatus: booking.status,
        reason: dto.reason,
      },
    });

    return this.normalizeBooking(cancelled);
  }

  async reschedule(id: string, dto: RescheduleBookingDto, actorUser?: { userId: string; role: UserRole }) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');

    if (actorUser) {
      await this.assertBookingAccess(booking, actorUser.userId, actorUser.role);
    }

    if (!booking.instructorProfileId) {
      throw new BadRequestException('Booking has no instructor assigned.');
    }

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Only active bookings can be rescheduled.');
    }

    const lesson = await this.prisma.lesson.findFirst({ where: { bookingId: id } });
    if (lesson?.status === LessonStatus.IN_PROGRESS || lesson?.status === LessonStatus.COMPLETED) {
      throw new BadRequestException('Cannot reschedule booking with lesson already in progress or completed.');
    }

    const currentHoursToStart = (booking.scheduledStart.getTime() - Date.now()) / (1000 * 60 * 60);
    if (actorUser?.role === UserRole.CANDIDATE && currentHoursToStart < 12) {
      throw new BadRequestException('Candidate reschedule requires at least 12 hours notice.');
    }

    const scheduledStart = new Date(dto.scheduledStart);
    const scheduledEnd = new Date(dto.scheduledEnd);
    this.validateWindow(scheduledStart, scheduledEnd);
    await this.validateInstructorAvailability(booking.instructorProfileId, scheduledStart, scheduledEnd);
    await this.validateInstructorConflict(booking.instructorProfileId, scheduledStart, scheduledEnd, id);

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        scheduledStart,
        scheduledEnd,
        status: BookingStatus.RESCHEDULED,
        rescheduleReason: dto.reason,
      },
    });

    await this.auditService.log({
      actorUserId: actorUser?.userId,
      entityType: EntityType.BOOKING,
      entityId: id,
      action: 'BOOKING_RESCHEDULED',
      metadataJson: {
        previousStart: booking.scheduledStart,
        previousEnd: booking.scheduledEnd,
        scheduledStart,
        scheduledEnd,
        reason: dto.reason,
      },
    });

    return this.normalizeBooking(updated);
  }

  async listMineAsInstructor(userId: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
    if (!instructor) {
      throw new NotFoundException('Instructor profile not found.');
    }

    return this.list({ instructorProfileId: instructor.id });
  }

  async findOne(id: string, userId: string, role: UserRole) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        lessons: true,
        package: true,
        candidateProfile: {
          select: {
            id: true,
            fullName: true,
          },
        },
        instructorProfile: {
          select: {
            id: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return null;
    }

    await this.assertBookingAccess(booking, userId, role);

    return this.normalizeBooking(booking);
  }
}
