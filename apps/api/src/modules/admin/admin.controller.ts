import { Controller, Get } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { ComplianceService } from '../compliance/compliance.service';
import { Body, Param, Patch } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ReviewDocumentSubmissionDto } from '../compliance/dto/review-document-submission.dto';
import { InstructorsService } from '../instructors/instructors.service';
import { SchoolsService } from '../schools/schools.service';
import { UsersService } from '../users/users.service';

@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly instructorsService: InstructorsService,
    private readonly schoolsService: SchoolsService,
    private readonly complianceService: ComplianceService,
  ) {}

  @Get('users')
  users() {
    return this.usersService.listAll();
  }

  @Get('instructors')
  instructors() {
    return this.instructorsService.listAll();
  }

  @Get('schools')
  schools() {
    return this.schoolsService.listAll();
  }

  @Get('compliance/submissions')
  complianceSubmissions() {
    return this.complianceService.listDocumentSubmissions('', UserRole.ADMIN);
  }

  @Patch('compliance/submissions/:id/review')
  reviewComplianceSubmission(
    @Param('id') id: string,
    @Body() dto: ReviewDocumentSubmissionDto,
    @CurrentUser('userId') actorUserId: string,
  ) {
    return this.complianceService.reviewDocumentSubmission(id, dto, actorUserId);
  }
}
