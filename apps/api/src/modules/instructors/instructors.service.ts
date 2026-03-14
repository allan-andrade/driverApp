import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { SearchInstructorDto } from './dto/search-instructor.dto';
import { UpsertInstructorDto } from './dto/upsert-instructor.dto';

@Injectable()
export class InstructorsService {
  constructor(private readonly prisma: PrismaService) {}

  upsertByUser(userId: string, dto: UpsertInstructorDto) {
    const payload = {
      instructorType: dto.instructorType,
      verificationStatus: dto.verificationStatus ?? 'PENDING',
      bio: dto.bio,
      yearsExperience: dto.yearsExperience,
      serviceRadiusKm: dto.serviceRadiusKm,
      basePrice: dto.basePrice,
      isActive: dto.isActive ?? true,
      categories: dto.categories ?? [],
      city: dto.city,
      state: dto.state,
    };

    return this.prisma.instructorProfile.upsert({
      where: { userId },
      create: { ...payload, userId },
      update: payload,
    });
  }

  findMe(userId: string) {
    return this.prisma.instructorProfile.findUnique({
      where: { userId },
      include: { user: true, vehicles: true, availabilitySlots: true },
    });
  }

  async publicSearch(filters: SearchInstructorDto) {
    const where: Prisma.InstructorProfileWhereInput = {
      isActive: true,
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.category ? { categories: { has: filters.category } } : {}),
      ...(filters.instructorType ? { instructorType: filters.instructorType } : {}),
      ...(filters.minPrice || filters.maxPrice
        ? {
            basePrice: {
              ...(filters.minPrice ? { gte: Number(filters.minPrice) } : {}),
              ...(filters.maxPrice ? { lte: Number(filters.maxPrice) } : {}),
            },
          }
        : {}),
    };

    const profiles = await this.prisma.instructorProfile.findMany({
      where,
      include: { user: true, availabilitySlots: true, reviews: true },
      take: 50,
    });

    return profiles
      .map((instructor) => {
        const avgRating =
          instructor.reviews.length === 0
            ? 0
            : instructor.reviews.reduce(
                (acc, review) =>
                  acc +
                  (review.punctuality +
                    review.didactics +
                    review.professionalism +
                    review.safety +
                    review.examReadiness) /
                    5,
                0,
              ) / instructor.reviews.length;

        const hasAvailability = instructor.availabilitySlots.some((slot) => slot.isActive);

        const score =
          (instructor.isActive ? 20 : 0) +
          (instructor.verificationStatus === 'APPROVED' ? 25 : 0) +
          (hasAvailability ? 20 : 0) +
          avgRating * 5 -
          Number(instructor.basePrice) / 10;

        return {
          id: instructor.id,
          fullName: instructor.user.email,
          city: instructor.city,
          state: instructor.state,
          basePrice: instructor.basePrice,
          rating: Number(avgRating.toFixed(2)),
          verificationStatus: instructor.verificationStatus,
          instructorType: instructor.instructorType,
          categories: instructor.categories,
          hasAvailability,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  findOne(id: string) {
    return this.prisma.instructorProfile.findUnique({
      where: { id },
      include: {
        user: true,
        vehicles: true,
        availabilitySlots: true,
        reviews: true,
        schoolLinks: { include: { school: true } },
      },
    });
  }

  listAll() {
    return this.prisma.instructorProfile.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  }
}
