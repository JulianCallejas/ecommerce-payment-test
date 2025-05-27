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

// Payment types
export interface PaymentData {
  cardNumber: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  installments: number;
  cardHolder: string;
  acceptanceToken?: string;
  acceptPersonalAuth?: boolean;
}

// Address types
export interface Address {
  country: string;
  addressLine1: string;
  addressLine2?: string;
  region: string;
  city: string;
  postalCode: string;
  contactName: string;
  phoneNumber: string;
}

// API response types
export interface OrderConfirmationResponse {
  product: {
    id: string;
    title: string;
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
  customer: Customer;
  address: Address;
}

export interface OrderCreateRequest {
  productId: string;
  quantity: number;
  customer: Customer;
  address: Address;
  baseAmount: number;
  deliveryFee: number;
}

export interface TransactionCreateRequest {
  orderId: string;
  totalAmount: number;
  payment: PaymentData;
}


