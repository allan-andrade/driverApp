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
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
const audit_service_1 = require("../audit/audit.service");
let ComplianceService = class ComplianceService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    upsertStatePolicy(dto) {
        return this.prisma.statePolicy.upsert({
            where: { stateCode: dto.stateCode },
            create: {
                stateCode: dto.stateCode,
                isActive: dto.isActive,
                rulesJson: dto.rulesJson,
                examFlowJson: dto.examFlowJson,
                docsJson: dto.docsJson,
                notes: dto.notes,
            },
            update: {
                isActive: dto.isActive,
                rulesJson: dto.rulesJson,
                examFlowJson: dto.examFlowJson,
                docsJson: dto.docsJson,
                notes: dto.notes,
            },
        });
    }
    listPolicies() {
        return this.prisma.statePolicy.findMany({ orderBy: { stateCode: 'asc' } });
    }
    findPolicyByStateCode(stateCode) {
        return this.prisma.statePolicy.findUnique({ where: { stateCode } });
    }
    createDocumentRequirement(dto) {
        return this.prisma.documentRequirement.create({
            data: {
                entityType: dto.entityType,
                stateCode: dto.stateCode,
                name: dto.name,
                required: dto.required,
                metadataJson: dto.metadataJson,
            },
        });
    }
    listDocumentRequirements(stateCode) {
        return this.prisma.documentRequirement.findMany({
            where: stateCode ? { stateCode } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async createDocumentSubmission(userId, dto) {
        const [candidate, instructor, school] = await Promise.all([
            this.prisma.candidateProfile.findUnique({ where: { userId } }),
            this.prisma.instructorProfile.findUnique({ where: { userId } }),
            this.prisma.school.findUnique({ where: { managerUserId: userId } }),
        ]);
        const stateCode = dto.stateCode?.toUpperCase() ||
            candidate?.state ||
            instructor?.state ||
            school?.state ||
            'BR';
        const submission = await this.prisma.documentSubmission.create({
            data: {
                userId,
                instructorProfileId: instructor?.id,
                schoolId: school?.id,
                stateCode,
                documentType: dto.documentType,
                fileUrl: dto.fileUrl,
                metadataJson: dto.metadataJson,
            },
        });
        await this.auditService.log({
            actorUserId: userId,
            entityType: client_1.EntityType.DOCUMENT_SUBMISSION,
            entityId: submission.id,
            action: 'DOCUMENT_SUBMISSION_CREATED',
            metadataJson: {
                stateCode,
                documentType: dto.documentType,
            },
        });
        return submission;
    }
    async listDocumentSubmissions(userId, role) {
        if (role === client_1.UserRole.ADMIN) {
            return this.prisma.documentSubmission.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, email: true, role: true } },
                    reviewedByUser: { select: { id: true, email: true } },
                },
                take: 300,
            });
        }
        const [instructor, school] = await Promise.all([
            role === client_1.UserRole.INSTRUCTOR ? this.prisma.instructorProfile.findUnique({ where: { userId } }) : null,
            role === client_1.UserRole.SCHOOL_MANAGER ? this.prisma.school.findUnique({ where: { managerUserId: userId } }) : null,
        ]);
        return this.prisma.documentSubmission.findMany({
            where: {
                OR: [
                    { userId },
                    instructor ? { instructorProfileId: instructor.id } : undefined,
                    school ? { schoolId: school.id } : undefined,
                ].filter(Boolean),
            },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
    }
    async reviewDocumentSubmission(id, dto, actorUserId) {
        const current = await this.prisma.documentSubmission.findUnique({
            where: { id },
            select: { metadataJson: true },
        });
        const submission = await this.prisma.documentSubmission.update({
            where: { id },
            data: {
                verificationStatus: dto.verificationStatus,
                reviewedByUserId: actorUserId,
                reviewedAt: new Date(),
                metadataJson: {
                    ...(typeof current?.metadataJson === 'object' && current?.metadataJson ? current.metadataJson : {}),
                    review: {
                        notes: dto.notes,
                    },
                },
            },
        });
        await this.auditService.log({
            actorUserId,
            entityType: client_1.EntityType.DOCUMENT_SUBMISSION,
            entityId: id,
            action: 'DOCUMENT_SUBMISSION_REVIEWED',
            metadataJson: {
                verificationStatus: dto.verificationStatus,
            },
        });
        return submission;
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map