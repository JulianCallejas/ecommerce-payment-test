/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { PrismaProductRepository } from '../../infrastructure/database/repositories/prisma-product.repository';
import { CheckoutDataUseCase } from 'src/core/use-cases/checkout/checkout-data.use-case';

@Module({
  controllers: [CheckoutController],
  providers: [
    {
      provide: 'ProductRepositoryPort',
      useExisting: PrismaProductRepository
    },

    CheckoutDataUseCase
  ]
})
export class CheckoutModule {}
