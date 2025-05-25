import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
  ValidateNested
} from 'class-validator';
import {
  OrderAddressDto,
  OrderCustomerDto
} from 'src/application/orders/dto/confirm-order.dto';

export class PaymentDto {
  @ApiProperty({
    description: 'Card number',
    example: '4111111111111111'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{16}$/, { message: 'cardNumber must be 16 digits' })
  cardNumber: string;

  @ApiProperty({
    description: 'CVC code',
    example: '123'
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 4)
  cvc: string;

  @ApiProperty({
    description: 'Expiration month',
    example: '11'
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  expMonth: string;

  @ApiProperty({
    description: 'Expiration year',
    example: '29'
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  expYear: string;

  @ApiProperty({
    description: 'Cardholder name',
    example: 'John Doe'
  })
  @IsNotEmpty()
  @IsString()
  cardholderName: string;
}

export class CreateTransactionDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity (minimum 1)',
    example: 1
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Total value before delivery fee' })
  baseAmount: number;

  @ApiProperty({ description: 'Delivery fee' })
  deliveryFee: number;

  @ApiProperty({
    description: 'Customer information',
    type: OrderCustomerDto
  })
  @ValidateNested()
  @Type(() => OrderCustomerDto)
  customer: OrderCustomerDto;

  @ApiProperty({
    description: 'Shipping address',
    type: OrderAddressDto
  })
  @ValidateNested()
  @Type(() => OrderAddressDto)
  address: OrderAddressDto;

  @ApiProperty({
    description: 'Payment information',
    type: PaymentDto
  })
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
