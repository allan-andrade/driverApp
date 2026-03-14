import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdatePayoutStatusDto } from './dto/update-payout-status.dto';
import { PayoutsService } from './payouts.service';

@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Roles(UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER)
  @Get('me')
  listMine(@CurrentUser('userId') userId: string) {
    return this.payoutsService.listMine(userId);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  listAll() {
    return this.payoutsService.listAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePayoutStatusDto) {
    return this.payoutsService.updateStatus(id, dto.status, dto.provider, dto.providerReference);
  }
}
