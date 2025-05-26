import { Transaction } from 'src/core/entities/transaction.entity';
import {
//   CreatePaymentSourceParams,
  CreateTransactionParams,
    CreateTransactionResponse,
    GetTransactionStatusResponse,
//   PaymentSourceResponse,
  TokenizeCardParams,
  TokenizeCardResponse
} from './wompi-gateway.types';

export interface WompiGatewayServicePort {
  tokenizeCard(params: TokenizeCardParams): Promise<TokenizeCardResponse>;
//   createPaymentSource(
//     params: CreatePaymentSourceParams
//   ): Promise<PaymentSourceResponse>;
  createTransaction(params: CreateTransactionParams): Promise<CreateTransactionResponse>;
  getTransactionStatus(transaction: Transaction): Promise<GetTransactionStatusResponse>;
  generateSignature(
    transactionId: string,
    amountInCents: number,
    currency: string,
    expiresAt: Date
  ): string;
}
