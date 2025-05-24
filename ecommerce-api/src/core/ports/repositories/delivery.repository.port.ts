import { Delivery } from '../../entities/delivery.entity';

export interface DeliveryRepositoryPort {
  findById(id: string): Promise<Delivery | null>;
  findAll(page: number, pageSize: number): Promise<[Delivery[], number]>;
  findByCustomerId(customerId: string): Promise<Delivery[]>;
  create(delivery: Partial<Delivery>): Promise<Delivery>;
}