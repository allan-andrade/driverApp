import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EntityType, IncidentStatus, NotificationType, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { MetricsService } from '../metrics/metrics.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly notificationsService: NotificationsService,
    private readonly metricsService: MetricsService,
  ) {}

  private async assertReporterCanOpen(
    user: { userId: string; role: UserRole },
    booking: { candidateProfileId: string; instructorProfileId: string | null; schoolId: string | null },
  ) {
    if (user.role === UserRole.ADMIN) {
      return;
    }

    if (user.role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId: user.userId } });
      if (!candidate || booking.candidateProfileId !== candidate.id) {
        throw new UnauthorizedException('Candidate is not related to this booking.');
      }
      return;
    }

    if (user.role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId: user.userId } });
      if (!instructor || booking.instructorProfileId !== instructor.id) {
        throw new UnauthorizedException('Instructor is not related to this booking.');
      }
      return;
    }

    const school = await this.prisma.school.findUnique({ where: { managerUserId: user.userId } });
    if (!school || booking.schoolId !== school.id) {
      throw new UnauthorizedException('School manager is not related to this booking.');
    }
  }

  async create(user: { userId: string; role: UserRole }, dto: CreateIncidentDto) {
    if (!dto.bookingId && !dto.lessonId) {
      throw new BadRequestException('bookingId or lessonId is required to open an incident.');
    }

    const lesson = dto.lessonId
      ? await this.prisma.lesson.findUnique({
          where: { id: dto.lessonId },
          select: { id: true, bookingId: true },
        })
      : null;

    if (dto.lessonId && !lesson) {
      throw new NotFoundException('Lesson not found.');
    }

    const bookingId = dto.bookingId ?? lesson?.bookingId;
    if (!bookingId) {
      throw new BadRequestException('Unable to resolve booking for this incident.');
    }

    if (dto.bookingId && lesson?.bookingId && dto.bookingId !== lesson.bookingId) {
      throw new BadRequestException('bookingId does not match lesson booking.');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
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

    await this.assertReporterCanOpen(user, booking);

    const incident = await this.prisma.incidentReport.create({
      data: {
        reporterUserId: user.userId,
        bookingId,
        lessonId: lesson?.id,
        reportedUserId: dto.reportedUserId,
        type: dto.type,
        severity: dto.severity,
        description: dto.description,
        evidenceUrl: dto.evidenceUrl,
      },
    });

    await this.auditService.log({
      actorUserId: user.userId,
      entityType: EntityType.INCIDENT_REPORT,
      entityId: incident.id,
      action: 'INCIDENT_CREATED',
      metadataJson: {
        type: incident.type,
        severity: incident.severity,
      },
    });

    if (booking.instructorProfileId) {
      await this.metricsService.recalculateForInstructor(booking.instructorProfileId, user.userId, 'INCIDENT_CREATED');
    }

    await this.notificationsService.notifyBookingParticipants(
      bookingId,
      NotificationType.INCIDENT_UPDATED,
      'Incidente registrado',
      'Um incidente foi registrado para a reserva.',
      user.userId,
    );

    return incident;
  }

  async listMine(userId: string, role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.listAll();
    }

    return this.prisma.incidentReport.findMany({
      where: {
        OR: [{ reporterUserId: userId }, { reportedUserId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true,
        lesson: true,
      },
      take: 200,
    });
  }

  listAll() {
    return this.prisma.incidentReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        booking: true,
        lesson: true,
        reporterUser: {
          select: { id: true, email: true, role: true },
        },
        reportedUser: {
          select: { id: true, email: true, role: true },
        },
      },
      take: 200,
    });
  }

  async updateStatus(id: string, status: IncidentStatus, actorUserId?: string) {
    const incident = await this.prisma.incidentReport.update({
      where: { id },
      data: { status },
      include: {
        booking: { select: { id: true, instructorProfileId: true } },
      },
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.INCIDENT_REPORT,
      entityId: id,
      action: 'INCIDENT_STATUS_UPDATED',
      metadataJson: {
        status,
      },
    });

    if (incident.booking?.id) {
      await this.notificationsService.notifyBookingParticipants(
        incident.booking.id,
        NotificationType.INCIDENT_UPDATED,
        'Incidente atualizado',
        `Status do incidente atualizado para ${status}.`,
        actorUserId,
      );
    }

    if (incident.booking?.instructorProfileId) {
      await this.metricsService.recalculateForInstructor(incident.booking.instructorProfileId, actorUserId, 'INCIDENT_UPDATED');
    }

    return incident;
  }
}
