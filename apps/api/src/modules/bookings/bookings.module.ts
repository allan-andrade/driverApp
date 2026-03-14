import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PackagesModule } from '../packages/packages.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [AuditModule, PackagesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
