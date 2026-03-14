import { Controller, Get, Param, ParseEnumPipe } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @Roles(UserRole.ADMIN)
  @Get('role/:role')
  findByRole(@Param('role', new ParseEnumPipe(UserRole)) role: UserRole) {
    return this.usersService.listByRole(role);
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.listAll();
  }
}
