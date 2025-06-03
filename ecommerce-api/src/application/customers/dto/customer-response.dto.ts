import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/core/entities/order.entity';

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

  @ApiProperty({ description: 'Customer order list', type: [Order] })
  orders?: Order[];

}