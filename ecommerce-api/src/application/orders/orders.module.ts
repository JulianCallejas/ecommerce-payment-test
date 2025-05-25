import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { PrismaProductRepository } from '../../infrastructure/database/repositories/prisma-product.repository';
import { ConfirmOrderUseCase } from 'src/core/use-cases/orders/confirm-order.use-case';

@Module({
  controllers: [OrdersController],
  providers: [
    {
      provide: 'ProductRepositoryPort',
      useExisting: PrismaProductRepository,
    },
    
    ConfirmOrderUseCase,
    
  ],
})
export class OrdersModule {}