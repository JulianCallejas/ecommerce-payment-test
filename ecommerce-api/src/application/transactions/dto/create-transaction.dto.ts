import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';

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
    description: 'Expiration year',
    example: '29'
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(60)
  installments: number;

  @ApiProperty({
    description: 'Cardholder name',
    example: 'John Connor'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  cardHolder: string;

  @ApiProperty({
    description: 'Acceptance terms token',
    example: 'XXXXXXX'
  })
  @IsNotEmpty()
  @IsString()
  acceptanceToken: string;
  
  @ApiProperty({
    description: 'Acceptance personal data policy token',
    example: 'XXXXXXX'
  })
  @IsNotEmpty()
  @IsString()
  acceptPersonalAuth: string;

}

export class CreateTransactionDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ description: 'Total value including delivery fee' })
  @IsNumber()
  totalAmount: number;
  
  @ApiProperty({
    description: 'Payment information',
    type: PaymentDto
  })
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
