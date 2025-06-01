import { Order } from './order.entity';
import { DeliveryStatus } from '@prisma/client';


export class Delivery {
  id: string;
  orderId: string;
  order?: Order;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}