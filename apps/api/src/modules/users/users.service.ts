import { Injectable } from '@nestjs/common';
import { Prisma, User, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  updateRefreshToken(userId: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash } });
  }

  listAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  listByRole(role: UserRole) {
    return this.prisma.user.findMany({ where: { role }, orderBy: { createdAt: 'desc' } });
  }
}
