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
const prisma_service_1 = require("../../prisma.service");
let ComplianceService = class ComplianceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map