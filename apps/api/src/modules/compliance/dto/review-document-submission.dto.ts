import { DocumentReviewDecision } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ReviewDocumentSubmissionDto {
  @IsEnum(DocumentReviewDecision)
  decision!: DocumentReviewDecision;

  @IsOptional()
  @IsString()
  reason?: string;
}
