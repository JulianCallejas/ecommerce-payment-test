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
  @ApiProperty({ description: 'Address line 1' })
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2' })
  addressLine2?: string;

  @ApiProperty({ description: 'Country' })
  country?: string;

  @ApiProperty({ description: 'Region' })
  region: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'Postal code' })
  postalCode?: string;

  @ApiProperty({ description: 'Contact name' })
  contactName?: string;

  @ApiProperty({ description: 'Phone number' })
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