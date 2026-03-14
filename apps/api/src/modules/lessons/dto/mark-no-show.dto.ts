import { IsOptional, IsString, MaxLength } from 'class-validator';

export class MarkNoShowDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
