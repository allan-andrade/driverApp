import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentStatusDto } from './dto/update-incident-status.dto';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Post()
  create(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Body() dto: CreateIncidentDto,
  ) {
    return this.incidentsService.create(user, dto);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me')
  listMine(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.incidentsService.listMine(user.userId, user.role);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  listAll() {
    return this.incidentsService.listAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateIncidentStatusDto,
    @CurrentUser('userId') actorUserId: string,
  ) {
    return this.incidentsService.updateStatus(id, dto.status, actorUserId);
  }
}
