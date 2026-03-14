import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateFraudSignalDto } from './dto/create-fraud-signal.dto';
import { FraudService } from './fraud.service';

@Controller('fraud')
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @Roles(UserRole.ADMIN)
  @Get('signals')
  listSignals(@Query('limit') limit?: string) {
    const parsedLimit = Number(limit ?? 300);
    return this.fraudService.listSignals(Number.isNaN(parsedLimit) ? 300 : parsedLimit);
  }

  @Roles(UserRole.ADMIN)
  @Post('signals')
  createSignal(@Body() dto: CreateFraudSignalDto) {
    return this.fraudService.createSignal(dto);
  }

  @Roles(UserRole.ADMIN)
  @Post('evaluate/payment/:paymentId')
  evaluatePayment(@Param('paymentId') paymentId: string) {
    return this.fraudService.evaluatePayment(paymentId);
  }
}
