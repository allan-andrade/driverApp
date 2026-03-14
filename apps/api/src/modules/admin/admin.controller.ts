import { Controller, Get } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { InstructorsService } from '../instructors/instructors.service';
import { SchoolsService } from '../schools/schools.service';
import { UsersService } from '../users/users.service';

@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly instructorsService: InstructorsService,
    private readonly schoolsService: SchoolsService,
  ) {}

  @Get('users')
  users() {
    return this.usersService.listAll();
  }

  @Get('instructors')
  instructors() {
    return this.instructorsService.listAll();
  }

  @Get('schools')
  schools() {
    return this.schoolsService.listAll();
  }
}
