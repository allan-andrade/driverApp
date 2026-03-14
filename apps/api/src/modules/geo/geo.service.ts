import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateLessonLocationEventDto } from './dto/create-lesson-location-event.dto';

@Injectable()
export class GeoService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertLessonAccess(lessonId: string, userId: string, role: UserRole) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { booking: { select: { schoolId: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found.');
    }

    if (role === UserRole.ADMIN) {
      return lesson;
    }

    if (role === UserRole.CANDIDATE) {
      const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
      if (!candidate || candidate.id !== lesson.candidateProfileId) {
        throw new UnauthorizedException('You are not allowed to access this lesson location.');
      }
      return lesson;
    }

    if (role === UserRole.INSTRUCTOR) {
      const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
      if (!instructor || instructor.id !== lesson.instructorProfileId) {
        throw new UnauthorizedException('You are not allowed to access this lesson location.');
      }
      return lesson;
    }

    const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
    if (!school || school.id !== lesson.booking.schoolId) {
      throw new UnauthorizedException('You are not allowed to access this lesson location.');
    }

    return lesson;
  }

  async createEvent(lessonId: string, dto: CreateLessonLocationEventDto, userId: string, role: UserRole) {
    await this.assertLessonAccess(lessonId, userId, role);

    return this.prisma.lessonLocationEvent.create({
      data: {
        lessonId,
        eventType: dto.eventType,
        lat: dto.lat,
        lng: dto.lng,
        accuracy: dto.accuracy,
        address: dto.address,
      },
    });
  }

  async listEvents(lessonId: string, userId: string, role: UserRole) {
    await this.assertLessonAccess(lessonId, userId, role);

    return this.prisma.lessonLocationEvent.findMany({
      where: { lessonId },
      orderBy: { recordedAt: 'asc' },
      take: 1000,
    });
  }
}
