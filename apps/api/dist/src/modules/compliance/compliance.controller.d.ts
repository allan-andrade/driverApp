import { ComplianceService } from './compliance.service';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { UpsertStatePolicyDto } from './dto/upsert-state-policy.dto';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    upsertStatePolicy(dto: UpsertStatePolicyDto): import(".prisma/client").Prisma.Prisma__StatePolicyClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        stateCode: string;
        rulesJson: import("@prisma/client/runtime/library").JsonValue;
        examFlowJson: import("@prisma/client/runtime/library").JsonValue;
        docsJson: import("@prisma/client/runtime/library").JsonValue;
        notes: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listPolicies(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        stateCode: string;
        rulesJson: import("@prisma/client/runtime/library").JsonValue;
        examFlowJson: import("@prisma/client/runtime/library").JsonValue;
        docsJson: import("@prisma/client/runtime/library").JsonValue;
        notes: string | null;
    }[]>;
    createDocumentRequirement(dto: CreateDocumentRequirementDto): import(".prisma/client").Prisma.Prisma__DocumentRequirementClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        stateCode: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        required: boolean;
        metadataJson: import("@prisma/client/runtime/library").JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listDocumentRequirements(stateCode?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        stateCode: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        required: boolean;
        metadataJson: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
}
