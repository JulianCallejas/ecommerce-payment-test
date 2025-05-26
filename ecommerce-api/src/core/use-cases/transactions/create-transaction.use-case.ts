import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../ports/repositories/product.repository.port';
import { OrderRepositoryPort } from '../../ports/repositories/order.repository.port';
import { TransactionRepositoryPort } from '../../ports/repositories/transaction.repository.port';
import { checkOrThrowBadrequest } from 'src/core/common/check-or-throw-bad-request';
import { TransactionStatus } from 'src/core/entities/transaction.entity';
import { Product } from 'src/core/entities/product.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { WompiGatewayServicePort } from 'src/core/ports/services/wompi-gateway.service.port';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionResponse, TokenizeCardResponse } from 'src/core/ports/services/wompi-gateway.types';
import { Order } from 'src/core/entities/order.entity';

export interface CreateTransactionInput {
  orderId: string;
  totalAmount: number;
  payment: {
    cardNumber: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    installments: number;
    cardHolder: string;
    acceptanceToken: string;
    acceptPersonalAuth: string;
  };
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,

    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,

    @Inject('TransactionRepositoryPort')
    private readonly transactionRepository: TransactionRepositoryPort,

    @Inject('WompiGatewayServicePort')
    private readonly wompiGatewayService: WompiGatewayServicePort
  ) {}

  async execute(input: CreateTransactionInput) {
    // 1. Get and validate order
    const order = await this.orderRepository.findById(input.orderId);
    checkOrThrowBadrequest(!!order, `Order ${input.orderId} not found`);

    order.transactions.forEach((transaction) => {
      checkOrThrowBadrequest(
        transaction.status as TransactionStatus !== TransactionStatus.PENDING,
        `Transaction ${transaction.id} in process`
      );
      checkOrThrowBadrequest(
        transaction.status as TransactionStatus !== TransactionStatus.APPROVED,
        `Order ${order.id} already paid, transaction ${transaction.id} approved`
      );
    });

    const totalAmount =
      Number(order.unitPrice) * order.quantity + Number(order.deliveryFee);
    checkOrThrowBadrequest(
      totalAmount === input.totalAmount,
      `Invalid amount ${input.totalAmount}, price out of date`
    );

    // 2. Update product stock
    await this.updateProductStock(
      order.quantity,
      order.unitPrice,
      order.product
    );
    
    // 3. Create Wompi tyransaction
    
    const cardToken = await this.generateCardToken(input, order);
    
    // Required transaction data
    const transactionId = uuidv4();
    const amountInCents = Math.round(totalAmount * 100);
    const currentDateTime = new Date();
    const currency = 'COP';
    const signatureExpireDate = new Date(
      currentDateTime.getTime() + 10 * 60 * 1000
    );
    const signature = this.wompiGatewayService.generateSignature(
      transactionId,
      amountInCents,
      currency,
      signatureExpireDate
    );

    // Generate Wompi transaction
    const wompiTransaction = await this.createWompiTransaction(
      input,
      order,
      cardToken,
      amountInCents,
      currency,
      signatureExpireDate,
      signature,
      transactionId
    );

    // Create transaction record

    const newTransaction = await this.transactionRepository.create({
        reference: transactionId,
        externalId: wompiTransaction.data.id,
        orderId: order.id,
        status: wompiTransaction.data.status,
        amount: Decimal(wompiTransaction.data.amount_in_cents / 100),
        details: wompiTransaction.data
      }
    );
    
    return {
      transactionId: newTransaction.id,
      status: newTransaction.status,
      amount: newTransaction.amount,
      createdAt: newTransaction.createdAt,
      orderId: newTransaction.orderId,
      customerName: order.customer.fullname,
      productName: order.product.product
    };
  }

  async updateProductStock(
    quantity: number,
    unitPrice: Decimal,
    product?: Product
  ): Promise<Product> {
    checkOrThrowBadrequest(!!product, `Product ${product.id} not found`);
    try {
      this.checkProductPriceStock(quantity, unitPrice, product);
      return await this.productRepository.updateStock(
        product.id,
        -quantity,
        product.version
      );
    } catch (error) {
      for (let retry = 0; retry < 10; retry++) {
        const retryProduct = await this.productRepository.findById(product.id);
        this.checkProductPriceStock(quantity, unitPrice, retryProduct);
        try {
          return await this.productRepository.updateStock(
            retryProduct.id,
            -quantity,
            retryProduct.version
          );
        } catch (error) {}
      }
    }
    checkOrThrowBadrequest(false, `Product ${product.id} not available`);
  }

  checkProductPriceStock(
    quantity: number,
    unitPrice: Decimal,
    product: Product
  ) {
    checkOrThrowBadrequest(
      Number(unitPrice) === Number(product?.unitPrice),
      `Invalid unit price ${unitPrice}, price out of date`
    );
    checkOrThrowBadrequest(
      quantity <= product?.stock,
      `Not enough stock for product ${product.id}`
    );
  }

  async generateCardToken(
    input: CreateTransactionInput,
    order: Order
  ): Promise<TokenizeCardResponse> {
    try {
      const cardToken = await this.wompiGatewayService.tokenizeCard({
        number: input.payment.cardNumber,
        cvc: input.payment.cvc,
        expMonth: input.payment.expMonth,
        expYear: input.payment.expYear,
        cardHolder: input.payment.cardHolder
      });
      
      return cardToken;
    } catch (error) {
      // Update stock
      await this.productRepository.rollbackStock(order.product.id, order.quantity);
      throw new BadRequestException('Payment rejected');
    }
  }

  async createWompiTransaction(
    input: CreateTransactionInput,
    order: Order,
    cardToken: TokenizeCardResponse,
    amountInCents: number,
    currency: string,
    signatureExpireDate: Date,
    signature: string,
    transactionId: string
  ): Promise<CreateTransactionResponse> {
    try {
      const wompiTransaction = await this.wompiGatewayService.createTransaction(
        {
          acceptanceToken: input.payment.acceptanceToken,
          amountInCents,
          currency,
          customerEmail: order.customer.email,
          token: cardToken.data.id,
          installments: input.payment.installments,
          // paymentSourceId: paymentSource.data.id,
          reference: transactionId,
          expiresAt: `${signatureExpireDate.toISOString()}`,
          signature,
          customerData: order.customer,
          shippingAddress: order.address
        }
      );

      return wompiTransaction;
    } catch (error) {
      // Update stock
      await this.productRepository.rollbackStock(order.product.id, order.quantity);
      throw new BadRequestException('Payment rejected');
    }
  }
}


// const paymentSource = await this.wompiGatewayService.createPaymentSource({
    //   type: "CARD",
    //   token: cardToken.data.id,
    //   customerEmail: order.customer.email,
    //   acceptanceToken: input.payment.acceptanceToken,
    //   acceptPersonalAuth: input.payment.acceptPersonalAuth,
    // });