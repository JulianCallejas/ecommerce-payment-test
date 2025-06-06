import type { OrderResponse, TransactionResponse, OrderConfirmationResponse } from "../../types";
import { mockProductState } from "./checkoutMockData";

const mockTransactionResponse: TransactionResponse = {
  transactionId: "txn_mock_123",
  orderId: "o1",
  status: "APPROVED",
  amount: 100,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customerName: "Mock User",
  productName: "Mock Product"
};

const mockOrderResponse: OrderResponse = {
  id: "order_123",
  status: "CREATED",
  // ... otros campos según tus tipos
} as OrderResponse;

const mockOrderConfirmationResponse: OrderConfirmationResponse = {
  product: {
    id: "prod_123",
    name: "Test Product",
    images: ["image1.jpg"]
  },
  quantity: 1,
  unitPrice: 100,
  baseAmount: 100,
  deliveryFee: 10,
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
    contactName: "John Doe",
    phoneNumber: "123456789"
  }
};

const api = {
  createTransaction: jest.fn(() => Promise.resolve(mockTransactionResponse)),
  getTransaction: jest.fn((id: string) => Promise.resolve({
    ...mockTransactionResponse,
    transactionId: id
  })),
  createOrder: jest.fn(() => Promise.resolve(mockOrderResponse)),
  confirmOrder: jest.fn(() => Promise.resolve(mockOrderConfirmationResponse)),
  getProduct: jest.fn(() => Promise.resolve(mockProductState.data)),

  // Funciones de utilidad para pruebas
  __mock: {
    setConfirmOrderResponse: (response: OrderConfirmationResponse) => {
      api.confirmOrder.mockImplementationOnce(() => Promise.resolve(response));
    },
    setConfirmOrderError: (error: Error) => {
      api.confirmOrder.mockImplementationOnce(() => Promise.reject(error));
    },
    reset: () => {
      api.createTransaction.mockReset().mockImplementation(() => Promise.resolve(mockTransactionResponse));
      api.getTransaction.mockReset().mockImplementation((id: string) => Promise.resolve({
        ...mockTransactionResponse,
        transactionId: id
      }));
      api.createOrder.mockReset().mockImplementation(() => Promise.resolve(mockOrderResponse));
      api.confirmOrder.mockReset().mockImplementation(() => Promise.resolve(mockOrderConfirmationResponse));
      api.getProduct.mockReset();
    }
  }
};

export default api;