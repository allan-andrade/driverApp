import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { SearchInstructorDto } from './dto/search-instructor.dto';
import { UpsertInstructorDto } from './dto/upsert-instructor.dto';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Roles(UserRole.INSTRUCTOR)
  @Post('me')
  upsertMe(@CurrentUser('userId') userId: string, @Body() dto: UpsertInstructorDto) {
    return this.instructorsService.upsertByUser(userId, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('me')
  me(@CurrentUser('userId') userId: string) {
    return this.instructorsService.findMe(userId);
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
