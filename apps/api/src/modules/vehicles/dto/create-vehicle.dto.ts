import { CnhCategory, TransmissionType, VerificationStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  instructorProfileId?: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsString()
  plate!: string;

  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsInt()
  year!: number;

  @IsEnum(TransmissionType)
  transmissionType!: TransmissionType;

  @IsEnum(CnhCategory)
  categorySupported!: CnhCategory;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;
}
