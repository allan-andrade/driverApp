import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AvailabilityService } from '../availability/availability.service';
import { CreateMySlotDto } from '../availability/dto/create-my-slot.dto';
import { UpdateSlotDto } from '../availability/dto/update-slot.dto';
import { BookingsService } from '../bookings/bookings.service';
import { CreateMyPackageDto } from '../packages/dto/create-my-package.dto';
import { UpdatePackageDto } from '../packages/dto/update-package.dto';
import { PackagesService } from '../packages/packages.service';
import { CreateVehicleDto } from '../vehicles/dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../vehicles/dto/update-vehicle.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { SearchInstructorDto } from './dto/search-instructor.dto';
import { UpsertInstructorDto } from './dto/upsert-instructor.dto';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
export class InstructorsController {
  constructor(
    private readonly instructorsService: InstructorsService,
    private readonly vehiclesService: VehiclesService,
    private readonly availabilityService: AvailabilityService,
    private readonly packagesService: PackagesService,
    private readonly bookingsService: BookingsService,
  ) {}

  @Roles(UserRole.INSTRUCTOR)
  @Patch('me')
  upsertMe(@CurrentUser('userId') userId: string, @Body() dto: UpsertInstructorDto) {
    return this.instructorsService.upsertByUser(userId, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('me')
  me(@CurrentUser('userId') userId: string) {
    return this.instructorsService.findMe(userId);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Post('me/vehicles')
  createMyVehicle(@CurrentUser('userId') userId: string, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.createForInstructor(userId, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('me/vehicles')
  listMyVehicles(@CurrentUser('userId') userId: string) {
    return this.vehiclesService.listMine(userId);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch('me/vehicles/:id')
  updateMyVehicle(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateMine(userId, id, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Delete('me/vehicles/:id')
  deleteMyVehicle(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.vehiclesService.removeMine(userId, id);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Post('me/availability')
  createMyAvailability(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateMySlotDto,
  ) {
    return this.availabilityService.createMine(userId, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('me/availability')
  listMyAvailability(@CurrentUser('userId') userId: string) {
    return this.availabilityService.listMine(userId);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch('me/availability/:id')
  updateMyAvailability(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSlotDto,
  ) {
    return this.availabilityService.updateMine(userId, id, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Delete('me/availability/:id')
  deleteMyAvailability(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.availabilityService.removeMine(userId, id);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Post('me/packages')
  createMyPackage(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateMyPackageDto,
  ) {
    return this.packagesService.createMine(userId, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('me/packages')
  listMyPackages(@CurrentUser('userId') userId: string) {
    return this.packagesService.listMine(userId);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch('me/packages/:id')
  updateMyPackage(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePackageDto,
  ) {
    return this.packagesService.updateMine(userId, id, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Delete('me/packages/:id')
  deleteMyPackage(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.packagesService.removeMine(userId, id);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('me/bookings')
  listMyBookings(@CurrentUser('userId') userId: string) {
    return this.bookingsService.listMineAsInstructor(userId);
  }

  @Public()
  @Get('search')
  search(@Query() query: SearchInstructorDto) {
    return this.instructorsService.publicSearch(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  list() {
    return this.instructorsService.listAll();
  }
}
