import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { InstructorsModule } from './modules/instructors/instructors.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { PackagesModule } from './modules/packages/packages.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AuditModule } from './modules/audit/audit.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { QueueModule } from './modules/queue/queue.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    CandidatesModule,
    InstructorsModule,
    SchoolsModule,
    VehiclesModule,
    AvailabilityModule,
    PackagesModule,
    BookingsModule,
    LessonsModule,
    ReviewsModule,
    ComplianceModule,
    AuditModule,
    PaymentsModule,
    DashboardModule,
    QueueModule,
  ],
  providers: [
    PrismaService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
