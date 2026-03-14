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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const payments_service_1 = require("./payments.service");
const update_payment_status_dto_1 = require("./dto/update-payment-status.dto");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    listMine(user) {
        return this.paymentsService.listMine(user.userId, user.role);
    }
    listAll() {
        return this.paymentsService.listAll();
    }
    updateStatus(id, dto, actorUserId) {
        if (dto.status === client_1.PaymentStatus.CAPTURED || dto.status === client_1.PaymentStatus.PAID) {
            return this.paymentsService.capture(id, actorUserId, dto.providerReference);
        }
        if (dto.status === client_1.PaymentStatus.REFUNDED) {
            return this.paymentsService.refund(id, actorUserId);
        }
        if (dto.status === client_1.PaymentStatus.CANCELLED) {
            return this.paymentsService.cancel(id, actorUserId);
        }
        return this.paymentsService.updateStatus(id, dto.status, actorUserId, dto.providerReference);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.CANDIDATE, client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER, client_1.UserRole.ADMIN),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listMine", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_status_dto_1.UpdatePaymentStatusDto, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updateStatus", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map