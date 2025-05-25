import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer ID' })
  id: string;

  @ApiProperty({ description: 'Custom customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Full name' })
  fullname: string;

  @ApiProperty({ description: 'Email address' })
  email: string;
  
  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}