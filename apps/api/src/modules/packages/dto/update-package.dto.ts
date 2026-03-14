import { CnhCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  lessonCount?: number;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsEnum(CnhCategory)
  category?: CnhCategory;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsBoolean()
  usesInstructorVehicle?: boolean;
}
