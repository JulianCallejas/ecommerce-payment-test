import {
//   CreatePaymentSourceParams,
  CreateTransactionParams,
    CreateTransactionResponse,
    GetTransactionStatusData,
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
  getTransactionStatus(transactionId: string): Promise<GetTransactionStatusData>;
  generateSignature(
    transactionId: string,
    amountInCents: number,
    currency: string,
    expiresAt: Date
  ): string;
}
