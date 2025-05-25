import { Customer } from 'src/core/entities/customer.entity';
import { OrderAddress } from 'src/core/entities/order-address.entity';

export interface TokenizeCardParams {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardholderName: string;
}

export interface CreatePaymentSourceParams {
  type: string;
  token: string;
  customerEmail: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
}

export interface CreateTransactionParams {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  installments: number;
  paymentSourceId: string;
  reference: string;
  expiresAt: string; // ISO date string
  signature: string;
  customerData: Customer;
  shippingAddress: OrderAddress;
}

export interface TokenizeCardResponse {
  status: string;
  data: TokenizeCard;
}

export interface TokenizeCard {
  id: string;
  created_at: Date;
  brand: string;
  name: string;
  last_four: string;
  bin: string;
  exp_year: string;
  exp_month: string;
  card_holder: string;
  expires_at: Date;
}

export interface PaymentSourceResponse {
  data: PaymentSourceResponseData;
}

export interface PaymentSourceResponseData {
  id: number;
  type: string;
  token: string;
  status: string;
  customer_email: string;
  public_data: PaymentSourceResponsePublicData;
}

export interface PaymentSourceResponsePublicData {
  type: string;
}
