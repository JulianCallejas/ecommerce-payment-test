import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderRepositoryPort } from 'src/core/ports/repositories/order.repository.port';
import { ProductRepositoryPort } from 'src/core/ports/repositories/product.repository.port';
import { checkOrThrowBadrequest } from '../../common/check-or-throw-bad-request';

export interface CreateOrderInput {
  productId: string;
  quantity: number;
  baseAmount: number;
  deliveryFee: number;
  customer: {
    customerId: string;
    fullname: string;
    email: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    phoneNumber?: string;
    country?: string;
    region: string;
    city: string;
    postalCode?: string;
    contactName?: string;
  };
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly configService: ConfigService,

    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,

    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort
  ) {}

  async execute(createOrderInput: CreateOrderInput) {
    const product = await this.productRepository.findById(
      createOrderInput.productId
    );
    checkOrThrowBadrequest(
      !!product,
      `Invalid product id ${createOrderInput.productId}`
    );
    checkOrThrowBadrequest(
      product.stock >= createOrderInput.quantity,
      `Not enough stock for product ${createOrderInput.productId}`
    );

    const baseAmount = Number(product.unitPrice) * createOrderInput.quantity;
    checkOrThrowBadrequest(
      baseAmount === createOrderInput.baseAmount,
      `Invalid base amount ${createOrderInput.baseAmount}, price out of date`
    );

    const deliveryFee =
      baseAmount *
      ((this.configService.get<number>('DELIVERY_RATE') || 10) / 100);
    checkOrThrowBadrequest(
      deliveryFee === createOrderInput.deliveryFee,
      `Invalid delivery fee ${createOrderInput.deliveryFee}, delivery fee out of date`
    );

    const newOrder =
      await this.orderRepository.createAddressAndCustomerAndOrder(
        createOrderInput.address,
        createOrderInput.customer,
        {
          productId: product.id,
          quantity: createOrderInput.quantity,
          unitPrice: Decimal(product.unitPrice),
          deliveryFee: Decimal(deliveryFee)
        }
      );
    
    return newOrder;
  }

  
}
