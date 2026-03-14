import { CnhCategory, InstructorType } from '@prisma/client';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class SearchInstructorDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsEnum(CnhCategory)
  category?: CnhCategory;

  @IsOptional()
  @IsEnum(InstructorType)
  instructorType?: InstructorType;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;
}
