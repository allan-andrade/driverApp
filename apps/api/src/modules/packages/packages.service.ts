import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';

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
}
