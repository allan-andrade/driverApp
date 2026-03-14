import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BookingStatus, LessonStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(dto: CreateBookingDto) {
    if (!dto.candidateProfileId) {
      throw new UnauthorizedException('candidateProfileId is required.');
    }

    const data = {
      candidateProfileId: dto.candidateProfileId,
      instructorProfileId: dto.instructorProfileId,
      schoolId: dto.schoolId,
      packageId: dto.packageId,
      scheduledStart: new Date(dto.scheduledStart),
      scheduledEnd: new Date(dto.scheduledEnd),
      priceTotal: dto.priceTotal,
      platformFee: dto.platformFee,
      status: BookingStatus.CONFIRMED,
    };

    const booking = await this.prisma.booking.create({
      data,
    });

    await this.paymentsService.createPending(booking.id, Number(dto.priceTotal));

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

    return booking;
  }

  async createForCandidate(userId: string, dto: CreateBookingDto) {
    const candidateProfile = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidateProfile) {
      throw new UnauthorizedException('Candidate profile not found for this user.');
    }

    return this.create({
      ...dto,
      candidateProfileId: candidateProfile.id,
    });
  }

  list(filters: { candidateProfileId?: string; instructorProfileId?: string; schoolId?: string }) {
    return this.prisma.booking.findMany({ where: filters, orderBy: { scheduledStart: 'asc' } });
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

  async cancel(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');

    return this.prisma.booking.update({ where: { id }, data: { status: BookingStatus.CANCELLED } });
  }

  async reschedule(id: string, dto: RescheduleBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');

    return this.prisma.booking.update({
      where: { id },
      data: {
        scheduledStart: new Date(dto.scheduledStart),
        scheduledEnd: new Date(dto.scheduledEnd),
        status: BookingStatus.RESCHEDULED,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({ where: { id }, include: { lessons: true, package: true } });
  }
}
