import { EntityType } from '@prisma/client';
export declare class CreateAuditDto {
    actorUserId?: string;
    entityType: EntityType;
    entityId: string;
    action: string;
    metadataJson: Record<string, unknown>;
}
