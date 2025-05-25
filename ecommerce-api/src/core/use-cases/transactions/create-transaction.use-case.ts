import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../ports/repositories/product.repository.port';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';
import { OrderRepositoryPort } from '../../ports/repositories/order.repository.port';
import { OrderAddressRepositoryPort } from '../../ports/repositories/order-address.repository.port';
import { TransactionRepositoryPort } from '../../ports/repositories/transaction.repository.port';
import { checkOrThrowBadrequest } from 'src/core/common/check-or-throw-bad-request';
import { TransactionStatus } from 'src/core/entities/transaction.entity';
import { Product } from 'src/core/entities/product.entity';
import { Decimal } from '@prisma/client/runtime/library';


export interface CreateTransactionInput {
  orderId: string;
  totalAmount: number;
  payment: {
    cardNumber: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardholderName: string;
    acceptanceToken: string;
    acceptPersonalAuth: string;
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
    // 1. Get and validate order
    const order = await this.orderRepository.findById(input.orderId);
    checkOrThrowBadrequest(!!order, `Order ${input.orderId} not found`);

    order.transactions.forEach((transaction) => {
      checkOrThrowBadrequest(
        transaction.status === TransactionStatus.PENDING,
        `Transaction ${transaction.id} in process`
      );
    });

    console.log({order});
       
    
    // Validate amount
    const totalAmount = Number(order.unitPrice) * order.quantity + Number(order.deliveryFee);
    checkOrThrowBadrequest(totalAmount === input.totalAmount, `Invalid amount ${input.totalAmount}, price out of date`);

    // 2. Update product stock
    const updatedProduct = await this.updateProductStock(order.quantity, order.unitPrice, order.product);
    // checkOrThrowBadrequest
    
    console.log({updatedProduct});
    
    // 6. Process payment
    //TODO Payment process and generate response

    return {
      transactionId: 'asdfa-dsfds-asdfasd-sdfas',
      status: 'ACCEPTED'
    };
  }


  async updateProductStock(quantity: number, unitPrice: Decimal, product?: Product): Promise<Product> {
    checkOrThrowBadrequest(!!product, `Product ${product.id} not found`);
    try {
      this.checkProductPriceStock(quantity, unitPrice, product);
      return await this.productRepository.updateStock(product.id, -quantity, 1);
    } catch (error) {
      for (let retry = 0; retry < 10; retry++) {
        console.log("try", retry);
        const retryProduct = await this.productRepository.findById(product.id);
        this.checkProductPriceStock(quantity, unitPrice, retryProduct);
        try {
          return await this.productRepository.updateStock(retryProduct.id, -quantity, retry);
        } catch (error) {}
      }
    }
    checkOrThrowBadrequest(false, `Product ${product.id} not available`);
  }

  checkProductPriceStock(quantity: number, unitPrice: Decimal, product: Product) {
    checkOrThrowBadrequest(Number(unitPrice) === Number(product?.unitPrice), `Invalid unit price ${unitPrice}, price out of date`);
    checkOrThrowBadrequest(quantity <= product?.stock, `Not enough stock for product ${product.id}`);
  }



}
