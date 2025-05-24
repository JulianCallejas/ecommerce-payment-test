import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { GetAllDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-all-deliveries.use-case';
import { GetCustomerDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-customer-deliveries.use-case';
import { PrismaDeliveryRepository } from 'src/infrastructure/database/repositories/prisma-delivery.repository';
import { PrismaCustomerRepository } from 'src/infrastructure/database/repositories/prisma-customer.repository';

@Module({
  controllers: [DeliveriesController],
  providers: [
    PrismaDeliveryRepository,
    PrismaCustomerRepository,
    {
      provide: 'DeliveryRepositoryPort',
      useExisting: PrismaDeliveryRepository,
    },
    {
      provide: 'CustomerRepositoryPort',
      useExisting: PrismaCustomerRepository,
    },
    GetAllDeliveriesUseCase,
    GetCustomerDeliveriesUseCase,
  ],
})
export class DeliveriesModule {}