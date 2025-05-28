import axios from "axios";
import type { OrderConfirmationResponse, OrderConfirmRequest, OrderCreateRequest, OrderResponse, Product } from "../types";

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// API service for the e-commerce application
export const apiService = {
  getProduct: async (slug: string): Promise<Product> => {
    const response = await api.get<Product>(`/stock/products/${slug}`);
    return response.data;
  },
 
  confirmOrder: async (data: OrderConfirmRequest): Promise<OrderConfirmationResponse> => {
    const response = await api.post<OrderConfirmationResponse>('/orders/confirm', data);
    return response.data;
  },

  createOrder: async (data: OrderCreateRequest): Promise<OrderResponse> => {
    const response = await api.post<OrderResponse>('/orders', data);
    return response.data;
  },

};

export default apiService;
