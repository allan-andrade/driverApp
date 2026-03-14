import { EntityType } from '@prisma/client';
export declare class CreateDocumentRequirementDto {
    entityType: EntityType;
    stateCode: string;
    name: string;
    required: boolean;
    metadataJson: Record<string, unknown>;
}
