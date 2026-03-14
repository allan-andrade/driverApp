import { Controller, Get } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(UserRole.CANDIDATE)
  @Get('candidate')
  candidate(@CurrentUser('userId') userId: string) {
    return this.dashboardService.candidateDashboard(userId);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('instructor')
  instructor(@CurrentUser('userId') userId: string) {
    return this.dashboardService.instructorDashboard(userId);
  }

  @Roles(UserRole.SCHOOL_MANAGER)
  @Get('school')
  school(@CurrentUser('userId') userId: string) {
    return this.dashboardService.schoolDashboard(userId);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  admin() {
    return this.dashboardService.adminDashboard();
  }
}
