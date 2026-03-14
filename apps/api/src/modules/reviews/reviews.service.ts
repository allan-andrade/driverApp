import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metricsService: MetricsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateReviewDto) {
    const review = await this.prisma.review.create({ data: dto });

    const instructor = await this.prisma.instructorProfile.findUnique({
      where: { id: dto.instructorProfileId },
      select: { userId: true },
    });

    await this.metricsService.recalculateForInstructor(dto.instructorProfileId, undefined, 'REVIEW_CREATED');

    if (instructor?.userId) {
      await this.notificationsService.notifyUsers({
        userIds: [instructor.userId],
        type: NotificationType.SYSTEM,
        title: 'Nova avaliacao recebida',
        message: 'Uma nova avaliacao foi registrada no seu perfil.',
        payloadJson: { bookingId: dto.bookingId, reviewId: review.id },
      });
    }

    return review;
  }

  listByInstructor(instructorProfileId: string) {
    return this.prisma.review.findMany({ where: { instructorProfileId }, orderBy: { createdAt: 'desc' } });
  }
}
