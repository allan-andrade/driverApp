import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { UpsertStatePolicyDto } from './dto/upsert-state-policy.dto';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  upsertStatePolicy(dto: UpsertStatePolicyDto) {
    return this.prisma.statePolicy.upsert({
      where: { stateCode: dto.stateCode },
      create: {
        stateCode: dto.stateCode,
        isActive: dto.isActive,
        rulesJson: dto.rulesJson as Prisma.InputJsonValue,
        examFlowJson: dto.examFlowJson as Prisma.InputJsonValue,
        docsJson: dto.docsJson as Prisma.InputJsonValue,
        notes: dto.notes,
      },
      update: {
        isActive: dto.isActive,
        rulesJson: dto.rulesJson as Prisma.InputJsonValue,
        examFlowJson: dto.examFlowJson as Prisma.InputJsonValue,
        docsJson: dto.docsJson as Prisma.InputJsonValue,
        notes: dto.notes,
      },
    });
  }

  listPolicies() {
    return this.prisma.statePolicy.findMany({ orderBy: { stateCode: 'asc' } });
  }

  findPolicyByStateCode(stateCode: string) {
    return this.prisma.statePolicy.findUnique({ where: { stateCode } });
  }

  createDocumentRequirement(dto: CreateDocumentRequirementDto) {
    return this.prisma.documentRequirement.create({
      data: {
        entityType: dto.entityType,
        stateCode: dto.stateCode,
        name: dto.name,
        required: dto.required,
        metadataJson: dto.metadataJson as Prisma.InputJsonValue,
      },
    });
  }

  listDocumentRequirements(stateCode?: string) {
    return this.prisma.documentRequirement.findMany({
      where: stateCode ? { stateCode } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }
}
