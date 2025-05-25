import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ProductRepositoryPort } from 'src/core/ports/repositories/product.repository.port';

@Injectable()
export class ConfirmOrderUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
    private readonly configService: ConfigService
  ) {}

  async execute(productId: string, quantity: number) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    if (product.stock < quantity) {
      throw new BadRequestException(
        `Not enough stock for product ${productId}`
      );
    }

    return {
      product,
      quantity,
      unitPrice: product.unitPrice,
      baseAmount: Number(product.unitPrice) * quantity,
      deliveryFee:
        Number(product.unitPrice) * quantity *
        ((this.configService.get<number>('DELIVERY_RATE') || 10) / 100)
    };
  }
}
