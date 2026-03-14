import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async candidateDashboard(userId: string) {
    const candidate = await this.prisma.candidateProfile.findUnique({ where: { userId } });
    if (!candidate) throw new NotFoundException('Candidate profile not found.');

    const [upcoming, history] = await Promise.all([
      this.prisma.booking.findMany({
        where: { candidateProfileId: candidate.id },
        orderBy: { scheduledStart: 'asc' },
        take: 5,
      }),
      this.prisma.booking.findMany({
        where: { candidateProfileId: candidate.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return { upcoming, history };
  }

  async instructorDashboard(userId: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({ where: { userId } });
    if (!instructor) throw new NotFoundException('Instructor profile not found.');

    const [agenda, bookings] = await Promise.all([
      this.prisma.availabilitySlot.findMany({ where: { instructorProfileId: instructor.id, isActive: true } }),
      this.prisma.booking.findMany({
        where: { instructorProfileId: instructor.id },
        orderBy: { scheduledStart: 'asc' },
        take: 10,
      }),
    ]);

    return { agenda, bookings };
  }

  async schoolDashboard(userId: string) {
    const school = await this.prisma.school.findUnique({ where: { managerUserId: userId } });
    if (!school) throw new NotFoundException('School not found.');

    const [instructors, bookings] = await Promise.all([
      this.prisma.instructorSchoolLink.findMany({ where: { schoolId: school.id } }),
      this.prisma.booking.findMany({ where: { schoolId: school.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);

    return { school, instructors, bookings };
  }

  async adminDashboard() {
    const [users, instructors, schools, bookings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.instructorProfile.count(),
      this.prisma.school.count(),
      this.prisma.booking.count(),
    ]);

    return { users, instructors, schools, bookings };
  }
}
