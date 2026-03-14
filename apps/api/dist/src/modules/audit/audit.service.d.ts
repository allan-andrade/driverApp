import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(dto: CreateAuditDto): Prisma.Prisma__AuditLogClient<{
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.EntityType;
        entityId: string;
        action: string;
        metadataJson: Prisma.JsonValue | null;
        actorUserId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    list(entityType?: string, entityId?: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        entityType: import(".prisma/client").$Enums.EntityType;
        entityId: string;
        action: string;
        metadataJson: Prisma.JsonValue | null;
        actorUserId: string | null;
    }[]>;
}
