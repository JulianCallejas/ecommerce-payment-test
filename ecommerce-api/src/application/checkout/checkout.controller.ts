import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckoutResponseDto } from './dto/checkout-response.dto';
import { CheckoutDto } from './dto/chekout.dto';
import { CheckoutDataUseCase } from 'src/core/use-cases/checkout/checkout-data.use-case';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly checkoutDataUseCase: CheckoutDataUseCase,
  ) {}
  
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirm checkout information' })
  @ApiResponse({
    status: 200,
    description: 'Order data confirmed successfully',
    type: CheckoutResponseDto
  })
  async confirmOrder(
    @Body() confirmOrderDto: CheckoutDto
  ): Promise<CheckoutResponseDto> {
    const confirmationData = await this.checkoutDataUseCase.execute(
      confirmOrderDto.productId,
      confirmOrderDto.quantity
    );
    return {
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
