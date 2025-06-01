import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CheckoutDto } from '../../checkout/dto/chekout.dto';

export class CreateOrderDto extends CheckoutDto {
  @ApiProperty({ description: 'Total value before delivery fee' })
  @IsNumber()
  baseAmount: number;

  @ApiProperty({ description: 'Delivery fee' })
  @IsNumber()
  deliveryFee: number;
}
