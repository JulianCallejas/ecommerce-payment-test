import {
  Transaction,
  TransactionStatus
} from 'src/core/entities/transaction.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { mockOrder, mockOrder2 } from './mock-orders';
import { Order } from 'src/core/entities/order.entity';

const transactionOrder: Order = { ...mockOrder };
const transactionOrder2: Order = { ...mockOrder2 };

export const mockTransaction: Transaction = {
  id: 'txn-001',
  reference: 'REF123',
  externalId: 'EXT456',
  orderId: transactionOrder.id,
  status: TransactionStatus.APPROVED,
  amount: new Decimal(120),
  details: { provider: 'MockPay', success: true },
  createdAt: new Date(),
  updatedAt: new Date(),
  order: transactionOrder
};

export const mockTransaction2: Transaction = {
  id: 'txn-002',
  reference: 'REF122',
  externalId: 'EXT455',
  orderId: transactionOrder2.id,
  status: TransactionStatus.APPROVED,
  amount: new Decimal(120),
  details: { provider: 'MockPay', success: true },
  createdAt: new Date(),
  updatedAt: new Date(),
  order: transactionOrder2
};

export const mockTransactions: Transaction[] = [
  mockTransaction,
  mockTransaction2
];
