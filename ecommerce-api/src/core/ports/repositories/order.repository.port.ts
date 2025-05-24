import { Order } from '../../entities/order.entity';

export interface OrderRepositoryPort {
  findById(id: string): Promise<Order | null>;
  create(order: Partial<Order>): Promise<Order>;
}