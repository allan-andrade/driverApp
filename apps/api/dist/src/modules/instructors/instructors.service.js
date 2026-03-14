"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let InstructorsService = class InstructorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    upsertByUser(userId, dto) {
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
    findMe(userId) {
        return this.prisma.instructorProfile.findUnique({
            where: { userId },
            include: { user: true, vehicles: true, availabilitySlots: true },
        });
    }
    async publicSearch(filters) {
        const where = {
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
            const avgRating = instructor.reviews.length === 0
                ? 0
                : instructor.reviews.reduce((acc, review) => acc +
                    (review.punctuality +
                        review.didactics +
                        review.professionalism +
                        review.safety +
                        review.examReadiness) /
                        5, 0) / instructor.reviews.length;
            const hasAvailability = instructor.availabilitySlots.some((slot) => slot.isActive);
            const score = (instructor.isActive ? 20 : 0) +
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
    findOne(id) {
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
};
exports.InstructorsService = InstructorsService;
exports.InstructorsService = InstructorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstructorsService);
//# sourceMappingURL=instructors.service.js.map