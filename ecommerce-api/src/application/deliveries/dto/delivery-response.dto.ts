import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { CustomerResponseDto } from 'src/application/customers/dto/customer-response.dto';

export class AddressInfoDto {
  @ApiProperty({ description: 'Address line 1' })
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'Region/State' })
  region: string;

  @ApiProperty({ description: 'Country' })
  country: string;

  @ApiProperty({ description: 'Postal code' })
  postalCode: string;

  @ApiProperty({ description: 'Contact name' })
  contactName: string;

  @ApiProperty({ description: 'Phone number' })
  phoneNumber: string;
}

export class OrderInfoDto {
  @ApiProperty({ description: 'Order ID' })
  id: string;

  @ApiProperty({ description: 'Product name' })
  productName: string;

  @ApiProperty({ description: 'Quantity' })
  quantity: number;

  @ApiProperty({ description: 'Total price', type: 'number', format: 'double' })
  totalPrice: Decimal;

  @ApiProperty({ description: 'Delivery fee', type: 'number', format: 'double' })
  deliveryFee: Decimal;

  @ApiProperty({
    description: 'Customer information',
    type: CustomerResponseDto
  })
  customer: CustomerResponseDto;

  @ApiProperty({ description: 'Address information', type: AddressInfoDto })
  address: AddressInfoDto;
}

export class DeliveryResponseDto {
  @ApiProperty({ description: 'Delivery ID' })
  id: string;

  @ApiProperty({
    description: 'Delivery status',
    enum: ['PROCESSING', 'SHIPPING', 'RETURNED', 'COMPLETED', 'CANCELED']
  })
  status: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Order information', type: OrderInfoDto })
  order: OrderInfoDto;
}
