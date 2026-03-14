import { FraudSeverity, FraudSignalType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFraudSignalDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsEnum(FraudSignalType)
  signalType!: FraudSignalType;

  @IsEnum(FraudSeverity)
  severity!: FraudSeverity;

  @IsInt()
  @Min(1)
  @Max(100)
  score!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
