import { EntityType } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAuditDto {
  @IsOptional()
  @IsString()
  actorUserId?: string;

  @IsEnum(EntityType)
  entityType!: EntityType;

  @IsString()
  entityId!: string;

  @IsString()
  action!: string;

  @IsObject()
  metadataJson!: Record<string, unknown>;
}
