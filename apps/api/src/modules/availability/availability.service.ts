import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';

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
}
