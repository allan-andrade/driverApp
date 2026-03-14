import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateAuditDto) {
    return this.auditService.log(dto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  list(@Query('entityType') entityType?: string, @Query('entityId') entityId?: string) {
    return this.auditService.list(entityType, entityId);
  }
}
