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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const audit_service_1 = require("../audit/audit.service");
const payments_service_1 = require("../payments/payments.service");
let LessonsService = class LessonsService {
    prisma;
    auditService;
    paymentsService;
    constructor(prisma, auditService, paymentsService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.paymentsService = paymentsService;
    }
    listByInstructor(instructorProfileId) {
        return this.prisma.lesson.findMany({ where: { instructorProfileId }, orderBy: { createdAt: 'desc' } });
    }
    async listMine(userId, role) {
        if (role === client_1.UserRole.CANDIDATE) {
            const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
            if (!candidate)
                throw new common_1.NotFoundException('Candidate profile not found.');
            return this.prisma.lesson.findMany({
                where: { candidateProfileId: candidate.id },
                orderBy: { createdAt: 'desc' },
            });
        }
        if (role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
            if (!instructor)
                throw new common_1.NotFoundException('Instructor profile not found.');
            return this.listByInstructor(instructor.id);
        }
        if (role === client_1.UserRole.SCHOOL_MANAGER) {
            const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
            if (!school)
                throw new common_1.NotFoundException('School not found.');
            return this.prisma.lesson.findMany({
                where: { booking: { schoolId: school.id } },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.lesson.findMany({
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    async findOne(lessonId, userId, role) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                booking: true,
                candidateProfile: true,
                instructorProfile: true,
            },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found.');
        }
        if (role === client_1.UserRole.ADMIN) {
            return lesson;
        }
        if (role === client_1.UserRole.CANDIDATE) {
            const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
            if (!candidate || candidate.id !== lesson.candidateProfileId) {
                throw new common_1.UnauthorizedException('You are not allowed to view this lesson.');
            }
            return lesson;
        }
        if (role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
            if (!instructor || instructor.id !== lesson.instructorProfileId) {
                throw new common_1.UnauthorizedException('You are not allowed to view this lesson.');
            }
            return lesson;
        }
        const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
        if (!school || lesson.booking.schoolId !== school.id) {
            throw new common_1.UnauthorizedException('You are not allowed to view this lesson.');
        }
        return lesson;
    }
    ensureCanTransition(currentStatus, allowed, action) {
        if (!allowed.includes(currentStatus)) {
            throw new common_1.BadRequestException(`Cannot ${action} when lesson is ${currentStatus}.`);
        }
    }
    async assertOperatorAccess(lesson, actor) {
        if (actor.role === client_1.UserRole.ADMIN) {
            return;
        }
        if (actor.role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId: actor.userId } });
            if (!instructor || instructor.id !== lesson.instructorProfileId) {
                throw new common_1.UnauthorizedException('You are not allowed to operate this lesson.');
            }
            return;
        }
        if (actor.role === client_1.UserRole.SCHOOL_MANAGER) {
            const school = await this.prisma.school.findUnique({ where: { managerUserId: actor.userId } });
            if (!school || school.id !== lesson.booking.schoolId) {
                throw new common_1.UnauthorizedException('You are not allowed to operate this lesson.');
            }
            return;
        }
        throw new common_1.UnauthorizedException('You are not allowed to operate this lesson.');
    }
    async checkIn(lessonId, dto, actor) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { booking: { select: { schoolId: true } } },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found.');
        await this.assertOperatorAccess(lesson, actor);
        this.ensureCanTransition(lesson.status, [client_1.LessonStatus.SCHEDULED, client_1.LessonStatus.CHECK_IN_PENDING], 'check in');
        if (lesson.pinCode !== dto.pinCode) {
            throw new common_1.UnauthorizedException('Invalid PIN code.');
        }
        const updated = await this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                pinVerified: true,
                status: client_1.LessonStatus.CHECK_IN_PENDING,
            },
        });
        await this.auditService.log({
            actorUserId: actor.userId,
            entityType: client_1.EntityType.LESSON,
            entityId: lessonId,
            action: 'LESSON_CHECK_IN_VERIFIED',
            metadataJson: {},
        });
        return updated;
    }
    async start(lessonId, dto, actor) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { booking: { select: { schoolId: true } } },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found.');
        await this.assertOperatorAccess(lesson, actor);
        this.ensureCanTransition(lesson.status, [client_1.LessonStatus.SCHEDULED, client_1.LessonStatus.CHECK_IN_PENDING], 'start lesson');
        if (!lesson.pinVerified) {
            throw new common_1.BadRequestException('PIN must be verified before starting the lesson.');
        }
        const updated = await this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                startedAt: new Date(),
                startLat: dto.startLat,
                startLng: dto.startLng,
                startAddress: dto.startAddress,
                status: client_1.LessonStatus.IN_PROGRESS,
            },
        });
        await this.auditService.log({
            actorUserId: actor.userId,
            entityType: client_1.EntityType.LESSON,
            entityId: lessonId,
            action: 'LESSON_STARTED',
            metadataJson: {
                startLat: dto.startLat,
                startLng: dto.startLng,
            },
        });
        return updated;
    }
    async finish(lessonId, dto, actor) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { booking: { select: { schoolId: true } } },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found.');
        await this.assertOperatorAccess(lesson, actor);
        this.ensureCanTransition(lesson.status, [client_1.LessonStatus.IN_PROGRESS], 'finish lesson');
        const updated = await this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                finishedAt: new Date(),
                endLat: dto.endLat,
                endLng: dto.endLng,
                endAddress: dto.endAddress,
                notes: dto.notes,
                status: client_1.LessonStatus.COMPLETED,
            },
        });
        await this.prisma.booking.update({
            where: { id: lesson.bookingId },
            data: { status: client_1.BookingStatus.COMPLETED },
        });
        const payment = await this.prisma.payment.findFirst({
            where: {
                bookingId: lesson.bookingId,
                status: { in: [client_1.PaymentStatus.PENDING, client_1.PaymentStatus.AUTHORIZED] },
            },
            orderBy: { createdAt: 'asc' },
        });
        if (payment) {
            await this.paymentsService.capture(payment.id, actor.userId);
        }
        await this.auditService.log({
            actorUserId: actor.userId,
            entityType: client_1.EntityType.LESSON,
            entityId: lessonId,
            action: 'LESSON_FINISHED',
            metadataJson: {
                bookingId: lesson.bookingId,
            },
        });
        return updated;
    }
    async markNoShow(lessonId, reason, actor) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { booking: { select: { schoolId: true } } },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found.');
        await this.assertOperatorAccess(lesson, actor);
        this.ensureCanTransition(lesson.status, [client_1.LessonStatus.SCHEDULED, client_1.LessonStatus.CHECK_IN_PENDING], 'mark no show');
        const updated = await this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                status: client_1.LessonStatus.NO_SHOW,
                notes: reason,
            },
        });
        await this.prisma.booking.update({
            where: { id: lesson.bookingId },
            data: {
                status: client_1.BookingStatus.CANCELLED,
                paymentStatus: client_1.PaymentStatus.CANCELLED,
                cancelReason: reason ?? 'NO_SHOW',
            },
        });
        await this.prisma.payment.updateMany({
            where: {
                bookingId: lesson.bookingId,
                status: { in: [client_1.PaymentStatus.PENDING, client_1.PaymentStatus.AUTHORIZED] },
            },
            data: {
                status: client_1.PaymentStatus.CANCELLED,
            },
        });
        await this.auditService.log({
            actorUserId: actor.userId,
            entityType: client_1.EntityType.LESSON,
            entityId: lessonId,
            action: 'LESSON_MARKED_NO_SHOW',
            metadataJson: {
                reason,
            },
        });
        return updated;
    }
    async cancel(lessonId, reason, actor) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { booking: { select: { schoolId: true } } },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found.');
        await this.assertOperatorAccess(lesson, actor);
        this.ensureCanTransition(lesson.status, [client_1.LessonStatus.SCHEDULED, client_1.LessonStatus.CHECK_IN_PENDING], 'cancel lesson');
        const updated = await this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                status: client_1.LessonStatus.CANCELLED,
                notes: reason,
            },
        });
        await this.prisma.booking.update({
            where: { id: lesson.bookingId },
            data: {
                status: client_1.BookingStatus.CANCELLED,
                paymentStatus: client_1.PaymentStatus.CANCELLED,
                cancelReason: reason,
            },
        });
        await this.prisma.payment.updateMany({
            where: {
                bookingId: lesson.bookingId,
                status: { in: [client_1.PaymentStatus.PENDING, client_1.PaymentStatus.AUTHORIZED] },
            },
            data: {
                status: client_1.PaymentStatus.CANCELLED,
            },
        });
        await this.auditService.log({
            actorUserId: actor.userId,
            entityType: client_1.EntityType.LESSON,
            entityId: lessonId,
            action: 'LESSON_CANCELLED',
            metadataJson: {
                reason,
            },
        });
        return updated;
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        payments_service_1.PaymentsService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map