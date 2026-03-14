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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const audit_service_1 = require("../audit/audit.service");
let DisputesService = class DisputesService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async assertActorScope(user, booking) {
        if (user.role === client_1.UserRole.ADMIN) {
            return;
        }
        if (user.role === client_1.UserRole.CANDIDATE) {
            const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId: user.userId } });
            if (!candidate || candidate.id !== booking.candidateProfileId) {
                throw new common_1.UnauthorizedException('Candidate is not related to this booking.');
            }
            return;
        }
        if (user.role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId: user.userId } });
            if (!instructor || instructor.id !== booking.instructorProfileId) {
                throw new common_1.UnauthorizedException('Instructor is not related to this booking.');
            }
            return;
        }
        const school = await this.prisma.school.findUnique({ where: { managerUserId: user.userId } });
        if (!school || school.id !== booking.schoolId) {
            throw new common_1.UnauthorizedException('School manager is not related to this booking.');
        }
    }
    async create(user, dto) {
        if (!dto.bookingId && !dto.lessonId && !dto.paymentId) {
            throw new common_1.BadRequestException('bookingId, lessonId or paymentId is required to open a dispute.');
        }
        const lesson = dto.lessonId
            ? await this.prisma.lesson.findUnique({ where: { id: dto.lessonId }, select: { id: true, bookingId: true } })
            : null;
        if (dto.lessonId && !lesson) {
            throw new common_1.NotFoundException('Lesson not found.');
        }
        const payment = dto.paymentId
            ? await this.prisma.payment.findUnique({ where: { id: dto.paymentId }, select: { id: true, bookingId: true } })
            : null;
        if (dto.paymentId && !payment) {
            throw new common_1.NotFoundException('Payment not found.');
        }
        const resolvedBookingId = dto.bookingId ?? lesson?.bookingId ?? payment?.bookingId;
        if (!resolvedBookingId) {
            throw new common_1.BadRequestException('Unable to resolve booking for dispute.');
        }
        if (dto.bookingId && lesson?.bookingId && dto.bookingId !== lesson.bookingId) {
            throw new common_1.BadRequestException('bookingId does not match lesson booking.');
        }
        if (dto.bookingId && payment?.bookingId && dto.bookingId !== payment.bookingId) {
            throw new common_1.BadRequestException('bookingId does not match payment booking.');
        }
        if (lesson?.bookingId && payment?.bookingId && lesson.bookingId !== payment.bookingId) {
            throw new common_1.BadRequestException('lessonId and paymentId reference different bookings.');
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: resolvedBookingId },
            select: {
                id: true,
                candidateProfileId: true,
                instructorProfileId: true,
                schoolId: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found.');
        }
        await this.assertActorScope(user, booking);
        const dispute = await this.prisma.dispute.create({
            data: {
                openedByUserId: user.userId,
                bookingId: resolvedBookingId,
                lessonId: lesson?.id,
                paymentId: payment?.id,
                reason: dto.reason,
                description: dto.description,
            },
        });
        await this.auditService.log({
            actorUserId: user.userId,
            entityType: client_1.EntityType.DISPUTE,
            entityId: dispute.id,
            action: 'DISPUTE_CREATED',
            metadataJson: {
                bookingId: dispute.bookingId,
                lessonId: dispute.lessonId,
                paymentId: dispute.paymentId,
            },
        });
        return dispute;
    }
    async listMine(userId, role) {
        if (role === client_1.UserRole.ADMIN) {
            return this.listAll();
        }
        return this.prisma.dispute.findMany({
            where: { openedByUserId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                booking: true,
                lesson: true,
                payment: true,
            },
        });
    }
    listAll() {
        return this.prisma.dispute.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                booking: true,
                lesson: true,
                payment: true,
                openedBy: {
                    select: { id: true, email: true, role: true },
                },
            },
            take: 200,
        });
    }
    async updateStatus(id, status, resolution, actorUserId) {
        const dispute = await this.prisma.dispute.update({
            where: { id },
            data: {
                status,
                resolution,
            },
        });
        await this.auditService.log({
            actorUserId,
            entityType: client_1.EntityType.DISPUTE,
            entityId: dispute.id,
            action: 'DISPUTE_STATUS_UPDATED',
            metadataJson: {
                status,
                resolution,
            },
        });
        return dispute;
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map