import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  bookingId!: string;

  @IsString()
  candidateProfileId!: string;

  @IsString()
  instructorProfileId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  punctuality!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  didactics!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  professionalism!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  safety!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  examReadiness!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
