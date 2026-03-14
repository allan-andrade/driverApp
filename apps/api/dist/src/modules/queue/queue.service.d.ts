import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class QueueService implements OnModuleDestroy {
    private readonly redis;
    private readonly auditQueue;
    private readonly worker;
    constructor(configService: ConfigService);
    enqueueAuditEvent(payload: Record<string, unknown>): Promise<import("bullmq").Job<any, any, string>>;
    onModuleDestroy(): Promise<void>;
}
