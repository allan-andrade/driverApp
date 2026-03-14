import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateMySlotDto } from './dto/create-my-slot.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  createSlot(dto: CreateSlotDto) {
    return this.prisma.availabilitySlot.create({ data: dto });
  }

  listByInstructor(instructorProfileId: string) {
    return this.prisma.availabilitySlot.findMany({
      where: { instructorProfileId },
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
    });
  }

  private async getInstructorProfileIdByUserId(userId: string) {
    const profile = await this.prisma.instructorProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Instructor profile not found for this user.');
    }

    return profile.id;
  }

  async createMine(userId: string, dto: CreateMySlotDto) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    return this.prisma.availabilitySlot.create({ data: { ...dto, instructorProfileId } });
  }

  async listMine(userId: string) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    return this.listByInstructor(instructorProfileId);
  }

  async updateMine(userId: string, id: string, dto: UpdateSlotDto) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    const slot = await this.prisma.availabilitySlot.findFirst({ where: { id, instructorProfileId } });
    if (!slot) {
      throw new NotFoundException('Availability slot not found for this instructor.');
    }

    return this.prisma.availabilitySlot.update({ where: { id }, data: dto });
  }

  async removeMine(userId: string, id: string) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    const slot = await this.prisma.availabilitySlot.findFirst({ where: { id, instructorProfileId } });
    if (!slot) {
      throw new NotFoundException('Availability slot not found for this instructor.');
    }

    return this.prisma.availabilitySlot.delete({ where: { id } });
  }
}
