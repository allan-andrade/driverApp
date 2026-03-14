import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly auditQueue: Queue;
  private readonly worker: Worker;

  constructor(configService: ConfigService) {
    const connection = { url: configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379' };
    this.redis = new Redis(connection.url);
    this.auditQueue = new Queue('audit-events', { connection });
    this.worker = new Worker(
      'audit-events',
      async (job) => {
        // Stub worker prepared for asynchronous compliance checks and notifications.
        console.log('Processed queue job', job.name);
      },
      { connection },
    );
  }

  enqueueAuditEvent(payload: Record<string, unknown>) {
    return this.auditQueue.add('audit.event', payload);
  }

  async onModuleDestroy() {
    await this.worker.close();
    await this.auditQueue.close();
    await this.redis.quit();
  }
}
