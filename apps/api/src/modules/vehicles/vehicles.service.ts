import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        ...dto,
        verificationStatus: dto.verificationStatus ?? 'PENDING',
      },
    });
  }

  listByInstructor(instructorProfileId: string) {
    return this.prisma.vehicle.findMany({ where: { instructorProfileId } });
  }

  listBySchool(schoolId: string) {
    return this.prisma.vehicle.findMany({ where: { schoolId } });
  }

  private async getInstructorProfileIdByUserId(userId: string) {
    const profile = await this.prisma.instructorProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Instructor profile not found for this user.');
    }

    return profile.id;
  }

  async createForInstructor(userId: string, dto: CreateVehicleDto) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    return this.prisma.vehicle.create({
      data: {
        plate: dto.plate,
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        transmissionType: dto.transmissionType,
        categorySupported: dto.categorySupported,
        verificationStatus: dto.verificationStatus ?? 'PENDING',
        instructorProfileId,
      },
    });
  }

  async listMine(userId: string) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    return this.listByInstructor(instructorProfileId);
  }

  async updateMine(userId: string, id: string, dto: UpdateVehicleDto) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id, instructorProfileId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found for this instructor.');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        plate: dto.plate,
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        transmissionType: dto.transmissionType,
        categorySupported: dto.categorySupported,
        verificationStatus: dto.verificationStatus,
      },
    });
  }

  async removeMine(userId: string, id: string) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    const vehicle = await this.prisma.vehicle.findFirst({ where: { id, instructorProfileId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found for this instructor.');
    }

    return this.prisma.vehicle.delete({ where: { id } });
  }
}
