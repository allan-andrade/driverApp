import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  listRecent(limit = 300) {
    return this.prisma.webhookEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  stats() {
    return this.prisma.webhookEvent.groupBy({
      by: ['provider', 'processed'],
      _count: { _all: true },
    });
  }
}
