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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const instructors_service_1 = require("../instructors/instructors.service");
const schools_service_1 = require("../schools/schools.service");
const users_service_1 = require("../users/users.service");
let AdminController = class AdminController {
    usersService;
    instructorsService;
    schoolsService;
    constructor(usersService, instructorsService, schoolsService) {
        this.usersService = usersService;
        this.instructorsService = instructorsService;
        this.schoolsService = schoolsService;
    }
    users() {
        return this.usersService.listAll();
    }
    instructors() {
        return this.instructorsService.listAll();
    }
    schools() {
        return this.schoolsService.listAll();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "users", null);
__decorate([
    (0, common_1.Get)('instructors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "instructors", null);
__decorate([
    (0, common_1.Get)('schools'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "schools", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        instructors_service_1.InstructorsService,
        schools_service_1.SchoolsService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map