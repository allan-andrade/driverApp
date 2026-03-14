import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { UpsertStatePolicyDto } from './dto/upsert-state-policy.dto';
export declare class ComplianceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertStatePolicy(dto: UpsertStatePolicyDto): Prisma.Prisma__StatePolicyClient<{
        id: string;
        stateCode: string;
        isActive: boolean;
        rulesJson: Prisma.JsonValue;
        examFlowJson: Prisma.JsonValue;
        docsJson: Prisma.JsonValue;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listPolicies(): Prisma.PrismaPromise<{
        id: string;
        stateCode: string;
        isActive: boolean;
        rulesJson: Prisma.JsonValue;
        examFlowJson: Prisma.JsonValue;
        docsJson: Prisma.JsonValue;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createDocumentRequirement(dto: CreateDocumentRequirementDto): Prisma.Prisma__DocumentRequirementClient<{
        id: string;
        stateCode: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        required: boolean;
        metadataJson: Prisma.JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listDocumentRequirements(stateCode?: string): Prisma.PrismaPromise<{
        id: string;
        stateCode: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        required: boolean;
        metadataJson: Prisma.JsonValue;
    }[]>;
}
