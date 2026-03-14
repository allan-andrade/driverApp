import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PaymentsModule } from '../payments/payments.module';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [AuditModule, PaymentsModule],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService],
})
export class LessonsModule {}
