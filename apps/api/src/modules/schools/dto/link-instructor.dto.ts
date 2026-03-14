import { LinkStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class LinkInstructorDto {
  @IsString()
  instructorProfileId!: string;

  @IsEnum(LinkStatus)
  status!: LinkStatus;
}
