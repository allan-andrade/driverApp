"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let QueueService = class QueueService {
    redis;
    auditQueue;
    worker;
    constructor(configService) {
        const connection = { url: configService.get('REDIS_URL') ?? 'redis://localhost:6379' };
        this.redis = new ioredis_1.default(connection.url);
        this.auditQueue = new bullmq_1.Queue('audit-events', { connection });
        this.worker = new bullmq_1.Worker('audit-events', async (job) => {
            console.log('Processed queue job', job.name);
        }, { connection });
    }
    enqueueAuditEvent(payload) {
        return this.auditQueue.add('audit.event', payload);
    }
    async onModuleDestroy() {
        await this.worker.close();
        await this.auditQueue.close();
        await this.redis.quit();
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QueueService);
//# sourceMappingURL=queue.service.js.map