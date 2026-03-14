import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { BookingsService } from './bookings.service';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RescheduleBookingDto } from './dto/reschedule-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles(UserRole.CANDIDATE, UserRole.SCHOOL_MANAGER)
  @Post()
  create(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Body() dto: CreateBookingDto,
  ) {
    if (user.role === UserRole.CANDIDATE) {
      return this.bookingsService.createForCandidate(user.userId, dto);
    }

    return this.bookingsService.create(dto, user.userId);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me')
  listMine(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.bookingsService.listMine(user.userId, user.role);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  list(
    @Query('candidateProfileId') candidateProfileId?: string,
    @Query('instructorProfileId') instructorProfileId?: string,
    @Query('schoolId') schoolId?: string,
  ) {
    return this.bookingsService.list({ candidateProfileId, instructorProfileId, schoolId });
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { userId: string; role: UserRole }) {
    return this.bookingsService.findOne(id, user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelBookingDto,
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    return this.bookingsService.cancel(id, dto, user);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Patch(':id/reschedule')
  reschedule(
    @Param('id') id: string,
    @Body() dto: RescheduleBookingDto,
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    return this.bookingsService.reschedule(id, dto, user);
  }
}
