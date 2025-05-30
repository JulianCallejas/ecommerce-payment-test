import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../ports/repositories/transaction.repository.port';
import { WompiGatewayServicePort } from 'src/core/ports/services/wompi-gateway.service.port';
import {
  Transaction,
  TransactionStatus
} from 'src/core/entities/transaction.entity';
import {
  GetTransactionStatusData,
  GetTransactionStatusResponse
} from 'src/core/ports/services/wompi-gateway.types';
import { DeliveryRepositoryPort } from 'src/core/ports/repositories/delivery.repository.port';
import { ProductRepositoryPort } from 'src/core/ports/repositories/product.repository.port';

const MAX_RETRIES = 10;

@Injectable()
export class GetTransactionStatusUseCase {
  private readonly logger = new Logger('GetTransactionStatusUseCase');

  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepository: TransactionRepositoryPort,

    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepository: DeliveryRepositoryPort,

    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,

    @Inject('WompiGatewayServicePort')
    private readonly wompiGatewayService: WompiGatewayServicePort
  ) {}

  async execute(transactionId: string) {
    const transaction =
      await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with id ${transactionId} not found`
      );
    }

    return await this.checkTransactionStatus(transaction);
  }

  async checkTransactionStatus(transaction: Transaction) {
    if (transaction.status !== TransactionStatus.PENDING) {
      return {
        transactionId: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        orderId: transaction.orderId,
        customerName: transaction.order?.customer?.fullname,
        productName: transaction.order?.product?.product
      };
    }

    let currentStatus = transaction.status;
    let retryCount = 0;
    while (
      currentStatus === TransactionStatus.PENDING &&
      retryCount < MAX_RETRIES
    ) {
      retryCount++;
      try {
        const getTransactionStatus =
          await this.wompiGatewayService.getTransactionStatus(transaction);

        // Repeat until transaction is !== PENDING
        if (getTransactionStatus.data.status === TransactionStatus.PENDING) {
          continue;
        }

        // Update transaction status to stop iterations
        currentStatus =
          TransactionStatus[getTransactionStatus.data.status as string];

        return await this.updateTransactionStatus(
          transaction.id,
          getTransactionStatus
        );
      } catch (error) {
        this.logger.error(
          `[GetTransaction] Check transaction status error ${error.message}`
        );
      }
    }

    return {
      transactionId: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      orderId: transaction.orderId,
      customerName: transaction.order?.customer?.fullname,
      productName: transaction.order?.product?.product
    };
  }

  async updateTransactionStatus(
    transactionId: string,
    newTransactionStatus: GetTransactionStatusResponse
  ) {
    try {
      const updatedTransaction = await this.transactionRepository.updateStatus(
        transactionId,
        newTransactionStatus.data.status as TransactionStatus,
        newTransactionStatus.data as GetTransactionStatusData
      );

      //Create delivery if approved or rollback stock if not approved
      if (newTransactionStatus.data.status === TransactionStatus.APPROVED) {
        await this.createDelivery(
          updatedTransaction.orderId,
          updatedTransaction.order?.address.id
        );
      } else {
        await this.rollbackStock(
          updatedTransaction.order?.productId,
          updatedTransaction.order?.quantity
        );
      }

      return {
        transactionId: updatedTransaction.id,
        status: updatedTransaction.status,
        amount: updatedTransaction.amount,
        createdAt: updatedTransaction.createdAt,
        orderId: updatedTransaction.orderId,
        customerName: updatedTransaction.order?.customer?.fullname,
        productName: updatedTransaction.order?.product?.product
      };
    } catch (error) {
      this.logger.error(
        `[Transaction] Update transaction status error ${error.message}`
      );
    }
  }

  async createDelivery(orderId: string, addressId: string) {
    try {
      await this.deliveryRepository.create({
        orderId: orderId,
        addressId: addressId
      });
    } catch (error) {
      this.logger.error(`[Delivery] Error creating delivery ${error.message}`);
    }
  }

  async rollbackStock(productId: string, quantity: number) {
    try {
      this.productRepository.rollbackStock(productId, quantity);
    } catch (error) {
      this.logger.error(`[Product] Rollback stock error ${error.message}`);
    }
  }
}
