import { LessonLocationEventType, UserRole } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLessonLocationEventDto {
  @IsEnum(LessonLocationEventType)
  eventType!: LessonLocationEventType;

  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;

  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  actorRoleHint?: UserRole;
}
