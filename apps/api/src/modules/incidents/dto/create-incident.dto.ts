import { IncidentSeverity, IncidentType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateIncidentDto {
  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsOptional()
  @IsString()
  reportedUserId?: string;

  @IsEnum(IncidentType)
  type!: IncidentType;

  @IsEnum(IncidentSeverity)
  severity!: IncidentSeverity;

  @IsString()
  @MaxLength(1200)
  description!: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;
}
