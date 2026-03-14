import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { AvailabilityService } from './availability.service';
import { CreateSlotDto } from './dto/create-slot.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Post('slots')
  create(@Body() dto: CreateSlotDto) {
    return this.availabilityService.createSlot(dto);
  }

  @Get('slots')
  list(@Query('instructorProfileId') instructorProfileId: string) {
    return this.availabilityService.listByInstructor(instructorProfileId);
  }
}
