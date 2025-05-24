import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './application/stock/stock.module';
import { SeedModule } from './application/seed/seed.module';
import { CustomersModule } from './application/customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StockModule,
    CustomersModule,
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
