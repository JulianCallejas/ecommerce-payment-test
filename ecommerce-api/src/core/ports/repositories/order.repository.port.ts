import { Order } from 'src/core/entities/order.entity';
import { OrderAddress } from 'src/core/entities/order-address.entity';
import { Customer } from 'src/core/entities/customer.entity';

export interface OrderRepositoryPort {
  findById(id: string): Promise<Order | null>;
  create(order: Partial<Order>): Promise<Order>;
  createAddressAndCustomerAndOrder(
    address: Partial<OrderAddress>,
    customer: Partial<Customer>,
    order: Partial<Order>
  ): Promise<Order>;
}
