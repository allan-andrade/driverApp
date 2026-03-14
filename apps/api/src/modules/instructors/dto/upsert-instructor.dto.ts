import { CnhCategory, InstructorType, VerificationStatus } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpsertInstructorDto {
  @IsEnum(InstructorType)
  instructorType!: InstructorType;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsExperience?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  serviceRadiusKm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  basePrice?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(CnhCategory, { each: true })
  categories?: CnhCategory[];

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;
}
