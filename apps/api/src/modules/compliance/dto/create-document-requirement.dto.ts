import { EntityType } from '@prisma/client';
import { IsBoolean, IsEnum, IsObject, IsString } from 'class-validator';

export class CreateDocumentRequirementDto {
  @IsEnum(EntityType)
  entityType!: EntityType;

  @IsString()
  stateCode!: string;

  @IsString()
  name!: string;

  @IsBoolean()
  required!: boolean;

  @IsObject()
  metadataJson!: Record<string, unknown>;
}
