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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma.service");
let LessonsService = class LessonsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listByInstructor(instructorProfileId) {
        return this.prisma.lesson.findMany({ where: { instructorProfileId }, orderBy: { createdAt: 'desc' } });
    }
    async listMine(userId) {
        const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
        if (!instructor) {
            throw new common_1.NotFoundException('Instructor profile not found.');
        }
        return this.listByInstructor(instructor.id);
    }
    async checkIn(lessonId, dto) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found.');
        if (lesson.pinCode !== dto.pinCode) {
            throw new common_1.UnauthorizedException('Invalid PIN code.');
        }
        return this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                pinVerified: true,
                startedAt: new Date(),
                startLat: dto.startLat,
                startLng: dto.startLng,
                status: client_1.LessonStatus.IN_PROGRESS,
            },
        });
    }
    async finish(lessonId, endLat, endLng) {
        const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson)
            throw new common_1.NotFoundException('Lesson not found.');
        return this.prisma.lesson.update({
            where: { id: lessonId },
            data: {
                finishedAt: new Date(),
                endLat,
                endLng,
                status: client_1.LessonStatus.COMPLETED,
            },
        });
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map