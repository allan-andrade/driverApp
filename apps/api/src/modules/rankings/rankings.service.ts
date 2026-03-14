import { Injectable } from '@nestjs/common';
import { EntityType, Prisma, VerificationStatus } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { AuditService } from '../audit/audit.service';

type RankingInput = {
  candidateProfileId?: string;
  instructorProfile: {
    id: string;
    city: string | null;
    state: string | null;
    basePrice: Prisma.Decimal | number | null;
    verificationStatus: VerificationStatus;
    categories: string[];
    instructorType: string;
    availabilitySlots: { id: string }[];
    vehicles: { transmissionType: string; categorySupported: string; verificationStatus: VerificationStatus }[];
    metrics: { trustScore: Prisma.Decimal | number; teachingScore: Prisma.Decimal | number; totalReviews: number; marketplaceScore: Prisma.Decimal | number } | null;
  };
  filters: {
    city?: string;
    state?: string;
    category?: string;
    transmissionType?: string;
    minPrice?: number;
    maxPrice?: number;
    verifiedOnly?: boolean;
    hasAvailability?: boolean;
    usesInstructorVehicle?: boolean;
    minScore?: number;
    minReviews?: number;
  };
};

@Injectable()
export class RankingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private num(value: unknown) {
    const parsed = Number(value ?? 0);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private clamp(value: number, min = 0, max = 100) {
    return Math.min(max, Math.max(min, value));
  }

  computeMatchingScore(input: RankingInput) {
    const trustScore = this.num(input.instructorProfile.metrics?.trustScore);
    const teachingScore = this.num(input.instructorProfile.metrics?.teachingScore);
    const marketplaceScore = this.num(input.instructorProfile.metrics?.marketplaceScore);
    const reviews = input.instructorProfile.metrics?.totalReviews ?? 0;
    const price = this.num(input.instructorProfile.basePrice);

    const cityMatch = input.filters.city && input.instructorProfile.city ? Number(input.filters.city === input.instructorProfile.city) : 0;
    const stateMatch = input.filters.state && input.instructorProfile.state ? Number(input.filters.state === input.instructorProfile.state) : 0;
    const categoryMatch = input.filters.category ? Number(input.instructorProfile.categories.includes(input.filters.category)) : 0;

    const hasAvailability = input.instructorProfile.availabilitySlots.length > 0;
    const verified =
      input.instructorProfile.verificationStatus === VerificationStatus.APPROVED ||
      input.instructorProfile.verificationStatus === VerificationStatus.VERIFIED;

    const transmissionMatch = input.filters.transmissionType
      ? Number(input.instructorProfile.vehicles.some((v) => v.transmissionType === input.filters.transmissionType))
      : 0;

    const minPrice = input.filters.minPrice ?? 0;
    const maxPrice = input.filters.maxPrice ?? Number.MAX_SAFE_INTEGER;
    const withinPrice = Number(price >= minPrice && price <= maxPrice);

    const score = this.clamp(
      marketplaceScore * 0.35 +
        trustScore * 0.2 +
        teachingScore * 0.2 +
        cityMatch * 8 +
        stateMatch * 6 +
        categoryMatch * 8 +
        withinPrice * 6 +
        transmissionMatch * 5 +
        (hasAvailability ? 6 : 0) +
        (verified ? 4 : 0) +
        Math.min(2, reviews / 20),
    );

    return {
      score,
      factors: {
        trustScore,
        teachingScore,
        marketplaceScore,
        cityMatch,
        stateMatch,
        categoryMatch,
        transmissionMatch,
        withinPrice,
        hasAvailability,
        verified,
        totalReviews: reviews,
      },
    };
  }

  async saveMatchingSnapshot(params: {
    candidateProfileId?: string;
    instructorProfileId: string;
    score: number;
    factors: Record<string, unknown>;
    actorUserId?: string;
  }) {
    const snapshot = await this.prisma.matchingSnapshot.create({
      data: {
        candidateProfileId: params.candidateProfileId,
        instructorProfileId: params.instructorProfileId,
        score: Number(params.score.toFixed(2)),
        factorsJson: params.factors as Prisma.InputJsonValue,
      },
    });

    await this.auditService.log({
      actorUserId: params.actorUserId,
      entityType: EntityType.MATCHING_SNAPSHOT,
      entityId: snapshot.id,
      action: 'MATCHING_SNAPSHOT_CREATED',
      metadataJson: {
        candidateProfileId: params.candidateProfileId,
        instructorProfileId: params.instructorProfileId,
        score: params.score,
      },
    });

    return snapshot;
  }
}
