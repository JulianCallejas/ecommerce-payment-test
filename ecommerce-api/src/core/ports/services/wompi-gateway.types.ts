import { Customer } from 'src/core/entities/customer.entity';
import { OrderAddress } from 'src/core/entities/order-address.entity';
import { TransactionStatus } from 'src/core/entities/transaction.entity';

export interface TokenizeCardParams {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface CreatePaymentSourceParams {
  type: string;
  token: string;
  customerEmail: string;
  acceptanceToken: string;
  acceptPersonalAuth: string;
}

export interface CreateTransactionParams {
  acceptanceToken: string;
  amountInCents: number;
  currency: string;
  customerEmail: string;
  token: string;
  installments: number;
  paymentSourceId?: number;
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

export interface CreateTransactionResponse {
  data: CreateTransactionResponseData;
  meta: any;
}
export interface CreateTransactionResponseData {
  id: string;
  created_at: string;
  finalized_at: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  payment_method?: any;
  status: TransactionStatus;
  status_message: string;
  billing_data: any;
  shipping_address: any;
  redirect_url: string;
  payment_source_id: number;
  payment_link_id: string;
  customer_data: any;
  bill_id: string;
  taxes: any;
  tip_in_cents: number;
}


export interface GetTransactionStatusResponse {
    data: GetTransactionStatusData;
    meta: any;
}

export interface GetTransactionStatusData {
    id:                  string;
    created_at:          Date;
    finalized_at:        Date;
    amount_in_cents:     number;
    reference:           string;
    currency:            string;
    payment_method_type: string;
    payment_method:      GetTransactionStatusPaymentMethod;
    payment_link_id:     null;
    redirect_url:        null;
    status:              string;
    status_message:      null;
    merchant:            GetTransactionStatusMerchant;
    taxes:               any[];
    tip_in_cents:        null;
}

export interface GetTransactionStatusMerchant {
    id:            number;
    name:          string;
    legal_name:    string;
    contact_name:  string;
    phone_number:  string;
    logo_url:      null;
    legal_id_type: string;
    email:         string;
    legal_id:      string;
    public_key:    string;
}

export interface GetTransactionStatusPaymentMethod {
    type:         string;
    extra:        GetTransactionStatusExtra;
    installments: number;
}

export interface GetTransactionStatusExtra {
    name:                    string;
    brand:                   string;
    card_type:               string;
    last_four:               string;
    is_three_ds:             boolean;
    three_ds_auth:           ExtraThreeDsAuth;
    three_ds_auth_type:      null;
    external_identifier:     string;
    processor_response_code: string;
}

export interface ExtraThreeDsAuth {
    three_ds_auth: ThreeDsAuthThreeDsAuth;
}

export interface ThreeDsAuthThreeDsAuth {
    current_step:        string;
    current_step_status: string;
}

