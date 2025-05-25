import {
  CreatePaymentSourceParams,
  CreateTransactionParams,
  PaymentSourceResponse,
  TokenizeCardParams,
  TokenizeCardResponse
} from './wompi-gateway.types';

export interface PaymentGatewayServicePort {
  tokenizeCard(params: TokenizeCardParams): Promise<TokenizeCardResponse>;
  createPaymentSource(
    params: CreatePaymentSourceParams
  ): Promise<PaymentSourceResponse>;
  createTransaction(params: CreateTransactionParams): Promise<string>;
  getTransactionStatus(transactionId: string): Promise<{ status: string }>;
  generateSignature(
    transactionId: string,
    amountInCents: number,
    currency: string,
    expiresAt: string
  ): string;
}
