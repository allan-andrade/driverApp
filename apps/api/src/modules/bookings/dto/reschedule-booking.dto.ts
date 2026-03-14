import { IsDateString } from 'class-validator';

export class RescheduleBookingDto {
  @IsDateString()
  scheduledStart!: string;

  @IsDateString()
  scheduledEnd!: string;
}
