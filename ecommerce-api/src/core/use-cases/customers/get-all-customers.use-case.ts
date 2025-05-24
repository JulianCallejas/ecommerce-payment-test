import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';

@Injectable()
export class GetAllCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(page: number, pageSize: number) {
    return this.customerRepository.findAll(page, pageSize);
  }
}