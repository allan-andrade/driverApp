import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNumber()
  priceTotal!: number;

  @IsNumber()
  platformFee!: number;
}
