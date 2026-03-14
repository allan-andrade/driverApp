import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CandidatesService } from './candidates.service';
import { UpsertCandidateDto } from './dto/upsert-candidate.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Roles(UserRole.CANDIDATE)
  @Patch('me')
  upsertMe(@CurrentUser('userId') userId: string, @Body() dto: UpsertCandidateDto) {
    return this.candidatesService.upsertByUser(userId, dto);
  }

  @Roles(UserRole.CANDIDATE)
  @Get('me')
  me(@CurrentUser('userId') userId: string) {
    return this.candidatesService.findMe(userId);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  list() {
    return this.candidatesService.list();
  }
}
