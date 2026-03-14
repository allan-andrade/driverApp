import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { MetricsModule } from '../metrics/metrics.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PackagesModule } from '../packages/packages.module';
import { RemindersModule } from '../reminders/reminders.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [AuditModule, PackagesModule, NotificationsModule, MetricsModule, RemindersModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
