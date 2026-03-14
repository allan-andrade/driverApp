import { VerificationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpsertSchoolDto {
  @IsString()
  legalName!: string;

  @IsString()
  tradeName!: string;

  @IsString()
  cnpj!: string;

  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;
}
