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
exports.InstructorsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const search_instructor_dto_1 = require("./dto/search-instructor.dto");
const upsert_instructor_dto_1 = require("./dto/upsert-instructor.dto");
const instructors_service_1 = require("./instructors.service");
let InstructorsController = class InstructorsController {
    instructorsService;
    constructor(instructorsService) {
        this.instructorsService = instructorsService;
    }
    upsertMe(userId, dto) {
        return this.instructorsService.upsertByUser(userId, dto);
    }
    me(userId) {
        return this.instructorsService.findMe(userId);
    }
    search(query) {
        return this.instructorsService.publicSearch(query);
    }
    findOne(id) {
        return this.instructorsService.findOne(id);
    }
    list() {
        return this.instructorsService.listAll();
    }
};
exports.InstructorsController = InstructorsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Post)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_instructor_dto_1.UpsertInstructorDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "upsertMe", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "me", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_instructor_dto_1.SearchInstructorDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "search", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "list", null);
exports.InstructorsController = InstructorsController = __decorate([
    (0, common_1.Controller)('instructors'),
    __metadata("design:paramtypes", [instructors_service_1.InstructorsService])
], InstructorsController);
//# sourceMappingURL=instructors.controller.js.map