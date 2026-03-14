import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class StartLessonDto {
  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  startLat?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  startLng?: number;

  @IsOptional()
  @IsString()
  startAddress?: string;
}
