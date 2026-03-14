import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, DisputeStatus, EntityType, IncidentStatus, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class MetricsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private clamp(value: number, min = 0, max = 100) {
    return Math.min(max, Math.max(min, value));
  }

  private toNumber(value: unknown) {
    if (value === null || value === undefined) return 0;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private round2(value: number) {
    return Number(value.toFixed(2));
  }

  async getInstructorMetrics(instructorProfileId: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({ where: { id: instructorProfileId } });
    if (!instructor) {
      throw new NotFoundException('Instructor not found.');
    }

    const metrics = await this.prisma.instructorMetrics.findUnique({ where: { instructorProfileId } });
    if (metrics) {
      return metrics;
    }

    return this.recalculateForInstructor(instructorProfileId, undefined, 'INITIALIZE');
  }

  listAll() {
    return this.prisma.instructorMetrics.findMany({
      orderBy: [{ marketplaceScore: 'desc' }, { trustScore: 'desc' }],
      include: {
        instructorProfile: {
          include: {
            user: { select: { id: true, email: true } },
          },
        },
      },
      take: 500,
    });
  }

  async recalculateForInstructor(instructorProfileId: string, actorUserId?: string, source = 'MANUAL') {
    const instructor = await this.prisma.instructorProfile.findUnique({
      where: { id: instructorProfileId },
      include: {
        availabilitySlots: { where: { isActive: true } },
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found.');
    }

    const [reviewAgg, totalReviews, completedLessons, noShowCount, cancelledBookings, totalBookings, incidentCount, disputeCount] =
      await this.prisma.$transaction([
        this.prisma.review.aggregate({
          where: { instructorProfileId },
          _avg: {
            punctuality: true,
            didactics: true,
            professionalism: true,
            safety: true,
            examReadiness: true,
          },
        }),
        this.prisma.review.count({ where: { instructorProfileId } }),
        this.prisma.lesson.count({ where: { instructorProfileId, status: 'COMPLETED' } }),
        this.prisma.lesson.count({ where: { instructorProfileId, status: 'NO_SHOW' } }),
        this.prisma.booking.count({ where: { instructorProfileId, status: BookingStatus.CANCELLED } }),
        this.prisma.booking.count({ where: { instructorProfileId } }),
        this.prisma.incidentReport.count({
          where: {
            status: { in: [IncidentStatus.OPEN, IncidentStatus.UNDER_REVIEW] },
            OR: [{ booking: { instructorProfileId } }, { lesson: { instructorProfileId } }],
          },
        }),
        this.prisma.dispute.count({
          where: {
            status: { in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW] },
            OR: [
              { booking: { instructorProfileId } },
              { lesson: { instructorProfileId } },
              { payment: { instructorProfileId } },
            ],
          },
        }),
      ]);

    const punctualityAvg = this.toNumber(reviewAgg._avg.punctuality);
    const didacticsAvg = this.toNumber(reviewAgg._avg.didactics);
    const professionalismAvg = this.toNumber(reviewAgg._avg.professionalism);
    const safetyAvg = this.toNumber(reviewAgg._avg.safety);
    const examReadinessAvg = this.toNumber(reviewAgg._avg.examReadiness);
    const averageRating = (punctualityAvg + didacticsAvg + professionalismAvg + safetyAvg + examReadinessAvg) / 5;

    const totalLessons = Math.max(1, completedLessons + noShowCount + cancelledBookings);
    const attendanceRate = this.clamp((completedLessons / totalLessons) * 100);
    const completionRate = this.clamp((completedLessons / Math.max(totalBookings, 1)) * 100);

    const verificationBonus =
      instructor.verificationStatus === VerificationStatus.APPROVED || instructor.verificationStatus === VerificationStatus.VERIFIED
        ? 15
        : instructor.verificationStatus === VerificationStatus.PENDING
          ? 6
          : 0;

    const trustRaw =
      35 +
      verificationBonus +
      attendanceRate * 0.2 +
      completionRate * 0.15 +
      punctualityAvg * 4 +
      safetyAvg * 2 -
      Math.min(12, cancelledBookings * 1.2) -
      Math.min(12, noShowCount * 2) -
      Math.min(16, incidentCount * 3) -
      Math.min(10, disputeCount * 2);

    const consistencyBonus = totalReviews >= 5 ? 10 : totalReviews * 2;
    const volumeBonus = Math.min(10, completedLessons / 5);

    let teachingRaw =
      20 +
      didacticsAvg * 8 +
      professionalismAvg * 4 +
      examReadinessAvg * 4 +
      consistencyBonus +
      volumeBonus;

    if (totalReviews < 3) {
      teachingRaw *= 0.8;
    }

    const trustScore = this.clamp(trustRaw);
    const teachingScore = this.clamp(teachingRaw);

    const availabilityBonus = instructor.availabilitySlots.length > 0 ? 6 : 0;
    const vehicleBonus =
      (await this.prisma.vehicle.count({
        where: {
          instructorProfileId,
          verificationStatus: {
            in: [VerificationStatus.APPROVED, VerificationStatus.VERIFIED],
          },
        },
      })) > 0
        ? 4
        : 0;
    const price = Number(instructor.basePrice ?? 0);
    const priceScore = price <= 0 ? 0 : this.clamp(8 - price / 40, 0, 8);
    const socialProof = Math.min(6, totalReviews / 4);
    const lessonVolume = Math.min(6, completedLessons / 10);

    const marketplaceScore = this.clamp(
      trustScore * 0.42 +
        teachingScore * 0.38 +
        verificationBonus * 0.4 +
        availabilityBonus +
        vehicleBonus +
        priceScore +
        socialProof +
        lessonVolume,
    );

    const persisted = await this.prisma.instructorMetrics.upsert({
      where: { instructorProfileId },
      create: {
        instructorProfileId,
        averageRating: this.round2(averageRating),
        punctualityAvg: this.round2(punctualityAvg),
        didacticsAvg: this.round2(didacticsAvg),
        professionalismAvg: this.round2(professionalismAvg),
        safetyAvg: this.round2(safetyAvg),
        examReadinessAvg: this.round2(examReadinessAvg),
        totalReviews,
        completedLessons,
        cancelledBookings,
        noShowCount,
        attendanceRate: this.round2(attendanceRate),
        completionRate: this.round2(completionRate),
        trustScore: this.round2(trustScore),
        teachingScore: this.round2(teachingScore),
        marketplaceScore: this.round2(marketplaceScore),
      },
      update: {
        averageRating: this.round2(averageRating),
        punctualityAvg: this.round2(punctualityAvg),
        didacticsAvg: this.round2(didacticsAvg),
        professionalismAvg: this.round2(professionalismAvg),
        safetyAvg: this.round2(safetyAvg),
        examReadinessAvg: this.round2(examReadinessAvg),
        totalReviews,
        completedLessons,
        cancelledBookings,
        noShowCount,
        attendanceRate: this.round2(attendanceRate),
        completionRate: this.round2(completionRate),
        trustScore: this.round2(trustScore),
        teachingScore: this.round2(teachingScore),
        marketplaceScore: this.round2(marketplaceScore),
      },
      include: {
        instructorProfile: {
          include: {
            user: { select: { id: true, email: true } },
          },
        },
      },
    });

    await this.auditService.log({
      actorUserId,
      entityType: EntityType.INSTRUCTOR_METRICS,
      entityId: persisted.id,
      action: 'INSTRUCTOR_METRICS_RECALCULATED',
      metadataJson: {
        instructorProfileId,
        source,
        trustScore: persisted.trustScore,
        teachingScore: persisted.teachingScore,
        marketplaceScore: persisted.marketplaceScore,
      },
    });

    return persisted;
  }
}
