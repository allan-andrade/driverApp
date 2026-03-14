import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { MetricsAdminController } from './metrics-admin.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [AuditModule],
  controllers: [MetricsAdminController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
