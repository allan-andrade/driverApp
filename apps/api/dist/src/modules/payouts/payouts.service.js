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
exports.PayoutsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
let PayoutsService = class PayoutsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createHoldForPayment(paymentId) {
        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found.');
        }
        if (!payment.instructorProfileId && !payment.schoolId) {
            return null;
        }
        const alreadyExists = await this.prisma.payout.findFirst({ where: { paymentId } });
        if (alreadyExists) {
            return alreadyExists;
        }
        const amountNet = Number(payment.amount) - Number(payment.platformFee);
        return this.prisma.payout.create({
            data: {
                paymentId,
                instructorProfileId: payment.instructorProfileId,
                schoolId: payment.schoolId,
                amountNet,
                status: client_1.PayoutStatus.ON_HOLD,
            },
        });
    }
    async releaseByBooking(bookingId) {
        const payout = await this.prisma.payout.findFirst({
            where: {
                payment: {
                    bookingId,
                },
            },
        });
        if (!payout) {
            return null;
        }
        return this.prisma.payout.update({
            where: { id: payout.id },
            data: {
                status: client_1.PayoutStatus.SCHEDULED,
                scheduledAt: new Date(),
            },
        });
    }
    listAll() {
        return this.prisma.payout.findMany({
            include: {
                payment: true,
                instructorProfile: true,
                school: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    async listMine(userId) {
        const [instructor, school] = await Promise.all([
            this.prisma.instructorProfile.findUnique({ where: { userId } }),
            this.prisma.school.findUnique({ where: { managerUserId: userId } }),
        ]);
        const where = {
            OR: [
                instructor ? { instructorProfileId: instructor.id } : undefined,
                school ? { schoolId: school.id } : undefined,
            ].filter(Boolean),
        };
        if (!where.OR || where.OR.length === 0) {
            return [];
        }
        return this.prisma.payout.findMany({
            where,
            include: { payment: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, status, provider, providerReference) {
        return this.prisma.payout.update({
            where: { id },
            data: {
                status,
                provider,
                providerReference,
                paidAt: status === client_1.PayoutStatus.PAID ? new Date() : null,
            },
        });
    }
};
exports.PayoutsService = PayoutsService;
exports.PayoutsService = PayoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayoutsService);
//# sourceMappingURL=payouts.service.js.map