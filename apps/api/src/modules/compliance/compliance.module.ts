import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { MetricsModule } from '../metrics/metrics.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { StatePoliciesController } from './state-policies.controller';

@Module({
  imports: [AuditModule, NotificationsModule, MetricsModule],
  controllers: [ComplianceController, StatePoliciesController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
