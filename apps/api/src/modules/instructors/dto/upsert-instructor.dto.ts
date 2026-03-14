import { CnhCategory, InstructorType, VerificationStatus } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpsertInstructorDto {
  @IsEnum(InstructorType)
  instructorType!: InstructorType;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

  @IsString()
  bio!: string;

  @IsInt()
  @Min(0)
  yearsExperience!: number;

  @IsInt()
  @Min(1)
  serviceRadiusKm!: number;

  @IsNumber()
  @Min(1)
  basePrice!: number;

  @IsBoolean()
  isActive!: boolean;

  @IsArray()
  @IsEnum(CnhCategory, { each: true })
  categories!: CnhCategory[];

  @IsString()
  city!: string;

  @IsString()
  state!: string;
}
