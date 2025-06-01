import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/core/entities/order.entity';
import { CreateOrderUseCase } from 'src/core/use-cases/orders/create-order.use-case';
import { GetOrderIdUseCase } from 'src/core/use-cases/orders/get-order-id.use-case';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderIdUseCase: GetOrderIdUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: CreateOrderDto
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.createOrderUseCase.execute(createOrderDto);
  }
  
  @Get(':orderId')
    @ApiOperation({ summary: 'Get order details' })
    @ApiResponse({
      status: 200,
      description: 'Order details',
      type: Order,
    })
    async getTransaction(
      @Param('orderId') transactionId: string,
    ): Promise<Order> {
       return await this.getOrderIdUseCase.execute(transactionId);
    }
  
}
