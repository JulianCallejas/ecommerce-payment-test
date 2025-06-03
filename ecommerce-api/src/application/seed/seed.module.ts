/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedProductsUseCase } from 'src/core/use-cases/seed/seed-products.use-case';
import { PrismaProductRepository } from 'src/infrastructure/database/repositories/prisma-product.repository';

@Module({
  controllers: [SeedController],
  providers: [
    {
      provide: 'ProductRepositoryPort',
      useExisting: PrismaProductRepository,
    },
    SeedProductsUseCase,
  ],
})
export class SeedModule {}