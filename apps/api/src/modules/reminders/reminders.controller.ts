import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RemindersService } from './reminders.service';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Roles(UserRole.ADMIN, UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Get('logs')
  listLogs(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.remindersService.listLogs(user.role, user.userId);
  }

  @Roles(UserRole.ADMIN)
  @Post('process-due')
  processDue() {
    return this.remindersService.processDueReminders();
  }

  @Roles(UserRole.ADMIN, UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Post('queue-booking')
  queueBooking(
    @Query('bookingId') bookingId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.remindersService.queueBookingReminder(bookingId, userId);
  }
}
