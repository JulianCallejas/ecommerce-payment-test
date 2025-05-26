import { Decimal } from '@prisma/client/runtime/library';
import { Order } from './order.entity';

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  VOIDED = 'VOIDED',
  ERROR = 'ERROR',
}

export class Transaction {
  id: string;
  reference: string;
  externalId: string;
  orderId: string;
  order?: Order;
  status: TransactionStatus;
  amount: Decimal;
  details: any;  //Accepts JSON from external provider
  createdAt: Date;
  updatedAt: Date;
}