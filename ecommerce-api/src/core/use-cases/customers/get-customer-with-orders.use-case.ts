import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';

@Injectable()
export class GetCustomerWithOrdersUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(customerId: string) {
    const customer = await this.customerRepository.findCustomerWithOrders(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }
    
    return customer;
  }
}