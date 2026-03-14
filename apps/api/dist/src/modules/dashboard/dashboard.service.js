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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async candidateDashboard(userId) {
        const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
        if (!candidate)
            throw new common_1.NotFoundException('Candidate profile not found.');
        const [upcoming, history] = await Promise.all([
            this.prisma.booking.findMany({
                where: { candidateProfileId: candidate.id },
                orderBy: { scheduledStart: 'asc' },
                take: 5,
            }),
            this.prisma.booking.findMany({
                where: { candidateProfileId: candidate.id },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        return { upcoming, history };
    }
    async instructorDashboard(userId) {
        const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
        if (!instructor)
            throw new common_1.NotFoundException('Instructor profile not found.');
        const [agenda, bookings] = await Promise.all([
            this.prisma.availabilitySlot.findMany({ where: { instructorProfileId: instructor.id, isActive: true } }),
            this.prisma.booking.findMany({
                where: { instructorProfileId: instructor.id },
                orderBy: { scheduledStart: 'asc' },
                take: 10,
            }),
        ]);
        return { agenda, bookings };
    }
    async schoolDashboard(userId) {
        const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
        if (!school)
            throw new common_1.NotFoundException('School not found.');
        const [instructors, bookings] = await Promise.all([
            this.prisma.instructorSchoolLink.findMany({ where: { schoolId: school.id } }),
            this.prisma.booking.findMany({ where: { schoolId: school.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
        ]);
        return { school, instructors, bookings };
    }
    async adminDashboard() {
        const [users, instructors, schools, bookings] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.instructorProfile.count(),
            this.prisma.school.count(),
            this.prisma.booking.count(),
        ]);
        return { users, instructors, schools, bookings };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map