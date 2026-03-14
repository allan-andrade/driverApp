import { IsBoolean, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateMySlotDto {
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsBoolean()
  isActive!: boolean;
}
