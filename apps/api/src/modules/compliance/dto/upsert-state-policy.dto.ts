import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class UpsertStatePolicyDto {
  @IsString()
  stateCode!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsObject()
  rulesJson!: Record<string, unknown>;

  @IsObject()
  examFlowJson!: Record<string, unknown>;

  @IsObject()
  docsJson!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  notes?: string;
}
