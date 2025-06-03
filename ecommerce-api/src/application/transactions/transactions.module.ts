/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { CreateTransactionUseCase } from 'src/core/use-cases/transactions/create-transaction.use-case';
import { GetAllTransactionsUseCase } from 'src/core/use-cases/transactions/get-all-transactions.use-case';
import { PrismaProductRepository } from 'src/infrastructure/database/repositories/prisma-product.repository';
import { PrismaCustomerRepository } from 'src/infrastructure/database/repositories/prisma-customer.repository';
import { PrismaOrderRepository } from 'src/infrastructure/database/repositories/prisma-order.repository';
import { PrismaOrderAddressRepository } from 'src/infrastructure/database/repositories/prisma-order-address.repository';
import { PrismaTransactionRepository } from 'src/infrastructure/database/repositories/prisma-transaction.repository';
import { WompiGatewayService } from 'src/infrastructure/wompi-gateway/wompi-gateway.service';
import { HttpModule } from '@nestjs/axios';
import { GetTransactionStatusUseCase } from 'src/core/use-cases/transactions/get-transaction-status.use-case';
import { PrismaDeliveryRepository } from 'src/infrastructure/database/repositories/prisma-delivery.repository';


@Module({
  imports: [HttpModule],
  controllers: [TransactionsController],
  providers: [
    WompiGatewayService,
    {
      provide: 'ProductRepositoryPort',
      useExisting: PrismaProductRepository,
    },
    {
      provide: 'CustomerRepositoryPort',
      useExisting: PrismaCustomerRepository,
    },
    {
      provide: 'OrderRepositoryPort',
      useExisting: PrismaOrderRepository,
    },
    {
      provide: 'OrderAddressRepositoryPort',
      useExisting: PrismaOrderAddressRepository,
    },
    {
      provide: 'TransactionRepositoryPort',
      useExisting: PrismaTransactionRepository,
    },
    {
      provide: 'DeliveryRepositoryPort',
      useExisting: PrismaDeliveryRepository,
    },
    {
      provide: 'WompiGatewayServicePort',
      useExisting: WompiGatewayService,
    },
    
    CreateTransactionUseCase,
    GetAllTransactionsUseCase,
    GetTransactionStatusUseCase,
  ],
})
export class TransactionsModule {}