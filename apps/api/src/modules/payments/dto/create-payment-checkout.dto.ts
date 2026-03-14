import { PaymentMethod } from '@prisma/client';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

export class CreatePaymentCheckoutDto {
  @IsIn(['stripe', 'pagarme', 'asaas'])
  provider!: 'stripe' | 'pagarme' | 'asaas';

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsOptional()
  @IsString()
  returnUrl?: string;
}
