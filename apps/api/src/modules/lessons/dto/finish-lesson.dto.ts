import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class FinishLessonDto {
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  endLat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  endLng?: number;

  @IsOptional()
  @IsString()
  endAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
