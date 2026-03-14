import { Controller, Get } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles(UserRole.CANDIDATE)
  @Get('candidate/me')
  candidate(@CurrentUser('userId') userId: string) {
    return this.analyticsService.candidateMe(userId);
  }

  @Roles(UserRole.INSTRUCTOR)
  @Get('instructor/me')
  instructor(@CurrentUser('userId') userId: string) {
    return this.analyticsService.instructorMe(userId);
  }

  @Roles(UserRole.SCHOOL_MANAGER)
  @Get('school/me')
  school(@CurrentUser('userId') userId: string) {
    return this.analyticsService.schoolMe(userId);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin/overview')
  adminOverview() {
    return this.analyticsService.adminOverview();
  }

  @Roles(UserRole.ADMIN)
  @Get('admin/operations')
  adminOperations() {
    return this.analyticsService.adminOperations();
  }
}
