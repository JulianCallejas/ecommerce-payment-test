import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../ports/repositories/product.repository.port';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';
import { OrderRepositoryPort } from '../../ports/repositories/order.repository.port';
import { OrderAddressRepositoryPort } from '../../ports/repositories/order-address.repository.port';
import { TransactionRepositoryPort } from '../../ports/repositories/transaction.repository.port';

export interface CreateTransactionInput {
  productSlug: string;
  quantity: number;
  customer: {
    customerId: string;
    fullname: string;
    email: string;
    phone: string;
  };
  address: {
    addressLine1: string;
    addressLine2?: string;
    phoneNumber: string;
    country: string;
    region: string;
    city: string;
    postalCode?: string;
    contactName?: string;
  };
  payment: {
    cardNumber: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardholderName: string;
  };
}


@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,

    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,

    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,

    @Inject('OrderAddressRepositoryPort')
    private readonly orderAddressRepository: OrderAddressRepositoryPort,

    @Inject('TransactionRepositoryPort')
    private readonly transactionRepository: TransactionRepositoryPort
  ) {}

  async execute(input: CreateTransactionInput) {
    // 1. Find or create customer
    let customer = await this.customerRepository.findByCustomerId(
      input.customer.customerId
    );

    if (!customer) {
      customer = await this.customerRepository.create({
        customerId: input.customer.customerId,
        fullname: input.customer.fullname,
        email: input.customer.email,
      });
    }

    // 2. Find product and check stock
    const product = await this.productRepository.findBySlug(input.productSlug);
    if (!product) {
      throw new BadRequestException(
        `Product with slug ${input.productSlug} not found`
      );
    }

    if (product.stock < input.quantity) {
      throw new BadRequestException(
        `Not enough stock available. Requested: ${input.quantity}, Available: ${product.stock}`
      );
    }

    // 5. Update product stock with optimistic locking
    try {
      await this.productRepository.updateStock(
        product.id,
        -input.quantity,
        product.version
      );
    } catch (error) {
      throw new BadRequestException(
        'Product stock update failed due to concurrent updates. Please try again.'
      );
    }

    // 6. Process payment
    //TODO Payment process and generate response
    

      return {
        transactionId: 10,
        status: "ACCEPTED",
      };
   
  }
}
