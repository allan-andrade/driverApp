import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LessonStatus } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { VerifyPinDto } from './dto/verify-pin.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  listByInstructor(instructorProfileId: string) {
    return this.prisma.lesson.findMany({ where: { instructorProfileId }, orderBy: { createdAt: 'desc' } });
  }

  async listMine(userId: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
    if (!instructor) {
      throw new NotFoundException('Instructor profile not found.');
    }

    return this.listByInstructor(instructor.id);
  }

  async checkIn(lessonId: string, dto: VerifyPinDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    if (lesson.pinCode !== dto.pinCode) {
      throw new UnauthorizedException('Invalid PIN code.');
    }

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        pinVerified: true,
        startedAt: new Date(),
        startLat: dto.startLat,
        startLng: dto.startLng,
        status: LessonStatus.IN_PROGRESS,
      },
    });
  }

  async finish(lessonId: string, endLat?: number, endLng?: number) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        finishedAt: new Date(),
        endLat,
        endLng,
        status: LessonStatus.COMPLETED,
      },
    });
  }
}
