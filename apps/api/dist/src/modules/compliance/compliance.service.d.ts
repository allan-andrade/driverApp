import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { UpsertStatePolicyDto } from './dto/upsert-state-policy.dto';
export declare class ComplianceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertStatePolicy(dto: UpsertStatePolicyDto): Prisma.Prisma__StatePolicyClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        stateCode: string;
        rulesJson: Prisma.JsonValue;
        examFlowJson: Prisma.JsonValue;
        docsJson: Prisma.JsonValue;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listPolicies(): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        stateCode: string;
        rulesJson: Prisma.JsonValue;
        examFlowJson: Prisma.JsonValue;
        docsJson: Prisma.JsonValue;
        notes: string | null;
    }[]>;
    findPolicyByStateCode(stateCode: string): Prisma.Prisma__StatePolicyClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        stateCode: string;
        rulesJson: Prisma.JsonValue;
        examFlowJson: Prisma.JsonValue;
        docsJson: Prisma.JsonValue;
        notes: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createDocumentRequirement(dto: CreateDocumentRequirementDto): Prisma.Prisma__DocumentRequirementClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        stateCode: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        required: boolean;
        metadataJson: Prisma.JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listDocumentRequirements(stateCode?: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        stateCode: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        required: boolean;
        metadataJson: Prisma.JsonValue;
    }[]>;
}
