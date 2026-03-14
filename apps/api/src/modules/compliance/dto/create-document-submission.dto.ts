import { IsOptional, IsString } from 'class-validator';

export class CreateDocumentSubmissionDto {
  @IsOptional()
  @IsString()
  stateCode?: string;

  @IsString()
  documentType!: string;

  @IsString()
  fileUrl!: string;

  @IsOptional()
  metadataJson?: Record<string, unknown>;
}
