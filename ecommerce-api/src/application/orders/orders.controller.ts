import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfirmOrderResponseDto } from './dto/confirm-order-response.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { ConfirmOrderUseCase } from 'src/core/use-cases/orders/confirm-order.use-case';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly confirmOrderUseCase: ConfirmOrderUseCase) {}

  @Post('/confirm')
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirm order data' })
  @ApiResponse({
    status: 200,
    description: 'Order data confirmed successfully',
    type: ConfirmOrderResponseDto
  })
  async createOrder(
    @Body() confirmOrderDto: ConfirmOrderDto
  ): Promise<ConfirmOrderResponseDto> {
    console.log("prueba");
    const confirmationData = await this.confirmOrderUseCase.execute(
      confirmOrderDto.productId,
      confirmOrderDto.quantity
    );
    return  {
      product: {
        id: confirmationData.product.id,
        product: confirmationData.product.product,
        images: confirmationData.product.images
      },
      quantity: confirmationData.quantity,
      baseAmount: confirmationData.baseAmount,
      deliveryFee: confirmationData.deliveryFee,
      customer: confirmOrderDto.customer,
      address: { ...confirmOrderDto.address, country: 'CO' },
      unitPrice: Number(confirmationData.unitPrice)
    };
  }
}
