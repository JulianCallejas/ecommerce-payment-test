import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionResponseDto {
  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Transaction status' })
  status: string;
  
  @ApiProperty({ description: 'Transaction amount', required: false, type: 'number', format: 'double' })
  amount?: Decimal;

  @ApiProperty({ description: 'Creation date', required: false })
  createdAt?: Date;

  @ApiProperty({ description: 'Order ID', required: false })
  orderId?: string;

  @ApiProperty({ description: 'Customer name', required: false })
  customerName?: string;

  @ApiProperty({ description: 'Product name', required: false })
  productName?: string;
}