import { Controller, Get, Param, ParseEnumPipe } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.listAll();
  }

  @Roles(UserRole.ADMIN)
  @Get('role/:role')
  findByRole(@Param('role', new ParseEnumPipe(UserRole)) role: UserRole) {
    return this.usersService.listByRole(role);
  }
}
