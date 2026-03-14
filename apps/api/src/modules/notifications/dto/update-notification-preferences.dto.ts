import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  inAppEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  smsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  bookingUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  lessonUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  paymentUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  safetyAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEnabled?: boolean;
}
