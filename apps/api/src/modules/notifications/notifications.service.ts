import { Injectable } from '@nestjs/common';
import { EntityType, NotificationType, Prisma, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private shouldSendByType(type: NotificationType, preference: {
    inAppEnabled: boolean;
    bookingUpdates: boolean;
    lessonUpdates: boolean;
    paymentUpdates: boolean;
    safetyAlerts: boolean;
  }) {
    if (!preference.inAppEnabled) {
      return false;
    }

    switch (type) {
      case NotificationType.BOOKING_CREATED:
      case NotificationType.BOOKING_CONFIRMED:
      case NotificationType.BOOKING_CANCELLED:
      case NotificationType.BOOKING_RESCHEDULED:
        return preference.bookingUpdates;
      case NotificationType.LESSON_REMINDER:
      case NotificationType.LESSON_STARTED:
      case NotificationType.LESSON_COMPLETED:
        return preference.lessonUpdates;
      case NotificationType.PAYMENT_UPDATED:
      case NotificationType.PAYOUT_UPDATED:
        return preference.paymentUpdates;
      case NotificationType.DOCUMENT_REVIEWED:
      case NotificationType.INCIDENT_UPDATED:
      case NotificationType.DISPUTE_UPDATED:
        return preference.safetyAlerts;
      default:
        return true;
    }
  }

  async getPreferences(userId: string) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  async updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
    const prefs = await this.prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
      },
      update: dto,
    });

    await this.auditService.log({
      actorUserId: userId,
      entityType: EntityType.NOTIFICATION_PREFERENCE,
      entityId: prefs.id,
      action: 'NOTIFICATION_PREFERENCE_UPDATED',
      metadataJson: dto as unknown as Record<string, unknown>,
    });

    return prefs;
  }

  async notifyUsers(input: {
    userIds: string[];
    type: NotificationType;
    title: string;
    message: string;
    payloadJson?: Prisma.InputJsonValue;
    actorUserId?: string;
  }) {
    const uniqueUserIds = [...new Set(input.userIds)].filter(Boolean);
    if (uniqueUserIds.length === 0) {
      return [];
    }

    const preferences = await this.prisma.notificationPreference.findMany({
      where: { userId: { in: uniqueUserIds } },
    });

    const preferenceMap = new Map(preferences.map((item) => [item.userId, item]));

    const created = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const pref =
          preferenceMap.get(userId) ??
          ({
            inAppEnabled: true,
            bookingUpdates: true,
            lessonUpdates: true,
            paymentUpdates: true,
            safetyAlerts: true,
          } as const);

        if (!this.shouldSendByType(input.type, pref)) {
          return null;
        }

        const notification = await this.prisma.notification.create({
          data: {
            userId,
            type: input.type,
            title: input.title,
            message: input.message,
            payloadJson: input.payloadJson,
          },
        });

        await this.auditService.log({
          actorUserId: input.actorUserId,
          entityType: EntityType.NOTIFICATION,
          entityId: notification.id,
          action: 'NOTIFICATION_CREATED',
          metadataJson: {
            userId,
            type: input.type,
          },
        });

        return notification;
      }),
    );

    return created.filter((item): item is NonNullable<typeof item> => Boolean(item));
  }

  async notifyBookingParticipants(bookingId: string, type: NotificationType, title: string, message: string, actorUserId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        candidateProfile: { include: { user: true } },
        instructorProfile: { include: { user: true } },
        school: { include: { manager: true } },
      },
    });

    if (!booking) {
      return [];
    }

    const userIds = [
      booking.candidateProfile.userId,
      booking.instructorProfile?.userId,
      booking.school?.managerUserId,
    ].filter((value): value is string => Boolean(value));

    return this.notifyUsers({
      userIds,
      type,
      title,
      message,
      payloadJson: { bookingId: booking.id },
      actorUserId,
    });
  }

  async listMine(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async markAsRead(id: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });

    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    await this.auditService.log({
      actorUserId: userId,
      entityType: EntityType.NOTIFICATION,
      entityId: id,
      action: 'NOTIFICATION_READ',
      metadataJson: {},
    });

    return notification;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });

    await this.auditService.log({
      actorUserId: userId,
      entityType: EntityType.NOTIFICATION,
      entityId: userId,
      action: 'NOTIFICATION_READ_ALL',
      metadataJson: {},
    });

    return { ok: true };
  }

  async listForAdmin(userId: string, role: UserRole) {
    if (role !== UserRole.ADMIN) {
      return this.listMine(userId);
    }

    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true } } },
      take: 500,
    });
  }
}
