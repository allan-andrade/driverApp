import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateAuditDto } from './dto/create-audit.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(dto: CreateAuditDto) {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: dto.actorUserId ?? null,
        entityType: dto.entityType,
        entityId: dto.entityId,
        action: dto.action,
        metadataJson: dto.metadataJson as Prisma.InputJsonValue,
      },
    });
  }

  list(entityType?: string, entityId?: string) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(entityType ? { entityType: entityType as never } : {}),
        ...(entityId ? { entityId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
