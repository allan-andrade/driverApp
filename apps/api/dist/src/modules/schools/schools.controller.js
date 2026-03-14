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
exports.SchoolsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const link_instructor_dto_1 = require("./dto/link-instructor.dto");
const upsert_school_dto_1 = require("./dto/upsert-school.dto");
const schools_service_1 = require("./schools.service");
let SchoolsController = class SchoolsController {
    schoolsService;
    constructor(schoolsService) {
        this.schoolsService = schoolsService;
    }
    upsert(userId, dto) {
        return this.schoolsService.upsertByManager(userId, dto);
    }
    mySchool(userId) {
        return this.schoolsService.findMySchool(userId);
    }
    linkInstructor(userId, dto) {
        return this.schoolsService.linkInstructor(userId, dto);
    }
    list() {
        return this.schoolsService.listAll();
    }
};
exports.SchoolsController = SchoolsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.SCHOOL_MANAGER),
    (0, common_1.Patch)('my-school'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_school_dto_1.UpsertSchoolDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "upsert", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.SCHOOL_MANAGER),
    (0, common_1.Get)('my-school'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "mySchool", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.SCHOOL_MANAGER),
    (0, common_1.Post)('me/link-instructor'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, link_instructor_dto_1.LinkInstructorDto]),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "linkInstructor", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchoolsController.prototype, "list", null);
exports.SchoolsController = SchoolsController = __decorate([
    (0, common_1.Controller)('schools'),
    __metadata("design:paramtypes", [schools_service_1.SchoolsService])
], SchoolsController);
//# sourceMappingURL=schools.controller.js.map