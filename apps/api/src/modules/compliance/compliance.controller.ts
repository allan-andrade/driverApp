import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ComplianceService } from './compliance.service';
import { CreateDocumentSubmissionDto } from './dto/create-document-submission.dto';
import { CreateDocumentRequirementDto } from './dto/create-document-requirement.dto';
import { ReviewDocumentSubmissionDto } from './dto/review-document-submission.dto';
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

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('requirements/:stateCode')
  listRequirementsByState(@Param('stateCode') stateCode: string) {
    return this.complianceService.listDocumentRequirements(stateCode.toUpperCase());
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Post('submissions')
  createDocumentSubmission(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateDocumentSubmissionDto,
  ) {
    return this.complianceService.createDocumentSubmission(userId, dto);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('submissions')
  listDocumentSubmissions(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.complianceService.listDocumentSubmissions(user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('submissions/me')
  listMySubmissions(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.complianceService.listDocumentSubmissions(user.userId, user.role);
  }

  @Roles(UserRole.ADMIN)
  @Patch('submissions/:id/review')
  reviewDocumentSubmission(
    @Param('id') id: string,
    @Body() dto: ReviewDocumentSubmissionDto,
    @CurrentUser('userId') actorUserId: string,
  ) {
    return this.complianceService.reviewDocumentSubmission(id, dto, actorUserId);
  }

}
