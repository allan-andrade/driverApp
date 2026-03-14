import { CnhCategory, TransmissionType, VerificationStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsEnum(TransmissionType)
  transmissionType?: TransmissionType;

  @IsOptional()
  @IsEnum(CnhCategory)
  categorySupported?: CnhCategory;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;
}
