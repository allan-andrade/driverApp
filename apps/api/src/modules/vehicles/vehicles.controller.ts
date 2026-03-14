import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get()
  list(
    @Query('instructorProfileId') instructorProfileId?: string,
    @Query('schoolId') schoolId?: string,
  ) {
    if (instructorProfileId) return this.vehiclesService.listByInstructor(instructorProfileId);
    if (schoolId) return this.vehiclesService.listBySchool(schoolId);
    return [];
  }
}
