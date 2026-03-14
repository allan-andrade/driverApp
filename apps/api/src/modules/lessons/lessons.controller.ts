import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
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

  @Roles(UserRole.INSTRUCTOR)
  @Get('me')
  listMine(@CurrentUser('userId') userId: string) {
    return this.lessonsService.listMine(userId);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/check-in')
  checkIn(@Param('id') id: string, @Body() dto: VerifyPinDto) {
    return this.lessonsService.checkIn(id, dto);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Patch(':id/finish')
  finish(
    @Param('id') id: string,
    @Body() body: { endLat?: number; endLng?: number },
  ) {
    return this.lessonsService.finish(id, body.endLat, body.endLng);
  }
}
