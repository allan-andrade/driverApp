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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const payments_service_1 = require("../payments/payments.service");
let BookingsService = class BookingsService {
    prisma;
    paymentsService;
    constructor(prisma, paymentsService) {
        this.prisma = prisma;
        this.paymentsService = paymentsService;
    }
    async create(dto) {
        if (!dto.candidateProfileId) {
            throw new common_1.UnauthorizedException('candidateProfileId is required.');
        }
        const data = {
            candidateProfileId: dto.candidateProfileId,
            instructorProfileId: dto.instructorProfileId,
            schoolId: dto.schoolId,
            packageId: dto.packageId,
            scheduledStart: new Date(dto.scheduledStart),
            scheduledEnd: new Date(dto.scheduledEnd),
            priceTotal: dto.priceTotal,
            platformFee: dto.platformFee,
            status: client_1.BookingStatus.CONFIRMED,
        };
        const booking = await this.prisma.booking.create({
            data,
        });
        await this.paymentsService.createPending(booking.id, Number(dto.priceTotal));
        if (booking.instructorProfileId) {
            await this.prisma.lesson.create({
                data: {
                    bookingId: booking.id,
                    candidateProfileId: booking.candidateProfileId,
                    instructorProfileId: booking.instructorProfileId,
                    pinCode: String(Math.floor(1000 + Math.random() * 9000)),
                    status: client_1.LessonStatus.SCHEDULED,
                },
            });
        }
        return booking;
    }
    async createForCandidate(userId, dto) {
        const candidateProfile = await this.prisma.candidateProfile.findUnique({ where: { userId } });
        if (!candidateProfile) {
            throw new common_1.UnauthorizedException('Candidate profile not found for this user.');
        }
        return this.create({
            ...dto,
            candidateProfileId: candidateProfile.id,
        });
    }
    list(filters) {
        return this.prisma.booking.findMany({ where: filters, orderBy: { scheduledStart: 'asc' } });
    }
    async listMine(userId, role) {
        if (role === client_1.UserRole.CANDIDATE) {
            const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
            if (!candidate)
                throw new common_1.NotFoundException('Candidate profile not found.');
            return this.list({ candidateProfileId: candidate.id });
        }
        if (role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
            if (!instructor)
                throw new common_1.NotFoundException('Instructor profile not found.');
            return this.list({ instructorProfileId: instructor.id });
        }
        if (role === client_1.UserRole.SCHOOL_MANAGER) {
            const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
            if (!school)
                throw new common_1.NotFoundException('School not found.');
            return this.list({ schoolId: school.id });
        }
        return this.prisma.booking.findMany({ orderBy: { scheduledStart: 'asc' }, take: 100 });
    }
    async cancel(id) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        return this.prisma.booking.update({ where: { id }, data: { status: client_1.BookingStatus.CANCELLED } });
    }
    async reschedule(id, dto) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found.');
        return this.prisma.booking.update({
            where: { id },
            data: {
                scheduledStart: new Date(dto.scheduledStart),
                scheduledEnd: new Date(dto.scheduledEnd),
                status: client_1.BookingStatus.RESCHEDULED,
            },
        });
    }
    findOne(id) {
        return this.prisma.booking.findUnique({ where: { id }, include: { lessons: true, package: true } });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payments_service_1.PaymentsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map