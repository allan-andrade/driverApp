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
exports.SchoolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let SchoolsService = class SchoolsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    upsertByManager(managerUserId, dto) {
        return this.prisma.school.upsert({
            where: { managerUserId },
            create: {
                ...dto,
                verificationStatus: dto.verificationStatus ?? 'PENDING',
                managerUserId,
            },
            update: dto,
        });
    }
    async linkInstructor(managerUserId, dto) {
        const school = await this.prisma.school.findUnique({ where: { managerUserId } });
        if (!school)
            throw new common_1.NotFoundException('School profile not found.');
        return this.prisma.instructorSchoolLink.upsert({
            where: {
                instructorProfileId_schoolId: {
                    instructorProfileId: dto.instructorProfileId,
                    schoolId: school.id,
                },
            },
            create: {
                instructorProfileId: dto.instructorProfileId,
                schoolId: school.id,
                status: dto.status,
            },
            update: { status: dto.status },
        });
    }
    findMySchool(managerUserId) {
        return this.prisma.school.findUnique({
            where: { managerUserId },
            include: { instructorLinks: { include: { instructorProfile: true } }, vehicles: true },
        });
    }
    listAll() {
        return this.prisma.school.findMany({ orderBy: { createdAt: 'desc' } });
    }
};
exports.SchoolsService = SchoolsService;
exports.SchoolsService = SchoolsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchoolsService);
//# sourceMappingURL=schools.service.js.map