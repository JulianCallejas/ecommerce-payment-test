/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { GetAllCustomersUseCase } from 'src/core/use-cases/customers/get-all-customers.use-case';
import { GetCustomerWithOrdersUseCase } from 'src/core/use-cases/customers/get-customer-with-orders.use-case';
import { PrismaCustomerRepository } from 'src/infrastructure/database/repositories/prisma-customer.repository';

@Module({
  controllers: [CustomersController],
  providers: [
    PrismaCustomerRepository,
    {
      provide: 'CustomerRepositoryPort',
      useExisting: PrismaCustomerRepository
    },
    GetAllCustomersUseCase,
    GetCustomerWithOrdersUseCase
  ]
})
export class CustomersModule {}
