import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { ComplianceService } from './compliance.service';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { UpsertStatePolicyDto } from './dto/upsert-state-policy.dto';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Roles(UserRole.ADMIN)
  @Post('state-policies')
  upsertStatePolicy(@Body() dto: UpsertStatePolicyDto) {
    return this.complianceService.upsertStatePolicy(dto);
  }

  @Roles(UserRole.ADMIN)
  @Get('state-policies')
  listPolicies() {
    return this.complianceService.listPolicies();
  }

  @Roles(UserRole.ADMIN)
  @Post('document-requirements')
  createDocumentRequirement(@Body() dto: CreateDocumentRequirementDto) {
    return this.complianceService.createDocumentRequirement(dto);
  }

  @Roles(UserRole.ADMIN)
  @Get('document-requirements')
  listDocumentRequirements(@Query('stateCode') stateCode?: string) {
    return this.complianceService.listDocumentRequirements(stateCode);
  }
}
