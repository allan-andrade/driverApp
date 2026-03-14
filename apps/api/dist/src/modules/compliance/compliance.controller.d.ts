import { UserRole } from '@prisma/client';
import { ComplianceService } from './compliance.service';
import { CreateDocumentSubmissionDto } from './dto/create-document-submission.dto';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { ReviewDocumentSubmissionDto } from './dto/review-document-submission.dto';
import { UpsertStatePolicyDto } from './dto/upsert-state-policy.dto';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    upsertStatePolicy(dto: UpsertStatePolicyDto): import(".prisma/client").Prisma.Prisma__StatePolicyClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        notes: string | null;
        stateCode: string;
        rulesJson: import("@prisma/client/runtime/library").JsonValue;
        examFlowJson: import("@prisma/client/runtime/library").JsonValue;
        docsJson: import("@prisma/client/runtime/library").JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listPolicies(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        notes: string | null;
        stateCode: string;
        rulesJson: import("@prisma/client/runtime/library").JsonValue;
        examFlowJson: import("@prisma/client/runtime/library").JsonValue;
        docsJson: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    createDocumentRequirement(dto: CreateDocumentRequirementDto): import(".prisma/client").Prisma.Prisma__DocumentRequirementClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        metadataJson: import("@prisma/client/runtime/library").JsonValue;
        stateCode: string;
        required: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listDocumentRequirements(stateCode?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        entityType: import(".prisma/client").$Enums.EntityType;
        metadataJson: import("@prisma/client/runtime/library").JsonValue;
        stateCode: string;
        required: boolean;
    }[]>;
    createDocumentSubmission(userId: string, dto: CreateDocumentSubmissionDto): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
        stateCode: string;
        documentType: string;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedByUserId: string | null;
    }>;
    listDocumentSubmissions(user: {
        userId: string;
        role: UserRole;
    }): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
        stateCode: string;
        documentType: string;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedByUserId: string | null;
    }[]>;
    reviewDocumentSubmission(id: string, dto: ReviewDocumentSubmissionDto, actorUserId: string): Promise<{
        id: string;
        instructorProfileId: string | null;
        schoolId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        verificationStatus: import(".prisma/client").$Enums.VerificationStatus;
        metadataJson: import("@prisma/client/runtime/library").JsonValue | null;
        stateCode: string;
        documentType: string;
        fileUrl: string;
        reviewedAt: Date | null;
        reviewedByUserId: string | null;
    }>;
}
