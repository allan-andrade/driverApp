import { DisputeStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDisputeStatusDto {
  @IsEnum(DisputeStatus)
  status!: DisputeStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resolution?: string;
}
