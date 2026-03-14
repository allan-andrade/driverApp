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
import { AdminModule } from './modules/admin/admin.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RankingsModule } from './modules/rankings/rankings.module';
import { ChatModule } from './modules/chat/chat.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { GeoModule } from './modules/geo/geo.module';
import { OpsModule } from './modules/ops/ops.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
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
    AdminModule,
    MarketplaceModule,
    PayoutsModule,
    DisputesModule,
    IncidentsModule,
    MetricsModule,
    NotificationsModule,
    WalletsModule,
    AnalyticsModule,
    RankingsModule,
    ChatModule,
    GeoModule,
    FraudModule,
    RemindersModule,
    WebhooksModule,
    OpsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
