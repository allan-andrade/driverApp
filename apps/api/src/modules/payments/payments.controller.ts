import { Body, Controller, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { PaymentStatus, UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreatePaymentCheckoutDto } from './dto/create-payment-checkout.dto';
import { PaymentsService } from './payments.service';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(UserRole.CANDIDATE, UserRole.INSTRUCTOR, UserRole.SCHOOL_MANAGER, UserRole.ADMIN)
  @Get('me')
  listMine(@CurrentUser() user: { userId: string; role: UserRole }) {
    return this.paymentsService.listMine(user.userId, user.role);
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  listAll() {
    return this.paymentsService.listAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
    @CurrentUser('userId') actorUserId: string,
  ) {
    if (dto.status === PaymentStatus.CAPTURED || dto.status === PaymentStatus.PAID) {
      return this.paymentsService.capture(id, actorUserId, dto.providerReference);
    }

    if (dto.status === PaymentStatus.REFUNDED) {
      return this.paymentsService.refund(id, actorUserId);
    }

    if (dto.status === PaymentStatus.CANCELLED) {
      return this.paymentsService.cancel(id, actorUserId);
    }

    return this.paymentsService.updateStatus(id, dto.status, actorUserId, dto.providerReference);
  }

  @Roles(UserRole.CANDIDATE, UserRole.ADMIN)
  @Post(':id/checkout')
  checkout(
    @Param('id') id: string,
    @Body() dto: CreatePaymentCheckoutDto,
    @CurrentUser('userId') actorUserId: string,
  ) {
    return this.paymentsService.startCheckout(id, dto, actorUserId);
  }

  @Public()
  @Post('webhooks/:provider')
  webhook(
    @Param('provider') provider: string,
    @Body() payload: Record<string, unknown>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.paymentsService.processWebhook(provider, payload, headers);
  }
}
