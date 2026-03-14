import { Controller, Get, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Roles(UserRole.ADMIN)
  @Get('events')
  events(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit ?? 300);
    return this.webhooksService.listRecent(Number.isNaN(parsedLimit) ? 300 : parsedLimit);
  }

  @Roles(UserRole.ADMIN)
  @Get('stats')
  stats() {
    return this.webhooksService.stats();
  }
}
