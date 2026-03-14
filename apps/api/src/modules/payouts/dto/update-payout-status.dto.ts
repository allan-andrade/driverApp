import { PayoutStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdatePayoutStatusDto {
  @IsEnum(PayoutStatus)
  status!: PayoutStatus;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  providerReference?: string;
}
