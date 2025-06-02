import { Order } from 'src/core/entities/order.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { mockCustomer, mockCustomer2 } from './mock-customers';
import { mockProduct, mockProduct2 } from './mock-products';
import { mockOrderAddress, mockOrderAddress2 } from './mock-order-addresses';

export const mockOrder: Order = {
  id: 'order-001',
  productId: mockProduct.id,
  quantity: 2,
  unitPrice: new Decimal(100),
  deliveryFee: new Decimal(20),
  customerId: mockCustomer.id,
  addressId: mockOrderAddress.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: mockProduct,
  customer: mockCustomer,
  address: mockOrderAddress,
  transactions: []
};

export const mockOrder2: Order = {
  id: 'order-002',
  productId: mockProduct2.id,
  quantity: 2,
  unitPrice: new Decimal(100),
  deliveryFee: new Decimal(20),
  customerId: mockCustomer2.id,
  addressId: mockOrderAddress2.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: mockProduct2,
  customer: mockCustomer2,
  address: mockOrderAddress2,
  transactions: []
};

export const mockOrders: Order[] = [mockOrder, mockOrder2];
