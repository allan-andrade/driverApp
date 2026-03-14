import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelLessonDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
