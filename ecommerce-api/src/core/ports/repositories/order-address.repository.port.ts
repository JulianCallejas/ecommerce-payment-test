import { OrderAddress } from '../../entities/order-address.entity';

export interface OrderAddressRepositoryPort {
  findById(id: string): Promise<OrderAddress | null>;
  create(address: Partial<OrderAddress>): Promise<OrderAddress>;
}