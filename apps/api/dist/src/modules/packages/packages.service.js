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
exports.PackagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let PackagesService = class PackagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.package.create({ data: dto });
    }
    listByInstructor(instructorProfileId) {
        return this.prisma.package.findMany({ where: { instructorProfileId } });
    }
    listBySchool(schoolId) {
        return this.prisma.package.findMany({ where: { schoolId } });
    }
    async findOne(id) {
        const item = await this.prisma.package.findUnique({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Package not found.');
        }
        return item;
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
        return this.prisma.package.create({
            data: {
                ...dto,
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
        const item = await this.prisma.package.findFirst({ where: { id, instructorProfileId } });
        if (!item) {
            throw new common_1.NotFoundException('Package not found for this instructor.');
        }
        return this.prisma.package.update({ where: { id }, data: dto });
    }
    async removeMine(userId, id) {
        const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
        const item = await this.prisma.package.findFirst({ where: { id, instructorProfileId } });
        if (!item) {
            throw new common_1.NotFoundException('Package not found for this instructor.');
        }
        return this.prisma.package.delete({ where: { id } });
    }
};
exports.PackagesService = PackagesService;
exports.PackagesService = PackagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PackagesService);
//# sourceMappingURL=packages.service.js.map