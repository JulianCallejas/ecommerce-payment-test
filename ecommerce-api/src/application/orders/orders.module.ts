import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from 'src/core/use-cases/orders/create-order.use-case';
import { PrismaOrderRepository } from 'src/infrastructure/database/repositories/prisma-order.repository';
import { PrismaProductRepository } from 'src/infrastructure/database/repositories/prisma-product.repository';

@Module({
  controllers: [OrdersController],
  providers: [
    {
      provide: 'ProductRepositoryPort',
      useExisting: PrismaProductRepository,
    },
    {
      provide: 'OrderRepositoryPort',
      useExisting: PrismaOrderRepository,
    },
    
    CreateOrderUseCase
    
  ],
})
export class OrdersModule {}