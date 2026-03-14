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
const availability_service_1 = require("../availability/availability.service");
const create_my_slot_dto_1 = require("../availability/dto/create-my-slot.dto");
const update_slot_dto_1 = require("../availability/dto/update-slot.dto");
const bookings_service_1 = require("../bookings/bookings.service");
const create_my_package_dto_1 = require("../packages/dto/create-my-package.dto");
const update_package_dto_1 = require("../packages/dto/update-package.dto");
const packages_service_1 = require("../packages/packages.service");
const create_vehicle_dto_1 = require("../vehicles/dto/create-vehicle.dto");
const update_vehicle_dto_1 = require("../vehicles/dto/update-vehicle.dto");
const vehicles_service_1 = require("../vehicles/vehicles.service");
const search_instructor_dto_1 = require("./dto/search-instructor.dto");
const upsert_instructor_dto_1 = require("./dto/upsert-instructor.dto");
const instructors_service_1 = require("./instructors.service");
let InstructorsController = class InstructorsController {
    instructorsService;
    vehiclesService;
    availabilityService;
    packagesService;
    bookingsService;
    constructor(instructorsService, vehiclesService, availabilityService, packagesService, bookingsService) {
        this.instructorsService = instructorsService;
        this.vehiclesService = vehiclesService;
        this.availabilityService = availabilityService;
        this.packagesService = packagesService;
        this.bookingsService = bookingsService;
    }
    upsertMe(userId, dto) {
        return this.instructorsService.upsertByUser(userId, dto);
    }
    me(userId) {
        return this.instructorsService.findMe(userId);
    }
    createMyVehicle(userId, dto) {
        return this.vehiclesService.createForInstructor(userId, dto);
    }
    listMyVehicles(userId) {
        return this.vehiclesService.listMine(userId);
    }
    updateMyVehicle(userId, id, dto) {
        return this.vehiclesService.updateMine(userId, id, dto);
    }
    deleteMyVehicle(userId, id) {
        return this.vehiclesService.removeMine(userId, id);
    }
    createMyAvailability(userId, dto) {
        return this.availabilityService.createMine(userId, dto);
    }
    listMyAvailability(userId) {
        return this.availabilityService.listMine(userId);
    }
    updateMyAvailability(userId, id, dto) {
        return this.availabilityService.updateMine(userId, id, dto);
    }
    deleteMyAvailability(userId, id) {
        return this.availabilityService.removeMine(userId, id);
    }
    createMyPackage(userId, dto) {
        return this.packagesService.createMine(userId, dto);
    }
    listMyPackages(userId) {
        return this.packagesService.listMine(userId);
    }
    updateMyPackage(userId, id, dto) {
        return this.packagesService.updateMine(userId, id, dto);
    }
    deleteMyPackage(userId, id) {
        return this.packagesService.removeMine(userId, id);
    }
    listMyBookings(userId) {
        return this.bookingsService.listMineAsInstructor(userId);
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
    (0, common_1.Patch)('me'),
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
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Post)('me/vehicles'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "createMyVehicle", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Get)('me/vehicles'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "listMyVehicles", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Patch)('me/vehicles/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_vehicle_dto_1.UpdateVehicleDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "updateMyVehicle", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Delete)('me/vehicles/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "deleteMyVehicle", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Post)('me/availability'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_my_slot_dto_1.CreateMySlotDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "createMyAvailability", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Get)('me/availability'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "listMyAvailability", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Patch)('me/availability/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_slot_dto_1.UpdateSlotDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "updateMyAvailability", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Delete)('me/availability/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "deleteMyAvailability", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Post)('me/packages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_my_package_dto_1.CreateMyPackageDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "createMyPackage", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Get)('me/packages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "listMyPackages", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Patch)('me/packages/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_package_dto_1.UpdatePackageDto]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "updateMyPackage", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Delete)('me/packages/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "deleteMyPackage", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.UserRole.INSTRUCTOR),
    (0, common_1.Get)('me/bookings'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstructorsController.prototype, "listMyBookings", null);
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
    __metadata("design:paramtypes", [instructors_service_1.InstructorsService,
        vehicles_service_1.VehiclesService,
        availability_service_1.AvailabilityService,
        packages_service_1.PackagesService,
        bookings_service_1.BookingsService])
], InstructorsController);
//# sourceMappingURL=instructors.controller.js.map