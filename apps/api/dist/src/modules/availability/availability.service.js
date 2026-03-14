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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AvailabilityService = class AvailabilityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createSlot(dto) {
        return this.prisma.availabilitySlot.create({ data: dto });
    }
    listByInstructor(instructorProfileId) {
        return this.prisma.availabilitySlot.findMany({
            where: { instructorProfileId },
            orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
        });
    }
    async getInstructorProfileIdByUserId(userId) {
        const profile = await this.prisma.instructorProfile.findUnique({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Instructor profile not found for this user.');
        }
        return profile.id;
    }
    async createMine(userId, dto) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        return this.prisma.availabilitySlot.create({ data: { ...dto, instructorProfileId } });
    }
    async listMine(userId) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        return this.listByInstructor(instructorProfileId);
    }
    async updateMine(userId, id, dto) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        const slot = await this.prisma.availabilitySlot.findFirst({ where: { id, instructorProfileId } });
        if (!slot) {
            throw new common_1.NotFoundException('Availability slot not found for this instructor.');
        }
        return this.prisma.availabilitySlot.update({ where: { id }, data: dto });
    }
    async removeMine(userId, id) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        const slot = await this.prisma.availabilitySlot.findFirst({ where: { id, instructorProfileId } });
        if (!slot) {
            throw new common_1.NotFoundException('Availability slot not found for this instructor.');
        }
        return this.prisma.availabilitySlot.delete({ where: { id } });
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map