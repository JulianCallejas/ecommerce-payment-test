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
  MinLength,
  ValidateNested
} from 'class-validator';

export class ChekoutAddressDto {
  @ApiProperty({ 
    description: 'Address line 1',
    example: 'Calle 123'
  })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2', required: false })
  @IsOptional()
  @IsString()
  @MinLength(4)
  addressLine2?: string;

  @ApiProperty({ 
    description: 'Country',
    example: 'CO'
  })
  @IsOptional()
  @IsString()
  country?: string = 'CO';

  @ApiProperty({ 
    description: 'Region',
    example: 'Valle'
  })
  @IsNotEmpty()
  @IsString()
  region: string;

  @ApiProperty({ 
    description: 'City',
    example: 'Cali'
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ 
    description: 'Postal code (6 digits)',
    example: '111111'
  })
  @IsOptional()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'postalCode: Only 6 numeric digits allowed' })
  postalCode?: string;

  @ApiProperty({ 
    description: 'Contact name',
    example: 'John Snow'
  })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ description: 'Phone number (10 digits)',
    example: '3201111111'

  })
  @IsOptional()
  @Length(7, 12)
  @Matches(/^[0-9]*$/, { message: 'phoneNumber: only numbers are allowed' })
  phoneNumber: string;
}

export class CheckoutCustomerDto {
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

export class CheckoutDto {
  @ApiProperty({ description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Quantity', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Customer ID',
    type: CheckoutCustomerDto
  })
  @ValidateNested()
  @Type(() => CheckoutCustomerDto)
  customer: CheckoutCustomerDto;

  @ApiProperty({
    description: 'Shipping address',
    type: ChekoutAddressDto
  })
  @ValidateNested()
  @Type(() => ChekoutAddressDto)
  address: ChekoutAddressDto;
}
