import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  candidateProfileId?: string;

  @IsOptional()
  @IsString()
  instructorProfileId?: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsDateString()
  scheduledStart!: string;

  @IsDateString()
  scheduledEnd!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceTotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  platformFee?: number;
}
