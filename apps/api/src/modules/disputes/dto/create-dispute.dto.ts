import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDisputeDto {
  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsString()
  @MaxLength(200)
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
