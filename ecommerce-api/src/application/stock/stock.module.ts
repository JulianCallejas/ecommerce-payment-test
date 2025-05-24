import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { GetProductStockUseCase } from 'src/core/use-cases/stock/get-product-stock.use-case';
import { GetAllProductsUseCase } from 'src/core/use-cases/stock/get-all-products.use-case';
import { PrismaProductRepository } from 'src/infrastructure/database/repositories/prisma-product.repository';

@Module({
  controllers: [StockController],
  providers: [
    {
      provide: 'ProductRepositoryPort',
      useExisting: PrismaProductRepository,
    },
    GetProductStockUseCase,
    GetAllProductsUseCase,
  ],
})
export class StockModule {}