import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { StatePoliciesController } from './state-policies.controller';

@Module({
  imports: [AuditModule],
  controllers: [ComplianceController, StatePoliciesController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
