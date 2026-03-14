import { Controller, Get } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { WalletsService } from './wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me')
  getMine(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.walletsService.getMyWallet(user.userId, user.role);
  }

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me/transactions')
  getMyTransactions(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.walletsService.getMyTransactions(user.userId, user.role);
  }
}
