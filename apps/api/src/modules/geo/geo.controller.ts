import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateLessonLocationEventDto } from './dto/create-lesson-location-event.dto';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('lessons/:lessonId/events')
  listEvents(
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    return this.geoService.listEvents(lessonId, user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Post('lessons/:lessonId/events')
  createEvent(
    @Param('lessonId') lessonId: string,
    @Body() dto: CreateLessonLocationEventDto,
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    return this.geoService.createEvent(lessonId, dto, user.userId, user.role);
  }
}
