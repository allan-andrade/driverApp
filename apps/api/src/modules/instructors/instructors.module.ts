import { Module } from '@nestjs/common';
import { AvailabilityModule } from '../availability/availability.module';
import { BookingsModule } from '../bookings/bookings.module';
import { PackagesModule } from '../packages/packages.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { InstructorsController } from './instructors.controller';
import { InstructorsService } from './instructors.service';

@Module({
  imports: [VehiclesModule, AvailabilityModule, PackagesModule, BookingsModule],
  controllers: [InstructorsController],
  providers: [InstructorsService],
  exports: [InstructorsService],
})
export class InstructorsModule {}
