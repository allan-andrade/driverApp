import { Module } from '@nestjs/common';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { StatePoliciesController } from './state-policies.controller';

@Module({
  controllers: [ComplianceController, StatePoliciesController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
