import { CnhCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePackageDto {
  @IsOptional()
  @IsString()
  instructorProfileId?: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsString()
  title!: string;

  @IsInt()
  lessonCount!: number;

  @IsInt()
  durationMinutes!: number;

  @IsEnum(CnhCategory)
  category!: CnhCategory;

  @IsNumber()
  price!: number;

  @IsBoolean()
  usesInstructorVehicle!: boolean;
}
