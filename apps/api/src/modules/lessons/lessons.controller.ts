import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CancelLessonDto } from './dto/cancel-lesson.dto';
import { FinishLessonDto } from './dto/finish-lesson.dto';
import { MarkNoShowDto } from './dto/mark-no-show.dto';
import { StartLessonDto } from './dto/start-lesson.dto';
import { LessonsService } from './lessons.service';
import { VerifyPinDto } from './dto/verify-pin.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get()
  list(@Query('instructorProfileId') instructorProfileId: string) {
    return this.lessonsService.listByInstructor(instructorProfileId);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me')
  listMine(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.lessonsService.listMine(user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { userId: string; role: UserRole }) {
    return this.lessonsService.findOne(id, user.userId, user.role);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/check-in')
  checkIn(
    @Param('id') id: string,
    @Body() dto: VerifyPinDto,
    @CurrentUser() actor: { userId: string; role: UserRole },
  ) {
    return this.lessonsService.checkIn(id, dto, actor);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/start')
  start(
    @Param('id') id: string,
    @Body() dto: StartLessonDto,
    @CurrentUser() actor: { userId: string; role: UserRole },
  ) {
    return this.lessonsService.start(id, dto, actor);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/finish')
  finish(@Param('id') id: string, @Body() dto: FinishLessonDto, @CurrentUser() actor: { userId: string; role: UserRole }) {
    return this.lessonsService.finish(id, dto, actor);
  }

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Patch(':id/no-show')
  markNoShow(
    @Param('id') id: string,
    @Body() dto: MarkNoShowDto,
    @CurrentUser() actor: { userId: string; role: UserRole },
  ) {
    return this.lessonsService.markNoShow(id, dto.reason, actor);
  }

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelLessonDto,
    @CurrentUser() actor: { userId: string; role: UserRole },
  ) {
    return this.lessonsService.cancel(id, dto.reason, actor);
  }
}
