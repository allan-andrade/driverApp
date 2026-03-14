import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PayoutsModule } from '../payouts/payouts.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [AuditModule, PayoutsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
