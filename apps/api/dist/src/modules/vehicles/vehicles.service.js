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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let VehiclesService = class VehiclesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.vehicle.create({
            data: {
                ...dto,
                verificationStatus: dto.verificationStatus ?? 'PENDING',
            },
        });
    }
    listByInstructor(instructorProfileId) {
        return this.prisma.vehicle.findMany({ where: { instructorProfileId } });
    }
    listBySchool(schoolId) {
        return this.prisma.vehicle.findMany({ where: { schoolId } });
    }
    async getInstructorProfileIdByUserId(userId) {
        const profile = await this.prisma.instructorProfile.findUnique({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Instructor profile not found for this user.');
        }
        return profile.id;
    }
    async createForInstructor(userId, dto) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        return this.prisma.vehicle.create({
            data: {
                plate: dto.plate,
                brand: dto.brand,
                model: dto.model,
                year: dto.year,
                transmissionType: dto.transmissionType,
                categorySupported: dto.categorySupported,
                verificationStatus: dto.verificationStatus ?? 'PENDING',
                instructorProfileId,
            },
        });
    }
    async listMine(userId) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        return this.listByInstructor(instructorProfileId);
    }
    async updateMine(userId, id, dto) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id, instructorProfileId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found for this instructor.');
        }
        return this.prisma.vehicle.update({
            where: { id },
            data: {
                plate: dto.plate,
                brand: dto.brand,
                model: dto.model,
                year: dto.year,
                transmissionType: dto.transmissionType,
                categorySupported: dto.categorySupported,
                verificationStatus: dto.verificationStatus,
            },
        });
    }
    async removeMine(userId, id) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        const vehicle = await this.prisma.vehicle.findFirst({ where: { id, instructorProfileId } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found for this instructor.');
        }
        return this.prisma.vehicle.delete({ where: { id } });
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map