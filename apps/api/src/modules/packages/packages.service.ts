import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateMyPackageDto } from './dto/create-my-package.dto';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePackageDto) {
    return this.prisma.package.create({ data: dto });
  }

  listByInstructor(instructorProfileId: string) {
    return this.prisma.package.findMany({ where: { instructorProfileId } });
  }

  listBySchool(schoolId: string) {
    return this.prisma.package.findMany({ where: { schoolId } });
  }

  async findOne(id: string) {
    const item = await this.prisma.package.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Package not found.');
    }

    return item;
  }

  private async getInstructorProfileIdByUserId(userId: string) {
    const profile = await this.prisma.instructorProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Instructor profile not found for this user.');
    }

    return profile.id;
  }

  async createMine(userId: string, dto: CreateMyPackageDto) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    return this.prisma.package.create({
      data: {
        ...dto,
        instructorProfileId,
      },
    });
  }

  async listMine(userId: string) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    return this.listByInstructor(instructorProfileId);
  }

  async updateMine(userId: string, id: string, dto: UpdatePackageDto) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    const item = await this.prisma.package.findFirst({ where: { id, instructorProfileId } });
    if (!item) {
      throw new NotFoundException('Package not found for this instructor.');
    }

    return this.prisma.package.update({ where: { id }, data: dto });
  }

  async removeMine(userId: string, id: string) {
    const instructorProfileId = await this.getInstructorProfileIdByUserId(userId);
    const item = await this.prisma.package.findFirst({ where: { id, instructorProfileId } });
    if (!item) {
      throw new NotFoundException('Package not found for this instructor.');
    }

    return this.prisma.package.delete({ where: { id } });
  }
}
