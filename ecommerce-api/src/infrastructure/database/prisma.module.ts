import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaProductRepository } from './repositories/prisma-product.repository';


@Global()
@Module({
  providers: [
    PrismaService,
    PrismaProductRepository,
  ],
  exports: [
    PrismaService,
    PrismaProductRepository,
  ],
})
export class PrismaModule {}