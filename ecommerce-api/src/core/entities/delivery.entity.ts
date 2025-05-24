import { Order } from './order.entity';
import { OrderAddress } from './order-address.entity';
import { DeliveryStatus } from '@prisma/client';


export class Delivery {
  id: string;
  orderId: string;
  order?: Order;
  status: DeliveryStatus;
  addressId: string;
  address?: OrderAddress;
  createdAt: Date;
  updatedAt: Date;
}