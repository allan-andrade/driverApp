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
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let MarketplaceService = class MarketplaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    formatDisplayName(email) {
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
    getReviewAverage(review) {
        return (review.punctuality +
            review.didactics +
            review.professionalism +
            review.safety +
            review.examReadiness) / 5;
    }
    buildWhere(filters) {
        return {
            isActive: true,
            ...(filters.city ? { city: filters.city } : {}),
            ...(filters.state ? { state: filters.state } : {}),
            ...(filters.category ? { categories: { has: filters.category } } : {}),
            ...(filters.instructorType ? { instructorType: filters.instructorType } : {}),
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
        };
    }
    calculateScore(input) {
        const ratingWeight = input.avgRating * 10;
        const socialProof = Math.min(input.reviewCount, 20);
        const availabilityWeight = input.hasAvailability ? 20 : 0;
        const experienceWeight = Math.min(input.yearsExperience, 20);
        const verificationWeight = input.verified ? 15 : 0;
        const affordability = Math.max(0, 30 - input.basePrice / 20);
        return ratingWeight + socialProof + availabilityWeight + experienceWeight + verificationWeight + affordability;
    }
    async listInstructors(filters) {
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
                },
            }),
        ]);
        const items = profiles.map((profile) => {
            const reviewCount = profile.reviews.length;
            const avgRating = reviewCount === 0
                ? 0
                : profile.reviews.reduce((acc, review) => acc + this.getReviewAverage(review), 0) / reviewCount;
            const minPackagePrice = profile.packages.length > 0
                ? Math.min(...profile.packages.map((item) => Number(item.price)))
                : profile.basePrice
                    ? Number(profile.basePrice)
                    : null;
            const hasAvailability = profile.availabilitySlots.length > 0;
            const relevanceScore = this.calculateScore({
                basePrice: Number(profile.basePrice ?? 0),
                avgRating,
                reviewCount,
                hasAvailability,
                yearsExperience: profile.yearsExperience ?? 0,
                verified: profile.verificationStatus === 'APPROVED',
            });
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
                relevanceScore: Number(relevanceScore.toFixed(2)),
            };
        });
        const sortBy = filters.sortBy ?? 'relevance';
        const sortOrder = filters.sortOrder ?? 'desc';
        const direction = sortOrder === 'asc' ? 1 : -1;
        const sortedItems = [...items].sort((a, b) => {
            if (sortBy === 'price') {
                const aPrice = a.minPackagePrice ?? a.basePrice ?? Number.MAX_SAFE_INTEGER;
                const bPrice = b.minPackagePrice ?? b.basePrice ?? Number.MAX_SAFE_INTEGER;
                return (aPrice - bPrice) * direction;
            }
            if (sortBy === 'rating') {
                return (a.rating - b.rating) * direction;
            }
            if (sortBy === 'experience') {
                return ((a.yearsExperience ?? 0) - (b.yearsExperience ?? 0)) * direction;
            }
            return (a.relevanceScore - b.relevanceScore) * direction;
        });
        const pagedItems = sortedItems.slice((page - 1) * pageSize, page * pageSize);
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
    async getInstructorDetail(id) {
        const profile = await this.prisma.instructorProfile.findUnique({
            where: { id },
            include: {
                user: true,
                reviews: true,
                availabilitySlots: { where: { isActive: true }, orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }] },
                packages: { orderBy: { price: 'asc' } },
                vehicles: true,
            },
        });
        if (!profile || !profile.isActive) {
            throw new common_1.NotFoundException('Instructor not found.');
        }
        const reviewCount = profile.reviews.length;
        const avgRating = reviewCount === 0
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
    async getInstructorAvailability(id) {
        const profile = await this.prisma.instructorProfile.findUnique({ where: { id } });
        if (!profile || !profile.isActive) {
            throw new common_1.NotFoundException('Instructor not found.');
        }
        return this.prisma.availabilitySlot.findMany({
            where: { instructorProfileId: id, isActive: true },
            orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
        });
    }
    async getInstructorReviews(id) {
        const profile = await this.prisma.instructorProfile.findUnique({ where: { id } });
        if (!profile || !profile.isActive) {
            throw new common_1.NotFoundException('Instructor not found.');
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
    async getInstructorPackages(id) {
        const profile = await this.prisma.instructorProfile.findUnique({ where: { id } });
        if (!profile || !profile.isActive) {
            throw new common_1.NotFoundException('Instructor not found.');
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
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map