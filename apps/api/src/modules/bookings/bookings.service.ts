import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BookingStatus, EntityType, LessonStatus, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { PaymentsService } from '../payments/payments.service';
import { PackagesService } from '../packages/packages.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly paymentsService: PaymentsService,
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

  private normalizeBooking<T extends { priceTotal: unknown; platformFee: unknown }>(booking: T) {
    return {
      ...booking,
      priceTotal: Number(booking.priceTotal),
      platformFee: Number(booking.platformFee),
    };
  }

  async create(dto: CreateBookingDto, actorUserId?: string) {
    if (!dto.candidateProfileId) {
      throw new UnauthorizedException('candidateProfileId is required.');
    }

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

    const data = {
      candidateProfileId: dto.candidateProfileId,
      instructorProfileId: dto.instructorProfileId,
      schoolId: dto.schoolId,
      packageId: dto.packageId,
      scheduledStart,
      scheduledEnd,
      priceTotal,
      platformFee,
      status: BookingStatus.CONFIRMED,
    } satisfies Prisma.BookingUncheckedCreateInput;

    const booking = await this.prisma.booking.create({
      data,
    });

    await this.paymentsService.createPending(booking.id, Number(priceTotal));

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

    if (booking.instructorProfileId) {
      await this.prisma.lesson.create({
        data: {
          bookingId: booking.id,
          candidateProfileId: booking.candidateProfileId,
          instructorProfileId: booking.instructorProfileId,
          pinCode: String(Math.floor(1000 + Math.random() * 9000)),
          status: LessonStatus.SCHEDULED,
        },
      });
    }

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

  async cancel(id: string, actorUserId?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled.');
    }

    const cancelled = await this.prisma.booking.update({ where: { id }, data: { status: BookingStatus.CANCELLED } });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.BOOKING,
      entityId: id,
      action: 'BOOKING_CANCELLED',
      metadataJson: {
        previousStatus: booking.status,
      },
    });

    return this.normalizeBooking(cancelled);
  }

  async reschedule(id: string, dto: RescheduleBookingDto, actorUserId?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');

    if (!booking.instructorProfileId) {
      throw new BadRequestException('Booking has no instructor assigned.');
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
      },
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.BOOKING,
      entityId: id,
      action: 'BOOKING_RESCHEDULED',
      metadataJson: {
        previousStart: booking.scheduledStart,
        previousEnd: booking.scheduledEnd,
        scheduledStart,
        scheduledEnd,
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

  async findOne(id: string) {
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

    return this.normalizeBooking(booking);
  }
}
