import { Delivery } from 'src/core/entities/delivery.entity';
import { DeliveryStatus } from '@prisma/client';
import { mockOrder } from './mock-orders';

export const mockDelivery: Delivery = {
  id: 'delivery-001',
  orderId: mockOrder.id,
  order: mockOrder,
  status: DeliveryStatus.PROCESSING,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockDelivery2: Delivery = {
  id: 'delivery-002',
  orderId: mockOrder.id,
  order: mockOrder,
  status: DeliveryStatus.COMPLETED,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockDeliveries: Delivery[] = [mockDelivery, mockDelivery2];
