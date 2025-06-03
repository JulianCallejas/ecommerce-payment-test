/* istanbul ignore file */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaProductRepository } from './repositories/prisma-product.repository';
import { PrismaCustomerRepository } from './repositories/prisma-customer.repository';
import { PrismaOrderRepository } from './repositories/prisma-order.repository';
import { PrismaOrderAddressRepository } from './repositories/prisma-order-address.repository';
import { PrismaTransactionRepository } from './repositories/prisma-transaction.repository';
import { PrismaDeliveryRepository } from './repositories/prisma-delivery.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaProductRepository,
    PrismaCustomerRepository,
    PrismaOrderRepository,
    PrismaOrderAddressRepository,
    PrismaTransactionRepository,
    PrismaDeliveryRepository,
  ],
  exports: [
    PrismaService,
    PrismaProductRepository,
    PrismaCustomerRepository,
    PrismaOrderRepository,
    PrismaOrderAddressRepository,
    PrismaTransactionRepository,
    PrismaDeliveryRepository,
  ],
})
export class PrismaModule {}