import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreatePackageDto } from './dto/create-package.dto';
import { PackagesService } from './packages.service';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Post()
  create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  @Get()
  list(@Query('instructorProfileId') instructorProfileId?: string, @Query('schoolId') schoolId?: string) {
    if (instructorProfileId) return this.packagesService.listByInstructor(instructorProfileId);
    if (schoolId) return this.packagesService.listBySchool(schoolId);
    return [];
  }
}
