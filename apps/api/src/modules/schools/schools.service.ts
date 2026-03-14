import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { LinkInstructorDto } from './dto/link-instructor.dto';
import { UpsertSchoolDto } from './dto/upsert-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  upsertByManager(managerUserId: string, dto: UpsertSchoolDto) {
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

  async linkInstructor(managerUserId: string, dto: LinkInstructorDto) {
    const school = await this.prisma.school.findUnique({ where: { managerUserId } });
    if (!school) throw new NotFoundException('School profile not found.');

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

  findMySchool(managerUserId: string) {
    return this.prisma.school.findUnique({
      where: { managerUserId },
      include: { instructorLinks: { include: { instructorProfile: true } }, vehicles: true },
    });
  }

  listAll() {
    return this.prisma.school.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
