import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DisputeStatus, EntityType, NotificationType, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { MetricsService } from '../metrics/metrics.service';
import { NotificationsService } from '../notifications/notifications.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
    private readonly metricsService: MetricsService,
    private readonly walletsService: WalletsService,
  ) {}

  private async assertActorScope(
    user: { userId: string; role: UserRole },
    booking: { candidateProfileId: string; instructorProfileId: string | null; schoolId: string | null },
  ) {
    if (user.role === UserRole.ADMIN) {
      return;
    }

    if (user.role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId: user.userId } });
      if (!candidate || candidate.id !== booking.candidateProfileId) {
        throw new UnauthorizedException('Candidate is not related to this booking.');
      }
      return;
    }

    if (user.role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId: user.userId } });
      if (!instructor || instructor.id !== booking.instructorProfileId) {
        throw new UnauthorizedException('Instructor is not related to this booking.');
      }
      return;
    }

    const school = await this.prisma.school.findUnique({ where: { managerUserId: user.userId } });
    if (!school || school.id !== booking.schoolId) {
      throw new UnauthorizedException('School manager is not related to this booking.');
    }
  }

  async create(user: { userId: string; role: UserRole }, dto: CreateDisputeDto) {
    if (!dto.bookingId && !dto.lessonId && !dto.paymentId) {
      throw new BadRequestException('bookingId, lessonId or paymentId is required to open a dispute.');
    }

    const lesson = dto.lessonId
      ? await this.prisma.lesson.findUnique({ where: { id: dto.lessonId }, select: { id: true, bookingId: true } })
      : null;
    if (dto.lessonId && !lesson) {
      throw new NotFoundException('Lesson not found.');
    }

    const payment = dto.paymentId
      ? await this.prisma.payment.findUnique({ where: { id: dto.paymentId }, select: { id: true, bookingId: true } })
      : null;
    if (dto.paymentId && !payment) {
      throw new NotFoundException('Payment not found.');
    }

    const resolvedBookingId = dto.bookingId ?? lesson?.bookingId ?? payment?.bookingId;
    if (!resolvedBookingId) {
      throw new BadRequestException('Unable to resolve booking for dispute.');
    }

    if (dto.bookingId && lesson?.bookingId && dto.bookingId !== lesson.bookingId) {
      throw new BadRequestException('bookingId does not match lesson booking.');
    }
    if (dto.bookingId && payment?.bookingId && dto.bookingId !== payment.bookingId) {
      throw new BadRequestException('bookingId does not match payment booking.');
    }
    if (lesson?.bookingId && payment?.bookingId && lesson.bookingId !== payment.bookingId) {
      throw new BadRequestException('lessonId and paymentId reference different bookings.');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: resolvedBookingId },
      select: {
        id: true,
        candidateProfileId: true,
        instructorProfileId: true,
        schoolId: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    await this.assertActorScope(user, booking);

    const dispute = await this.prisma.dispute.create({
      data: {
        openedByUserId: user.userId,
        bookingId: resolvedBookingId,
        lessonId: lesson?.id,
        paymentId: payment?.id,
        reason: dto.reason,
        description: dto.description,
      },
    });

    await this.auditService.log({
      actorUserId: user.userId,
      entityType: EntityType.DISPUTE,
      entityId: dispute.id,
      action: 'DISPUTE_CREATED',
      metadataJson: {
        bookingId: dispute.bookingId,
        lessonId: dispute.lessonId,
        paymentId: dispute.paymentId,
      },
    });

    if (dispute.paymentId) {
      await this.walletsService.holdByPayment(dispute.paymentId, 'Dispute opened', user.userId);
    }

    if (booking.instructorProfileId) {
      await this.metricsService.recalculateForInstructor(booking.instructorProfileId, user.userId, 'DISPUTE_CREATED');
    }

    await this.notificationsService.notifyBookingParticipants(
      resolvedBookingId,
      NotificationType.DISPUTE_UPDATED,
      'Disputa aberta',
      'Uma disputa foi aberta para esta reserva.',
      user.userId,
    );

    return dispute;
  }

  async listMine(userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.listAll();
    }

    return this.prisma.dispute.findMany({
      where: { openedByUserId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true,
        lesson: true,
        payment: true,
      },
    });
  }

  listAll() {
    return this.prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true,
        lesson: true,
        payment: true,
        openedBy: {
          select: { id: true, email: true, role: true },
        },
      },
      take: 200,
    });
  }

  async updateStatus(id: string, status: DisputeStatus, resolution?: string, actorUserId?: string) {
    const dispute = await this.prisma.dispute.update({
      where: { id },
      data: {
        status,
        resolution,
      },
      include: {
        booking: { select: { id: true, instructorProfileId: true } },
      },
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.DISPUTE,
      entityId: dispute.id,
      action: 'DISPUTE_STATUS_UPDATED',
      metadataJson: {
        status,
        resolution,
      },
    });

    if (dispute.booking?.id) {
      await this.notificationsService.notifyBookingParticipants(
        dispute.booking.id,
        NotificationType.DISPUTE_UPDATED,
        'Disputa atualizada',
        `Status da disputa atualizado para ${status}.`,
        actorUserId,
      );
    }

    if (dispute.booking?.instructorProfileId) {
      await this.metricsService.recalculateForInstructor(dispute.booking.instructorProfileId, actorUserId, 'DISPUTE_UPDATED');
    }

    return dispute;
  }
}
