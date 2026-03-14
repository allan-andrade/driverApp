import { CnhCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateMyPackageDto {
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
