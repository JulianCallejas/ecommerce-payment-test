import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription(
      `
This API covers the necessary steps for a product purchase flow, from providing the data for the product details page to creating the final delivery for the order.

This is a test API and focuses solely on the purchasing process. Other aspects, such as user registration and authentication, are not covered. However, the endpoints include annotations indicating which routes would be protected (protected) and which are restricted to an admin role (protected admin).

The API is built with Nest.js, Postgres, and Prisma.

The API workflow includes:
- Fetching product data for the details page.
- Confirming checkout data.
- Creating a purchase order.
- Processing the transaction through the "Wompi" payment gateway.
- Confirming the transaction status.
- Creating the order delivery upon a successful transaction.
      `
    )
    .setVersion('1.0')
    // .addBasicAuth()
    .addTag('Stock', 'Endpoints to get products, product details, inventory and availability')
    .addTag('Checkout', 'Endpoint to get checkout data including subtotals and delivery fees')
    .addTag('Orders', 'Endpoints to create a purchase order or get order details')
    .addTag('Customers', 'Endpoints to get customers data')
    .addTag('Deliveries', 'Endpoints to get deliveries data')
    .addTag('Transactions', 'Endpoints to create transactions and get transaction details.')
    .addTag('Seed', 'Endpoint to seed products for an empty database')

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
