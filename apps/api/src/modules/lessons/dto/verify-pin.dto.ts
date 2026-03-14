import { IsOptional, IsString, Length } from 'class-validator';

export class VerifyPinDto {
  @IsString()
  @Length(4, 4)
  pinCode!: string;

  @IsOptional()
  startLat?: number;

  @IsOptional()
  startLng?: number;
}
