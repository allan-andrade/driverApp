import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { DisputesService } from './disputes.service';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Post()
  create(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Body() dto: CreateDisputeDto,
  ) {
    return this.disputesService.create(user, dto);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me')
  listMine(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.disputesService.listMine(user.userId, user.role);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  listAll() {
    return this.disputesService.listAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDisputeStatusDto,
    @CurrentUser('userId') actorUserId: string,
  ) {
    return this.disputesService.updateStatus(id, dto.status, dto.resolution, actorUserId);
  }
}
