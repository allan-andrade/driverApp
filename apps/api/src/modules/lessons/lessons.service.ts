import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BookingStatus, EntityType, LessonStatus, PaymentStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { PaymentsService } from '../payments/payments.service';
import { FinishLessonDto } from './dto/finish-lesson.dto';
import { StartLessonDto } from './dto/start-lesson.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly paymentsService: PaymentsService,
  ) {}

  listByInstructor(instructorProfileId: string) {
    return this.prisma.lesson.findMany({ where: { instructorProfileId }, orderBy: { createdAt: 'desc' } });
  }

  async listMine(userId: string, role: UserRole) {
    if (role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
      if (!candidate) throw new NotFoundException('Candidate profile not found.');
      return this.prisma.lesson.findMany({
        where: { candidateProfileId: candidate.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
      if (!instructor) throw new NotFoundException('Instructor profile not found.');
      return this.listByInstructor(instructor.id);
    }

    if (role === UserRole.SCHOOL_MANAGER) {
      const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
      if (!school) throw new NotFoundException('School not found.');
      return this.prisma.lesson.findMany({
        where: { booking: { schoolId: school.id } },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.lesson.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async findOne(lessonId: string, userId: string, role: UserRole) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        booking: true,
        candidateProfile: true,
        instructorProfile: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found.');
    }

    if (role === UserRole.ADMIN) {
      return lesson;
    }

    if (role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
      if (!candidate || candidate.id !== lesson.candidateProfileId) {
        throw new UnauthorizedException('You are not allowed to view this lesson.');
      }
      return lesson;
    }

    if (role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
      if (!instructor || instructor.id !== lesson.instructorProfileId) {
        throw new UnauthorizedException('You are not allowed to view this lesson.');
      }
      return lesson;
    }

    const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
    if (!school || lesson.booking.schoolId !== school.id) {
      throw new UnauthorizedException('You are not allowed to view this lesson.');
    }
    return lesson;
  }

  private ensureCanTransition(currentStatus: LessonStatus, allowed: LessonStatus[], action: string) {
    if (!allowed.includes(currentStatus)) {
      throw new BadRequestException(`Cannot ${action} when lesson is ${currentStatus}.`);
    }
  }

  private async assertOperatorAccess(
    lesson: { instructorProfileId: string; booking: { schoolId: string | null } },
    actor: { userId: string; role: UserRole },
  ) {
    if (actor.role === UserRole.ADMIN) {
      return;
    }

    if (actor.role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId: actor.userId } });
      if (!instructor || instructor.id !== lesson.instructorProfileId) {
        throw new UnauthorizedException('You are not allowed to operate this lesson.');
      }
      return;
    }

    if (actor.role === UserRole.SCHOOL_MANAGER) {
      const school = await this.prisma.school.findUnique({ where: { managerUserId: actor.userId } });
      if (!school || school.id !== lesson.booking.schoolId) {
        throw new UnauthorizedException('You are not allowed to operate this lesson.');
      }
      return;
    }

    throw new UnauthorizedException('You are not allowed to operate this lesson.');
  }

  async checkIn(lessonId: string, dto: VerifyPinDto, actor: { userId: string; role: UserRole }) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { booking: { select: { schoolId: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    await this.assertOperatorAccess(lesson, actor);

    this.ensureCanTransition(lesson.status, [LessonStatus.SCHEDULED, LessonStatus.CHECK_IN_PENDING], 'check in');

    if (lesson.pinCode !== dto.pinCode) {
      throw new UnauthorizedException('Invalid PIN code.');
    }

    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        pinVerified: true,
        status: LessonStatus.CHECK_IN_PENDING,
      },
    });

    await this.auditService.log({
      actorUserId: actor.userId,
      entityType: EntityType.LESSON,
      entityId: lessonId,
      action: 'LESSON_CHECK_IN_VERIFIED',
      metadataJson: {},
    });

    return updated;
  }

  async start(lessonId: string, dto: StartLessonDto, actor: { userId: string; role: UserRole }) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { booking: { select: { schoolId: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    await this.assertOperatorAccess(lesson, actor);

    this.ensureCanTransition(lesson.status, [LessonStatus.SCHEDULED, LessonStatus.CHECK_IN_PENDING], 'start lesson');

    if (!lesson.pinVerified) {
      throw new BadRequestException('PIN must be verified before starting the lesson.');
    }

    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        startedAt: new Date(),
        startLat: dto.startLat,
        startLng: dto.startLng,
        startAddress: dto.startAddress,
        status: LessonStatus.IN_PROGRESS,
      },
    });

    await this.auditService.log({
      actorUserId: actor.userId,
      entityType: EntityType.LESSON,
      entityId: lessonId,
      action: 'LESSON_STARTED',
      metadataJson: {
        startLat: dto.startLat,
        startLng: dto.startLng,
      },
    });

    return updated;
  }

  async finish(lessonId: string, dto: FinishLessonDto, actor: { userId: string; role: UserRole }) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { booking: { select: { schoolId: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    await this.assertOperatorAccess(lesson, actor);

    this.ensureCanTransition(lesson.status, [LessonStatus.IN_PROGRESS], 'finish lesson');

    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        finishedAt: new Date(),
        endLat: dto.endLat,
        endLng: dto.endLng,
        endAddress: dto.endAddress,
        notes: dto.notes,
        status: LessonStatus.COMPLETED,
      },
    });

    await this.prisma.booking.update({
      where: { id: lesson.bookingId },
      data: { status: BookingStatus.COMPLETED },
    });

    const payment = await this.prisma.payment.findFirst({
      where: {
        bookingId: lesson.bookingId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.AUTHORIZED] },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (payment) {
      await this.paymentsService.capture(payment.id, actor.userId);
    }

    await this.auditService.log({
      actorUserId: actor.userId,
      entityType: EntityType.LESSON,
      entityId: lessonId,
      action: 'LESSON_FINISHED',
      metadataJson: {
        bookingId: lesson.bookingId,
      },
    });

    return updated;
  }

  async markNoShow(lessonId: string, reason: string | undefined, actor: { userId: string; role: UserRole }) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { booking: { select: { schoolId: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    await this.assertOperatorAccess(lesson, actor);

    this.ensureCanTransition(lesson.status, [LessonStatus.SCHEDULED, LessonStatus.CHECK_IN_PENDING], 'mark no show');

    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: LessonStatus.NO_SHOW,
        notes: reason,
      },
    });

    await this.prisma.booking.update({
      where: { id: lesson.bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.CANCELLED,
        cancelReason: reason ?? 'NO_SHOW',
      },
    });

    await this.prisma.payment.updateMany({
      where: {
        bookingId: lesson.bookingId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.AUTHORIZED] },
      },
      data: {
        status: PaymentStatus.CANCELLED,
      },
    });

    await this.auditService.log({
      actorUserId: actor.userId,
      entityType: EntityType.LESSON,
      entityId: lessonId,
      action: 'LESSON_MARKED_NO_SHOW',
      metadataJson: {
        reason,
      },
    });

    return updated;
  }

  async cancel(lessonId: string, reason: string | undefined, actor: { userId: string; role: UserRole }) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { booking: { select: { schoolId: true } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    await this.assertOperatorAccess(lesson, actor);

    this.ensureCanTransition(lesson.status, [LessonStatus.SCHEDULED, LessonStatus.CHECK_IN_PENDING], 'cancel lesson');

    const updated = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: LessonStatus.CANCELLED,
        notes: reason,
      },
    });

    await this.prisma.booking.update({
      where: { id: lesson.bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        paymentStatus: PaymentStatus.CANCELLED,
        cancelReason: reason,
      },
    });

    await this.prisma.payment.updateMany({
      where: {
        bookingId: lesson.bookingId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.AUTHORIZED] },
      },
      data: {
        status: PaymentStatus.CANCELLED,
      },
    });

    await this.auditService.log({
      actorUserId: actor.userId,
      entityType: EntityType.LESSON,
      entityId: lessonId,
      action: 'LESSON_CANCELLED',
      metadataJson: {
        reason,
      },
    });

    return updated;
  }
}
