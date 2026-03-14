import { CnhCategory, LearningStage } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpsertCandidateDto {
  @IsString()
  fullName!: string;

  @IsString()
  cpf!: string;

  @IsDateString()
  birthDate!: string;

  @IsString()
  state!: string;

  @IsString()
  city!: string;

  @IsEnum(CnhCategory)
  targetCategory!: CnhCategory;

  @IsEnum(LearningStage)
  learningStage!: LearningStage;

  @IsBoolean()
  hasVehicle!: boolean;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  preferredInstructorGender?: string;
}
