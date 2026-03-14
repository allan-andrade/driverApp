import { VerificationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ReviewDocumentSubmissionDto {
  @IsEnum(VerificationStatus)
  verificationStatus!: VerificationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
