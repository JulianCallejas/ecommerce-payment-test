import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { PrismaProductRepository } from '../../infrastructure/database/repositories/prisma-product.repository';
import { ConfirmOrderUseCase } from 'src/core/use-cases/orders/confirm-order.use-case';
import { CreateOrderUseCase } from 'src/core/use-cases/orders/create-order.use-case';
import { PrismaOrderRepository } from 'src/infrastructure/database/repositories/prisma-order.repository';

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
    
    ConfirmOrderUseCase,
    CreateOrderUseCase
    
  ],
})
export class OrdersModule {}