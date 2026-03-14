import { ComplianceService } from './compliance.service';
export declare class StatePoliciesController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
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
    findByState(stateCode: string): import(".prisma/client").Prisma.Prisma__StatePolicyClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        stateCode: string;
        rulesJson: import("@prisma/client/runtime/library").JsonValue;
        examFlowJson: import("@prisma/client/runtime/library").JsonValue;
        docsJson: import("@prisma/client/runtime/library").JsonValue;
        notes: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
