import { Injectable } from '@nestjs/common';
import { NotificationType, ReminderChannel, ReminderType, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class RemindersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly queueService: QueueService,
  ) {}

  async queueBookingReminder(bookingId: string, actorUserId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        candidateProfile: true,
        instructorProfile: true,
      },
    });

    if (!booking) {
      return { queued: false, reason: 'BOOKING_NOT_FOUND' };
    }

    const userIds = [booking.candidateProfile.userId, booking.instructorProfile?.userId].filter(
      (item): item is string => Boolean(item),
    );

    await this.queueService.enqueueAuditEvent({
      type: 'REMINDER_QUEUE',
      bookingId,
      userIds,
      actorUserId,
    });

    await this.prisma.reminderJobLog.createMany({
      data: userIds.map((userId) => ({
        userId,
        bookingId,
        type: ReminderType.BOOKING_REMINDER,
        channel: ReminderChannel.IN_APP,
        status: 'QUEUED',
        payloadJson: { actorUserId },
      })),
    });

    return { queued: true, userIdsCount: userIds.length };
  }

  async processDueReminders() {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingBookings = await this.prisma.booking.findMany({
      where: {
        scheduledStart: {
          gte: now,
          lte: in24h,
        },
        status: {
          in: ['CONFIRMED', 'RESCHEDULED'],
        },
      },
      include: {
        candidateProfile: true,
        instructorProfile: true,
      },
      take: 300,
    });

    let sentCount = 0;

    for (const booking of upcomingBookings) {
      const userIds = [booking.candidateProfile.userId, booking.instructorProfile?.userId].filter(
        (item): item is string => Boolean(item),
      );

      if (userIds.length === 0) {
        continue;
      }

      await this.notificationsService.notifyUsers({
        userIds,
        type: NotificationType.LESSON_REMINDER,
        title: 'Lembrete de aula',
        message: 'Voce tem aula agendada nas proximas 24 horas.',
        payloadJson: { bookingId: booking.id, scheduledStart: booking.scheduledStart.toISOString() },
      });

      await this.prisma.reminderJobLog.createMany({
        data: userIds.map((userId) => ({
          userId,
          bookingId: booking.id,
          type: ReminderType.LESSON_REMINDER,
          channel: ReminderChannel.IN_APP,
          status: 'SENT',
          processedAt: new Date(),
        })),
      });

      sentCount += userIds.length;
    }

    return {
      processedBookings: upcomingBookings.length,
      sentCount,
    };
  }

  async listLogs(role: UserRole, userId: string) {
    if (role === UserRole.ADMIN) {
      return this.prisma.reminderJobLog.findMany({ orderBy: { createdAt: 'desc' }, take: 500 });
    }

    return this.prisma.reminderJobLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
