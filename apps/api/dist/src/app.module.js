"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const candidates_module_1 = require("./modules/candidates/candidates.module");
const instructors_module_1 = require("./modules/instructors/instructors.module");
const schools_module_1 = require("./modules/schools/schools.module");
const vehicles_module_1 = require("./modules/vehicles/vehicles.module");
const availability_module_1 = require("./modules/availability/availability.module");
const packages_module_1 = require("./modules/packages/packages.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const compliance_module_1 = require("./modules/compliance/compliance.module");
const audit_module_1 = require("./modules/audit/audit.module");
const payments_module_1 = require("./modules/payments/payments.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const queue_module_1 = require("./modules/queue/queue.module");
const admin_module_1 = require("./modules/admin/admin.module");
const marketplace_module_1 = require("./modules/marketplace/marketplace.module");
const payouts_module_1 = require("./modules/payouts/payouts.module");
const disputes_module_1 = require("./modules/disputes/disputes.module");
const incidents_module_1 = require("./modules/incidents/incidents.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const prisma_module_1 = require("./prisma.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            candidates_module_1.CandidatesModule,
            instructors_module_1.InstructorsModule,
            schools_module_1.SchoolsModule,
            vehicles_module_1.VehiclesModule,
            availability_module_1.AvailabilityModule,
            packages_module_1.PackagesModule,
            bookings_module_1.BookingsModule,
            lessons_module_1.LessonsModule,
            reviews_module_1.ReviewsModule,
            compliance_module_1.ComplianceModule,
            audit_module_1.AuditModule,
            payments_module_1.PaymentsModule,
            dashboard_module_1.DashboardModule,
            queue_module_1.QueueModule,
            admin_module_1.AdminModule,
            marketplace_module_1.MarketplaceModule,
            payouts_module_1.PayoutsModule,
            disputes_module_1.DisputesModule,
            incidents_module_1.IncidentsModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map