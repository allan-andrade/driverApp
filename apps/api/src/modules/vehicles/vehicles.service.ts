import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

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
}
