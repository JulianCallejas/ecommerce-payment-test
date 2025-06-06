import type { RootState } from "../../store";


export const mockCheckoutState: RootState['checkout'] = {
  productId: "prod_123",
  quantity: 1,
  customer: {
    fullname: "John Doe",
    email: "john@example.com",
    personalIdType: "CC",
    personalIdNumber: "123456789"
  },
  address: {
    country: "ES",
    addressLine1: "Calle Principal 123",
    region: "Madrid",
    city: "Madrid",
    postalCode: "28001",
    phoneNumber: "123456789"
  },
  paymentData: {
    cardNumber: "4111111111111111",
    cvc: "123",
    expMonth: "12",
    expYear: "25",
    installments: 3,
    cardHolder: "John Doe"
  },
  termsAccepted: "token_terms",
  privacyAccepted: "token_privacy",
  _persist: {
    version: 1,
    rehydrated: true
  }
};

export const mockCheckoutIncompleteState: RootState['checkout'] = {
  productId: "prod_123",
  quantity: 1,
  customer: {
    fullname: "John Doe",
    email: "",
    personalIdType: "CC",
    personalIdNumber: "123456789"
  },
  address: {
    country: "ES",
    addressLine1: "Calle Principal 123",
    region: "Madrid",
    city: "Madrid",
    postalCode: "28001",
    phoneNumber: "123456789"
  },
  paymentData: {
    cardNumber: "4111111111111111",
    cvc: "123",
    expMonth: "12",
    expYear: "25",
    installments: 3,
    cardHolder: "John Doe"
  },
  termsAccepted: "token_terms",
  privacyAccepted: "token_privacy",
  _persist: {
    version: 1,
    rehydrated: true
  }
};

export const mockCheckoutStateIncomplete = {
  ...mockCheckoutState,
  paymentData: null,
  address: null
};

export const mockOrderConfirmRequest = {
  productId: "prod_123",
  quantity: 1,
  customer: {
    fullname: "John Doe",
    email: "john@example.com",
    customerId: "CC123456789"
  },
  address: {
    country: "ES",
    addressLine1: "Calle Principal 123",
    region: "Madrid",
    city: "Madrid",
    postalCode: "28001",
    phoneNumber: "123456789"
  }
};

export const mockProductState: RootState['product'] = {
  data: {
    id: "p1",
    name: 'Test Product',
    unitPrice: 100,
    stock: 5,
    images: ['image1.jpg', 'image2.jpg'],
    description: 'This is a test product.',
    slug: 'test-product',
  },
  error: "",
  loading: false

}