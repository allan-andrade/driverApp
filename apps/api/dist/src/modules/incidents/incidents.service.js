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
exports.IncidentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const audit_service_1 = require("../audit/audit.service");
let IncidentsService = class IncidentsService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async assertReporterCanOpen(user, booking) {
        if (user.role === client_1.UserRole.ADMIN) {
            return;
        }
        if (user.role === client_1.UserRole.CANDIDATE) {
            const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId: user.userId } });
            if (!candidate || booking.candidateProfileId !== candidate.id) {
                throw new common_1.UnauthorizedException('Candidate is not related to this booking.');
            }
            return;
        }
        if (user.role === client_1.UserRole.INSTRUCTOR) {
            const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId: user.userId } });
            if (!instructor || booking.instructorProfileId !== instructor.id) {
                throw new common_1.UnauthorizedException('Instructor is not related to this booking.');
            }
            return;
        }
        const school = await this.prisma.school.findUnique({ where: { managerUserId: user.userId } });
        if (!school || booking.schoolId !== school.id) {
            throw new common_1.UnauthorizedException('School manager is not related to this booking.');
        }
    }
    async create(user, dto) {
        if (!dto.bookingId && !dto.lessonId) {
            throw new common_1.BadRequestException('bookingId or lessonId is required to open an incident.');
        }
        const lesson = dto.lessonId
            ? await this.prisma.lesson.findUnique({
                where: { id: dto.lessonId },
                select: { id: true, bookingId: true },
            })
            : null;
        if (dto.lessonId && !lesson) {
            throw new common_1.NotFoundException('Lesson not found.');
        }
        const bookingId = dto.bookingId ?? lesson?.bookingId;
        if (!bookingId) {
            throw new common_1.BadRequestException('Unable to resolve booking for this incident.');
        }
        if (dto.bookingId && lesson?.bookingId && dto.bookingId !== lesson.bookingId) {
            throw new common_1.BadRequestException('bookingId does not match lesson booking.');
        }
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
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
        await this.assertReporterCanOpen(user, booking);
        const incident = await this.prisma.incidentReport.create({
            data: {
                reporterUserId: user.userId,
                bookingId,
                lessonId: lesson?.id,
                reportedUserId: dto.reportedUserId,
                type: dto.type,
                severity: dto.severity,
                description: dto.description,
                evidenceUrl: dto.evidenceUrl,
            },
        });
        await this.auditService.log({
            actorUserId: user.userId,
            entityType: client_1.EntityType.INCIDENT_REPORT,
            entityId: incident.id,
            action: 'INCIDENT_CREATED',
            metadataJson: {
                type: incident.type,
                severity: incident.severity,
            },
        });
        return incident;
    }
    async listMine(userId, role) {
        if (role === client_1.UserRole.ADMIN) {
            return this.listAll();
        }
        return this.prisma.incidentReport.findMany({
            where: {
                OR: [{ reporterUserId: userId }, { reportedUserId: userId }],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                booking: true,
                lesson: true,
            },
            take: 200,
        });
    }
    listAll() {
        return this.prisma.incidentReport.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                booking: true,
                lesson: true,
                reporterUser: {
                    select: { id: true, email: true, role: true },
                },
                reportedUser: {
                    select: { id: true, email: true, role: true },
                },
            },
            take: 200,
        });
    }
    async updateStatus(id, status, actorUserId) {
        const incident = await this.prisma.incidentReport.update({
            where: { id },
            data: { status },
        });
        await this.auditService.log({
            actorUserId,
            entityType: client_1.EntityType.INCIDENT_REPORT,
            entityId: id,
            action: 'INCIDENT_STATUS_UPDATED',
            metadataJson: {
                status,
            },
        });
        return incident;
    }
};
exports.IncidentsService = IncidentsService;
exports.IncidentsService = IncidentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], IncidentsService);
//# sourceMappingURL=incidents.service.js.map