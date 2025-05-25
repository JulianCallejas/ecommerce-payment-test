import { ApiProperty } from '@nestjs/swagger';
import { ConfirmOrderDto } from './confirm-order.dto';
import { IsNumber } from 'class-validator';

export class CreateOrderDto extends ConfirmOrderDto {
  @ApiProperty({ description: 'Total value before delivery fee' })
  @IsNumber()
  baseAmount: number;

  @ApiProperty({ description: 'Delivery fee' })
  @IsNumber()
  deliveryFee: number;
}
