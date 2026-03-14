import { CnhCategory, InstructorType, TransmissionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchMarketplaceDto {
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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsEnum(TransmissionType)
  transmissionType?: TransmissionType;

  @IsOptional()
  @IsIn(['true', 'false'])
  verifiedOnly?: 'true' | 'false';

  @IsOptional()
  @IsIn(['true', 'false'])
  hasAvailability?: 'true' | 'false';

  @IsOptional()
  @IsIn(['true', 'false'])
  usesInstructorVehicle?: 'true' | 'false';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minReviews?: number;

  @IsOptional()
  @IsString()
  candidateProfileId?: string;

  @IsOptional()
  @IsIn(['relevance', 'price_asc', 'price_desc', 'rating', 'trust', 'teaching'])
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'trust' | 'teaching';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number;
}
