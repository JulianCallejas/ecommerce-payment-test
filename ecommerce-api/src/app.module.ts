import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './application/stock/stock.module';
import { SeedModule } from './application/seed/seed.module';
import { CustomersModule } from './application/customers/customers.module';
import { DeliveriesModule } from './application/deliveries/deliveries.module';
import { OrdersModule } from './application/orders/orders.module';
import { TransactionsModule } from './application/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StockModule,
    OrdersModule,
    CustomersModule,
    DeliveriesModule,
    TransactionsModule,
    SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
