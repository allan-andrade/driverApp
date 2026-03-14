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
exports.LessonsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const lessons_service_1 = require("./lessons.service");
const verify_pin_dto_1 = require("./dto/verify-pin.dto");
let LessonsController = class LessonsController {
    lessonsService;
    constructor(lessonsService) {
        this.lessonsService = lessonsService;
    }
    list(instructorProfileId) {
        return this.lessonsService.listByInstructor(instructorProfileId);
    }
    listMine(userId) {
        return this.lessonsService.listMine(userId);
    }
    checkIn(id, dto) {
        return this.lessonsService.checkIn(id, dto);
    }
    finish(id, body) {
        return this.lessonsService.finish(id, body.endLat, body.endLng);
    }
};
exports.LessonsController = LessonsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR, client_1.UserRole.SCHOOL_MANAGER, client_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('instructorProfileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "list", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "listMine", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Patch)(':id/check-in'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, verify_pin_dto_1.VerifyPinDto]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "checkIn", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Patch)(':id/finish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "finish", null);
exports.LessonsController = LessonsController = __decorate([
    (0, common_1.Controller)('lessons'),
    __metadata("design:paramtypes", [lessons_service_1.LessonsService])
], LessonsController);
//# sourceMappingURL=lessons.controller.js.map