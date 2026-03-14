import { Controller, Get, Param, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { MetricsService } from './metrics.service';

@Controller('admin')
@Roles(UserRole.ADMIN)
export class MetricsAdminController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('instructor-metrics')
  listInstructorMetrics() {
    return this.metricsService.listAll();
  }

  @Post('instructors/:id/recalculate-metrics')
  recalculateInstructorMetrics(
    @Param('id') instructorProfileId: string,
    @CurrentUser('userId') actorUserId: string,
  ) {
    return this.metricsService.recalculateForInstructor(instructorProfileId, actorUserId, 'ADMIN_ENDPOINT');
  }
}
