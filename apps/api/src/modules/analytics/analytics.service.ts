import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, DisputeStatus, IncidentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletsService: WalletsService,
  ) {}

  private toNumber(value: unknown) {
    const parsed = Number(value ?? 0);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  async candidateMe(userId: string) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) throw new NotFoundException('Candidate profile not found.');

    const [upcomingLessons, completedLessons, cancelledBookings, recentBookings, matching] = await this.prisma.$transaction([
      this.prisma.lesson.count({
        where: {
          candidateProfileId: candidate.id,
          status: { in: ['SCHEDULED', 'CHECK_IN_PENDING', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.lesson.count({ where: { candidateProfileId: candidate.id, status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { candidateProfileId: candidate.id, status: BookingStatus.CANCELLED } }),
      this.prisma.booking.findMany({
        where: { candidateProfileId: candidate.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.matchingSnapshot.findMany({
        where: { candidateProfileId: candidate.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          instructorProfile: {
            include: { user: { select: { email: true } } },
          },
        },
      }),
    ]);

    const progress = completedLessons + cancelledBookings === 0 ? 0 : (completedLessons / (completedLessons + cancelledBookings)) * 100;

    return {
      summary: {
        upcomingLessons,
        completedLessons,
        cancelledBookings,
        progress: Number(progress.toFixed(2)),
      },
      recentBookings,
      matching,
    };
  }

  async instructorMe(userId: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
    if (!instructor) throw new NotFoundException('Instructor profile not found.');

    const [bookingsTotal, completedLessons, cancelledBookings, noShows, reviewAgg, metrics, agendaSlots, wallet] =
      await Promise.all([
        this.prisma.booking.count({ where: { instructorProfileId: instructor.id } }),
        this.prisma.lesson.count({ where: { instructorProfileId: instructor.id, status: 'COMPLETED' } }),
        this.prisma.booking.count({ where: { instructorProfileId: instructor.id, status: BookingStatus.CANCELLED } }),
        this.prisma.lesson.count({ where: { instructorProfileId: instructor.id, status: 'NO_SHOW' } }),
        this.prisma.review.aggregate({
          where: { instructorProfileId: instructor.id },
          _avg: {
            punctuality: true,
            didactics: true,
            professionalism: true,
            safety: true,
            examReadiness: true,
          },
        }),
        this.prisma.instructorMetrics.findUnique({ where: { instructorProfileId: instructor.id } }),
        this.prisma.availabilitySlot.findMany({ where: { instructorProfileId: instructor.id, isActive: true } }),
        this.walletsService.getMyWallet(userId, 'INSTRUCTOR'),
      ]);

    const avgRating =
      (this.toNumber(reviewAgg._avg.punctuality) +
        this.toNumber(reviewAgg._avg.didactics) +
        this.toNumber(reviewAgg._avg.professionalism) +
        this.toNumber(reviewAgg._avg.safety) +
        this.toNumber(reviewAgg._avg.examReadiness)) /
      5;

    const occupancy = agendaSlots.length === 0 ? 0 : Math.min(100, (bookingsTotal / (agendaSlots.length * 10)) * 100);

    return {
      summary: {
        bookingsTotal,
        completedLessons,
        cancelledBookings,
        noShows,
        avgRating: Number(avgRating.toFixed(2)),
        trustScore: Number(metrics?.trustScore ?? 0),
        teachingScore: Number(metrics?.teachingScore ?? 0),
        agendaOccupancy: Number(occupancy.toFixed(2)),
      },
      revenue: {
        gross: Number((this.toNumber(wallet.balanceAvailable) + this.toNumber(wallet.balancePending) + this.toNumber(wallet.balanceOnHold)).toFixed(2)),
        pending: Number(this.toNumber(wallet.balancePending).toFixed(2)),
        available: Number(this.toNumber(wallet.balanceAvailable).toFixed(2)),
      },
    };
  }

  async schoolMe(userId: string) {
    const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
    if (!school) throw new NotFoundException('School not found.');

    const [linkedInstructors, totalBookings, completedLessons, documentPendencies, wallet] = await Promise.all([
      this.prisma.instructorSchoolLink.count({ where: { schoolId: school.id, status: 'ACTIVE' } }),
      this.prisma.booking.count({ where: { schoolId: school.id } }),
      this.prisma.lesson.count({ where: { booking: { schoolId: school.id }, status: 'COMPLETED' } }),
      this.prisma.documentSubmission.count({ where: { schoolId: school.id, verificationStatus: 'PENDING' } }),
      this.walletsService.getMyWallet(userId, 'SCHOOL_MANAGER'),
    ]);

    return {
      summary: {
        linkedInstructors,
        totalBookings,
        completedLessons,
        documentPendencies,
      },
      revenue: {
        aggregated: Number((this.toNumber(wallet.balanceAvailable) + this.toNumber(wallet.balancePending) + this.toNumber(wallet.balanceOnHold)).toFixed(2)),
        pending: Number(this.toNumber(wallet.balancePending).toFixed(2)),
        available: Number(this.toNumber(wallet.balanceAvailable).toFixed(2)),
      },
    };
  }

  async adminOverview() {
    const [
      totalUsers,
      totalInstructors,
      totalSchools,
      totalBookings,
      totalLessons,
      incidentsOpen,
      disputesOpen,
      documentsPending,
      paymentsByStatus,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.instructorProfile.count(),
      this.prisma.school.count(),
      this.prisma.booking.count(),
      this.prisma.lesson.count(),
      this.prisma.incidentReport.count({ where: { status: { in: [IncidentStatus.OPEN, IncidentStatus.UNDER_REVIEW] } } }),
      this.prisma.dispute.count({ where: { status: { in: [DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW] } } }),
      this.prisma.documentSubmission.count({ where: { verificationStatus: 'PENDING' } }),
      this.prisma.payment.groupBy({ by: ['status'], _count: { status: true } }),
    ]);

    return {
      totals: {
        totalUsers,
        totalInstructors,
        totalSchools,
        totalBookings,
        totalLessons,
        incidentsOpen,
        disputesOpen,
        documentsPending,
      },
      paymentsByStatus,
    };
  }

  async adminOperations() {
    const [
      paymentTotals,
      splitByStatus,
      payoutByStatus,
      attemptByStatus,
      webhookStats,
      fraudBySeverity,
      recentFraudSignals,
    ] = await Promise.all([
      this.prisma.payment.aggregate({
        _sum: { amount: true, platformFee: true },
        _count: { _all: true },
      }),
      this.prisma.paymentSplit.groupBy({ by: ['status'], _count: { _all: true }, _sum: { amount: true } }),
      this.prisma.payout.groupBy({ by: ['status'], _count: { _all: true }, _sum: { amountNet: true } }),
      this.prisma.paymentAttempt.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.webhookEvent.groupBy({ by: ['provider', 'processed'], _count: { _all: true } }),
      this.prisma.fraudSignal.groupBy({ by: ['severity'], _count: { _all: true }, _avg: { score: true } }),
      this.prisma.fraudSignal.findMany({
        include: {
          payment: true,
          booking: true,
          user: { select: { id: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    return {
      finance: {
        totalPayments: paymentTotals._count._all,
        grossAmount: Number(paymentTotals._sum.amount ?? 0),
        platformRevenue: Number(paymentTotals._sum.platformFee ?? 0),
        splits: splitByStatus.map((item) => ({
          status: item.status,
          count: item._count._all,
          amount: Number(item._sum.amount ?? 0),
        })),
        payouts: payoutByStatus.map((item) => ({
          status: item.status,
          count: item._count._all,
          amount: Number(item._sum.amountNet ?? 0),
        })),
        attempts: attemptByStatus.map((item) => ({
          status: item.status,
          count: item._count._all,
        })),
      },
      webhooks: webhookStats.map((item) => ({
        provider: item.provider,
        processed: item.processed,
        count: item._count._all,
      })),
      fraud: {
        summary: fraudBySeverity.map((item) => ({
          severity: item.severity,
          count: item._count._all,
          averageScore: Number(item._avg.score ?? 0),
        })),
        recent: recentFraudSignals,
      },
    };
  }
}
