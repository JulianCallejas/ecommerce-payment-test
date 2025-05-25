import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
  ValidateNested
} from 'class-validator';

export class OrderAddressDto {
  @ApiProperty({ description: 'Address line 1' })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string = 'CO';

  @ApiProperty({ description: 'Region' })
  @IsNotEmpty()
  @IsString()
  region: string;

  @ApiProperty({ description: 'City' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Postal code (6 digits)' })
  @IsOptional()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'postalCode: Only 6 numeric digits allowed' })
  postalCode?: string;

  @ApiProperty({ description: 'Contact name' })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ description: 'Phone number (10 digits)' })
  @IsOptional()
  @Length(10, 10)
  @Matches(/^\d{10}$/, { message: 'phoneNumber: Phone numeric number must be 10 digits' })
  phoneNumber: string;
}

export class OrderCustomerDto {
  @ApiProperty({
    description: 'Customer ID in the format ${legal_id_type}${legal_id}',
    example: 'CC123456789'
  })
  @IsNotEmpty()
  @Matches(/^(CC|CE|PA)[a-zA-Z0-9]{5,10}$/, { message: 'Customer ID must be between 5 and 10 characters and start with CC, CE or PA' })
  customerId: string;

  @ApiProperty({
    description: 'Full name (at least 2 words, each with 2+ characters)',
    example: 'John Snow'
  })
  @IsNotEmpty()
  @Matches(/^[A-Za-z]{2,} [A-Za-z]{2,}/, { message: 'Full name must be at least 2 words, each with 2+ characters' })
  fullname: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.snow@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
}

export class ConfirmOrderDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Customer ID',
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
}
