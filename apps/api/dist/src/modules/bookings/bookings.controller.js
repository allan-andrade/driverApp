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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const reschedule_booking_dto_1 = require("./dto/reschedule-booking.dto");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    create(user, dto) {
        if (user.role === client_1.UserRole.CANDIDATE) {
            return this.bookingsService.createForCandidate(user.userId, dto);
        }
        return this.bookingsService.create(dto, user.userId);
    }
    listMine(user) {
        return this.bookingsService.listMine(user.userId, user.role);
    }
    list(candidateProfileId, instructorProfileId, schoolId) {
        return this.bookingsService.list({ candidateProfileId, instructorProfileId, schoolId });
    }
    findOne(id) {
        return this.bookingsService.findOne(id);
    }
    cancel(id, actorUserId) {
        return this.bookingsService.cancel(id, actorUserId);
    }
    reschedule(id, dto, actorUserId) {
        return this.bookingsService.reschedule(id, dto, actorUserId);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.SCHOOL_MANAGER),
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER, client_1.UserRole.ADMIN),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "listMine", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER, client_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('candidateProfileId')),
    __param(1, (0, common_1.Query)('instructorProfileId')),
    __param(2, (0, common_1.Query)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "list", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER, client_1.UserRole.ADMIN),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER),
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "cancel", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER),
    (0, common_1.Patch)(':id/reschedule'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reschedule_booking_dto_1.RescheduleBookingDto, String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "reschedule", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map