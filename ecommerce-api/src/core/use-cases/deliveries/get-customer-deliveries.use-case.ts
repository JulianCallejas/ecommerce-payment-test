import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryRepositoryPort } from '../../ports/repositories/delivery.repository.port';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';

@Injectable()
export class GetCustomerDeliveriesUseCase {
  constructor(
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepository: DeliveryRepositoryPort,

    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort
  ) {}

  async execute(customerId: string) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    return this.deliveryRepository.findByCustomerId(customerId);
  }
}
