import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { FraudModule } from '../fraud/fraud.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PayoutsModule } from '../payouts/payouts.module';
import { WalletsModule } from '../wallets/wallets.module';
import { PaymentsController } from './payments.controller';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentsService } from './payments.service';

@Module({
  imports: [AuditModule, PayoutsModule, WalletsModule, NotificationsModule, FraudModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentGatewayService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
