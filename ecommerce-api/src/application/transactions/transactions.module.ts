import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { CreateTransactionUseCase } from 'src/core/use-cases/transactions/create-transaction.use-case';
import { GetAllTransactionsUseCase } from 'src/core/use-cases/transactions/get-all-transactions.use-case';
import { PrismaProductRepository } from 'src/infrastructure/database/repositories/prisma-product.repository';
import { PrismaCustomerRepository } from 'src/infrastructure/database/repositories/prisma-customer.repository';
import { PrismaOrderRepository } from 'src/infrastructure/database/repositories/prisma-order.repository';
import { PrismaOrderAddressRepository } from 'src/infrastructure/database/repositories/prisma-order-address.repository';
import { PrismaTransactionRepository } from 'src/infrastructure/database/repositories/prisma-transaction.repository';


@Module({
  controllers: [TransactionsController],
  providers: [
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
    
    CreateTransactionUseCase,
    GetAllTransactionsUseCase,
  ],
})
export class TransactionsModule {}