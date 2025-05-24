import { Customer } from '../../entities/customer.entity';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<Customer | null>;
  findByCustomerId(customerId: string): Promise<Customer | null>;
  findAll(page: number, pageSize: number): Promise<[Customer[], number]>;
  create(customer: Partial<Customer>): Promise<Customer>;
  findCustomerWithOrders(id: string): Promise<Customer | null>;
}