import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ComplianceService } from './compliance.service';

@Controller('state-policies')
export class StatePoliciesController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Public()
  @Get()
  listPolicies() {
    return this.complianceService.listPolicies();
  }

  @Public()
  @Get(':stateCode')
  findByState(@Param('stateCode') stateCode: string) {
    return this.complianceService.findPolicyByStateCode(stateCode.toUpperCase());
  }
}
