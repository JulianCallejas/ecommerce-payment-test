import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../ports/repositories/transaction.repository.port';
import { WompiGatewayServicePort } from 'src/core/ports/services/wompi-gateway.service.port';
import { TransactionStatus } from 'src/core/entities/transaction.entity';
import { GetTransactionStatusData } from 'src/core/ports/services/wompi-gateway.types';

@Injectable()
export class GetTransactionStatusUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepository: TransactionRepositoryPort,

    @Inject('WompiGatewayServicePort')
    private readonly wompiGatewayService: WompiGatewayServicePort
  ) {}

  async execute(transactionId: string) {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${transactionId} not found`);
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      return {
        transactionId: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        orderId: transaction.orderId,
        customerName: transaction.order?.customer?.fullname,
        productName: transaction.order?.product?.product
      }
    }

    try{
      const getTransactionStatus = await this.wompiGatewayService.getTransactionStatus(transaction);
      if (getTransactionStatus.data.status !== TransactionStatus.PENDING) {
        const updatedTransaction = await this.transactionRepository.updateStatus(transactionId, getTransactionStatus.data.status as TransactionStatus, getTransactionStatus.data as GetTransactionStatusData);
        console.log(updatedTransaction);
        return {
          transactionId: updatedTransaction.id,
          status: updatedTransaction.status,
          amount: updatedTransaction.amount,
          createdAt: updatedTransaction.createdAt,
          orderId: updatedTransaction.orderId,
          customerName: updatedTransaction.order?.customer?.fullname,
          productName: updatedTransaction.order?.product?.product
        }
      }

    }catch(error){}
    
    return {
      transactionId: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      orderId: transaction.orderId,
      customerName: transaction.order?.customer?.fullname,
      productName: transaction.order?.product?.product
    }

    

  
    
  }
}
