import { ApiProperty } from '@nestjs/swagger';

class ProductInfoResponseDto {
  @ApiProperty({ description: 'Product ID' })
  id: string;

  @ApiProperty({ description: 'Product name' })
  product: string;

  @ApiProperty({ description: 'Images' })
  images: string[];
}

class CustomerInfoResponseDto {
  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Customer name' })
  fullname: string;

  @ApiProperty({ description: 'Email' })
  email: string;
}

class AddressInfoResponseDto {
  @ApiProperty({
    description: 'Address line 1',
    example: 'Calle 123'
  })
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2' })
  addressLine2?: string;

  @ApiProperty({
    description: 'Country',
    example: 'CO'
  })
  country?: string;

  @ApiProperty({
    description: 'Region',
    example: 'Valle'
  })
  region: string;

  @ApiProperty({
    description: 'City',
    example: 'Cali'
  })
  city: string;

  @ApiProperty({
    description: 'Postal code',
    example: '111111'
  })
  postalCode?: string;

  @ApiProperty({ description: 'Contact name' })
  contactName?: string;

  @ApiProperty({
    description: 'Phone number',
    example: '3201111111'
  })
  phoneNumber?: string;
}

export class ConfirmOrderResponseDto {
  @ApiProperty({ description: 'Product information' })
  product: ProductInfoResponseDto;

  @ApiProperty({ description: 'Quantity' })
  quantity: number;

  @ApiProperty({ description: 'Unit price' })
  unitPrice: number;

  @ApiProperty({ description: 'Total value before delivery fee' })
  baseAmount: number;

  @ApiProperty({ description: 'Delivery fee' })
  deliveryFee: number;

  @ApiProperty({ description: 'Customer information' })
  customer: CustomerInfoResponseDto;

  @ApiProperty({ description: 'Address information' })
  address: AddressInfoResponseDto;
}
