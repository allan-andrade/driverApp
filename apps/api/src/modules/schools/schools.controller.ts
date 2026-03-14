import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { LinkInstructorDto } from './dto/link-instructor.dto';
import { UpsertSchoolDto } from './dto/upsert-school.dto';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Roles(UserRole.SCHOOL_MANAGER)
  @Patch('my-school')
  upsert(@CurrentUser('userId') userId: string, @Body() dto: UpsertSchoolDto) {
    return this.schoolsService.upsertByManager(userId, dto);
  }

  @Roles(UserRole.SCHOOL_MANAGER)
  @Get('my-school')
  mySchool(@CurrentUser('userId') userId: string) {
    return this.schoolsService.findMySchool(userId);
  }

  @Roles(UserRole.SCHOOL_MANAGER)
  @Post('me/link-instructor')
  linkInstructor(@CurrentUser('userId') userId: string, @Body() dto: LinkInstructorDto) {
    return this.schoolsService.linkInstructor(userId, dto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  list() {
    return this.schoolsService.listAll();
  }
}
