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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const audit_service_1 = require("../audit/audit.service");
const payouts_service_1 = require("../payouts/payouts.service");
let PaymentsService = class PaymentsService {
    prisma;
    auditService;
    payoutsService;
    constructor(prisma, auditService, payoutsService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.payoutsService = payoutsService;
    }
    async createPending(bookingId, amount, platformFee = 0) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found for payment creation.');
        }
        return this.prisma.payment.create({
            data: {
                bookingId,
                candidateProfileId: booking.candidateProfileId,
                instructorProfileId: booking.instructorProfileId,
                schoolId: booking.schoolId,
                amount,
                platformFee,
                method: client_1.PaymentMethod.MANUAL,
                currency: 'BRL',
                status: client_1.PaymentStatus.PENDING,
                provider: 'stub',
                splitMetadataJson: { providerHint: 'stripe|pagarme|asaas' },
            },
        });
    }
    listAll() {
        return this.prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                booking: true,
                candidateProfile: true,
                instructorProfile: true,
                school: true,
            },
            take: 300,
        });
    }
    async listMine(userId, role) {
        if (role === client_1.UserRole.ADMIN) {
            return this.listAll();
        }
        if (role === client_1.UserRole.CANDIDATE) {
            const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
            if (!candidate)
                return [];
            return this.prisma.payment.findMany({
                where: { candidateProfileId: candidate.id },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
            if (!instructor)
                return [];
            return this.prisma.payment.findMany({
                where: { instructorProfileId: instructor.id },
                orderBy: { createdAt: 'desc' },
            });
        }
        const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
        if (!school)
            return [];
        return this.prisma.payment.findMany({
            where: { schoolId: school.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(paymentId, status, actorUserId, providerReference) {
        const payment = await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status,
                providerReference,
                capturedAt: status === client_1.PaymentStatus.CAPTURED || status === client_1.PaymentStatus.PAID ? new Date() : null,
                refundedAt: status === client_1.PaymentStatus.REFUNDED ? new Date() : null,
            },
            include: {
                booking: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });
        await this.prisma.booking.update({
            where: { id: payment.bookingId },
            data: {
                paymentStatus: status,
            },
        });
        await this.auditService.log({
            actorUserId,
            entityType: client_1.EntityType.PAYMENT,
            entityId: payment.id,
            action: 'PAYMENT_STATUS_UPDATED',
            metadataJson: {
                status,
                providerReference,
            },
        });
        if (status === client_1.PaymentStatus.CAPTURED || status === client_1.PaymentStatus.PAID) {
            await this.payoutsService.createHoldForPayment(payment.id);
            if (payment.booking.status === client_1.BookingStatus.COMPLETED) {
                await this.payoutsService.releaseByBooking(payment.booking.id);
            }
        }
        if (status === client_1.PaymentStatus.CANCELLED || status === client_1.PaymentStatus.REFUNDED) {
            await this.prisma.payout.updateMany({
                where: {
                    paymentId: payment.id,
                    status: {
                        not: client_1.PayoutStatus.PAID,
                    },
                },
                data: {
                    status: client_1.PayoutStatus.ON_HOLD,
                },
            });
        }
        return payment;
    }
    async capture(paymentId, actorUserId, providerReference) {
        return this.updateStatus(paymentId, client_1.PaymentStatus.CAPTURED, actorUserId, providerReference);
    }
    async cancel(paymentId, actorUserId) {
        return this.updateStatus(paymentId, client_1.PaymentStatus.CANCELLED, actorUserId);
    }
    async refund(paymentId, actorUserId) {
        return this.updateStatus(paymentId, client_1.PaymentStatus.REFUNDED, actorUserId);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        payouts_service_1.PayoutsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map