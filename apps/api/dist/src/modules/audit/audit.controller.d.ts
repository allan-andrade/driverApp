import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    create(dto: CreateAuditDto): import(".prisma/client").Prisma.Prisma__AuditLogClient<{
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.EntityType;
        metadataJson: import("@prisma/client/runtime/library").JsonValue;
        entityId: string;
        action: string;
        actorUserId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(entityType?: string, entityId?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.EntityType;
        metadataJson: import("@prisma/client/runtime/library").JsonValue;
        entityId: string;
        action: string;
        actorUserId: string | null;
    }[]>;
}
