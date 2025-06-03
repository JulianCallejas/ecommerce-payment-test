/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from './application/stock/stock.module';
import { SeedModule } from './application/seed/seed.module';
import { CustomersModule } from './application/customers/customers.module';
import { DeliveriesModule } from './application/deliveries/deliveries.module';
import { OrdersModule } from './application/orders/orders.module';
import { TransactionsModule } from './application/transactions/transactions.module';
import { WompiGatewayModule } from './infrastructure/wompi-gateway/wompi-gateway.module';
import { CheckoutModule } from './application/checkout/checkout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    StockModule,
    CheckoutModule,
    OrdersModule,
    CustomersModule,
    DeliveriesModule,
    TransactionsModule,
    SeedModule,
    WompiGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
