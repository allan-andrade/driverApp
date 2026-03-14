import { CnhCategory, LearningStage } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpsertCandidateDto {
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(CnhCategory)
  targetCategory?: CnhCategory;

  @IsOptional()
  @IsEnum(LearningStage)
  learningStage?: LearningStage;

  @IsOptional()
  @IsBoolean()
  hasVehicle?: boolean;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  preferredInstructorGender?: string;
}
