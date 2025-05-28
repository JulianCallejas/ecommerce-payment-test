// Product types
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  stock: number;
  unitPrice: number;
  images: string[];
}

// Customer types
export interface Customer {
  fullname: string;
  email: string;
  personalIdType: string;
  personalIdNumber: string;
}

export interface CustomerOrderRequest {
  fullname: string;
  email: string;
  customerId: string;
}

// Payment types
export interface PaymentData {
  cardNumber: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  installments: number;
  cardHolder: string;
  acceptanceToken?: string;
  acceptPersonalAuth?: string;
}

// Address types
export interface Address {
  country: string;
  addressLine1: string;
  addressLine2?: string;
  region: string;
  city: string;
  postalCode?: string;
  contactName?: string;
  phoneNumber: string;
}

// API response types
export interface OrderConfirmationResponse {
  product: {
    id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  unitPrice: number;
  baseAmount: number;
  deliveryFee: number;
  customer: Customer;
  address: Address;
}

export interface OrderResponse extends OrderConfirmationResponse {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface TransactionResponse {
  id: string;
  orderId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  statusMessage?: string;
}

// Request types
export interface OrderConfirmRequest {
  productId: string;
  quantity: number;
  customer: CustomerOrderRequest;
  address: Address;
}

export interface OrderCreateRequest {
  productId: string;
  quantity: number;
  customer: CustomerOrderRequest;
  address: Address;
  baseAmount: number;
  deliveryFee: number;
}

export interface TransactionCreateRequest {
  orderId: string;
  totalAmount: number;
  payment: PaymentData;
}


export interface AcceptanceTokenResponse {
  data: AcceptanceTokenData;
  meta: unknown;
}

export interface AcceptanceTokenData {
  id:                           number;
  name:                         string;
  email:                        string;
  contact_name:                 string;
  phone_number:                 string;
  active:                       boolean;
  logo_url:                     null;
  legal_name:                   string;
  legal_id_type:                string;
  legal_id:                     string;
  public_key:                   string;
  accepted_currencies:          string[];
  fraud_javascript_key:         null;
  fraud_groups:                 string[];
  accepted_payment_methods:     string[];
  payment_methods:              PaymentMethod[];
  presigned_acceptance:         Presigned;
  presigned_personal_data_auth: Presigned;
  click_to_pay_dpa_id:          null;
}

export interface PaymentMethod {
  name:               string;
  payment_processors: PaymentProcessor[];
}

export interface PaymentProcessor {
  name: string;
}

export interface Presigned {
  acceptance_token: string;
  permalink:        string;
  type:             string;
}



