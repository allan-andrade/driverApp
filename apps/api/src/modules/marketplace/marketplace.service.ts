import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { RankingsService } from '../rankings/rankings.service';
import { SearchMarketplaceDto } from './dto/search-marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rankingsService: RankingsService,
    private readonly metricsService: MetricsService,
  ) {}

  private formatDisplayName(email: string) {
    const [namePart] = email.split('@');
    if (!namePart) {
      return email;
    }

    return namePart
      .split(/[._-]/)
      .filter(Boolean)
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(' ');
  }

  private getReviewAverage(review: {
    punctuality: number;
    didactics: number;
    professionalism: number;
    safety: number;
    examReadiness: number;
  }) {
    return (
      review.punctuality +
      review.didactics +
      review.professionalism +
      review.safety +
      review.examReadiness
    ) / 5;
  }

  private buildWhere(filters: SearchMarketplaceDto): Prisma.InstructorProfileWhereInput {
    return {
      isActive: true,
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.category ? { categories: { has: filters.category } } : {}),
      ...(filters.instructorType ? { instructorType: filters.instructorType } : {}),
      ...(filters.verifiedOnly === 'true'
        ? {
            verificationStatus: {
              in: ['APPROVED', 'VERIFIED'],
            },
          }
        : {}),
      ...(filters.hasAvailability === 'true'
        ? {
            availabilitySlots: {
              some: {
                isActive: true,
              },
            },
          }
        : {}),
      ...(filters.usesInstructorVehicle === 'true'
        ? {
            OR: [
              {
                packages: {
                  some: {
                    usesInstructorVehicle: true,
                  },
                },
              },
              {
                vehicles: {
                  some: {},
                },
              },
            ],
          }
        : {}),
      ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
            basePrice: {
              ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
              ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
            },
          }
        : {}),
      ...(filters.transmissionType
        ? {
            vehicles: {
              some: {
                transmissionType: filters.transmissionType,
              },
            },
          }
        : {}),
      ...(filters.minReviews !== undefined
        ? {
            metrics: {
              is: {
                totalReviews: {
                  gte: filters.minReviews,
                },
              },
            },
          }
        : {}),
      ...(filters.minScore !== undefined
        ? {
            metrics: {
              is: {
                marketplaceScore: {
                  gte: filters.minScore,
                },
              },
            },
          }
        : {}),
    };
  }

  async listInstructors(filters: SearchMarketplaceDto) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const where = this.buildWhere(filters);

    const [total, profiles] = await this.prisma.$transaction([
      this.prisma.instructorProfile.count({ where }),
      this.prisma.instructorProfile.findMany({
        where,
        include: {
          user: true,
          reviews: true,
          availabilitySlots: { where: { isActive: true } },
          packages: true,
          vehicles: true,
          metrics: true,
        },
      }),
    ]);

    const items = profiles.map((profile) => {
      const reviewCount = profile.reviews.length;
      const avgRating =
        reviewCount === 0
          ? 0
          : profile.reviews.reduce((acc, review) => acc + this.getReviewAverage(review), 0) / reviewCount;

      const minPackagePrice =
        profile.packages.length > 0
          ? Math.min(...profile.packages.map((item) => Number(item.price)))
          : profile.basePrice
            ? Number(profile.basePrice)
            : null;

      const hasAvailability = profile.availabilitySlots.length > 0;

      const match = this.rankingsService.computeMatchingScore({
        candidateProfileId: filters.candidateProfileId,
        instructorProfile: {
          id: profile.id,
          city: profile.city,
          state: profile.state,
          basePrice: profile.basePrice,
          verificationStatus: profile.verificationStatus,
          categories: profile.categories,
          instructorType: profile.instructorType,
          availabilitySlots: profile.availabilitySlots,
          vehicles: profile.vehicles,
          metrics: profile.metrics,
        },
        filters: {
          city: filters.city,
          state: filters.state,
          category: filters.category,
          transmissionType: filters.transmissionType,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          verifiedOnly: filters.verifiedOnly === 'true',
          hasAvailability: filters.hasAvailability === 'true',
          usesInstructorVehicle: filters.usesInstructorVehicle === 'true',
          minScore: filters.minScore,
          minReviews: filters.minReviews,
        },
      });

      const relevanceScore = match.score;

      return {
        id: profile.id,
        fullName: this.formatDisplayName(profile.user.email),
        bio: profile.bio,
        city: profile.city,
        state: profile.state,
        yearsExperience: profile.yearsExperience,
        instructorType: profile.instructorType,
        categories: profile.categories,
        verificationStatus: profile.verificationStatus,
        basePrice: profile.basePrice ? Number(profile.basePrice) : null,
        minPackagePrice,
        rating: Number(avgRating.toFixed(2)),
        reviewCount,
        hasAvailability,
        vehicleCount: profile.vehicles.length,
        trustScore: Number(profile.metrics?.trustScore ?? 0),
        teachingScore: Number(profile.metrics?.teachingScore ?? 0),
        marketplaceScore: Number(profile.metrics?.marketplaceScore ?? 0),
        relevanceScore: Number(relevanceScore.toFixed(2)),
        rankingFactors: match.factors,
      };
    });

    const sortBy = filters.sortBy ?? 'relevance';
    const sortOrder = filters.sortOrder ?? (sortBy === 'price_asc' ? 'asc' : 'desc');
    const direction = sortOrder === 'asc' ? 1 : -1;

    const sortedItems = [...items].sort((a, b) => {
      if (sortBy === 'price_asc' || sortBy === 'price_desc') {
        const aPrice = a.minPackagePrice ?? a.basePrice ?? Number.MAX_SAFE_INTEGER;
        const bPrice = b.minPackagePrice ?? b.basePrice ?? Number.MAX_SAFE_INTEGER;
        return sortBy === 'price_asc' ? aPrice - bPrice : bPrice - aPrice;
      }

      if (sortBy === 'rating') {
        return (a.rating - b.rating) * direction;
      }

      if (sortBy === 'trust') {
        return (a.trustScore - b.trustScore) * direction;
      }

      if (sortBy === 'teaching') {
        return (a.teachingScore - b.teachingScore) * direction;
      }

      return (a.relevanceScore - b.relevanceScore) * direction;
    });

    const pagedItems = sortedItems.slice((page - 1) * pageSize, page * pageSize);

    if (filters.candidateProfileId) {
      await Promise.all(
        pagedItems.map((item) =>
          this.rankingsService.saveMatchingSnapshot({
            candidateProfileId: filters.candidateProfileId,
            instructorProfileId: item.id,
            score: item.relevanceScore,
            factors: item.rankingFactors,
          }),
        ),
      );
    }

    return {
      items: pagedItems,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async getInstructorDetail(id: string) {
    const profile = await this.prisma.instructorProfile.findUnique({
      where: { id },
      include: {
        user: true,
        reviews: true,
        availabilitySlots: { where: { isActive: true }, orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }] },
        packages: { orderBy: { price: 'asc' } },
        vehicles: true,
        metrics: true,
      },
    });

    if (!profile || !profile.isActive) {
      throw new NotFoundException('Instructor not found.');
    }

    const reviewCount = profile.reviews.length;
    const avgRating =
      reviewCount === 0
        ? 0
        : profile.reviews.reduce((acc, review) => acc + this.getReviewAverage(review), 0) / reviewCount;

    return {
      id: profile.id,
      fullName: this.formatDisplayName(profile.user.email),
      bio: profile.bio,
      city: profile.city,
      state: profile.state,
      yearsExperience: profile.yearsExperience,
      serviceRadiusKm: profile.serviceRadiusKm,
      basePrice: profile.basePrice ? Number(profile.basePrice) : null,
      instructorType: profile.instructorType,
      verificationStatus: profile.verificationStatus,
      categories: profile.categories,
        trustScore: Number(profile.metrics?.trustScore ?? 0),
        teachingScore: Number(profile.metrics?.teachingScore ?? 0),
        marketplaceScore: Number(profile.metrics?.marketplaceScore ?? 0),
      stats: {
        rating: Number(avgRating.toFixed(2)),
        reviewCount,
        packageCount: profile.packages.length,
        vehicleCount: profile.vehicles.length,
        hasAvailability: profile.availabilitySlots.length > 0,
      },
      vehicles: profile.vehicles,
      packages: profile.packages.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
      availability: profile.availabilitySlots,
    };
  }

  getInstructorMetrics(id: string) {
    return this.metricsService.getInstructorMetrics(id);
  }

  async getInstructorAvailability(id: string) {
    const profile = await this.prisma.instructorProfile.findUnique({ where: { id } });
    if (!profile || !profile.isActive) {
      throw new NotFoundException('Instructor not found.');
    }

    return this.prisma.availabilitySlot.findMany({
      where: { instructorProfileId: id, isActive: true },
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getInstructorReviews(id: string) {
    const profile = await this.prisma.instructorProfile.findUnique({ where: { id } });
    if (!profile || !profile.isActive) {
      throw new NotFoundException('Instructor not found.');
    }

    const reviews = await this.prisma.review.findMany({
      where: { instructorProfileId: id },
      orderBy: { createdAt: 'desc' },
      include: { candidateProfile: true },
      take: 50,
    });

    return reviews.map((review) => ({
      ...review,
      average: Number(this.getReviewAverage(review).toFixed(2)),
      candidateName: review.candidateProfile.fullName,
    }));
  }

  async getInstructorPackages(id: string) {
    const profile = await this.prisma.instructorProfile.findUnique({ where: { id } });
    if (!profile || !profile.isActive) {
      throw new NotFoundException('Instructor not found.');
    }

    const packages = await this.prisma.package.findMany({
      where: { instructorProfileId: id },
      orderBy: { price: 'asc' },
    });

    return packages.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
  }
}
