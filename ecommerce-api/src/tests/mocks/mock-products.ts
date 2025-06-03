import { Product } from 'src/core/entities/product.entity';
import { Decimal } from '@prisma/client/runtime/library';

export const mockProduct: Product = {
  id: 'product-001',
  slug: 'mock-product',
  product: 'Mock Product',
  description: 'This is a mock product',
  stock: 10,
  unitPrice: new Decimal(100),
  images: ['https://example.com/image.jpg'],
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockProduct2: Product = {
  id: 'product-002',
  slug: 'mock-product',
  product: 'Mock Product',
  description: 'This is a mock product',
  stock: 1,
  unitPrice: new Decimal(100),
  images: ['https://example.com/image.jpg'],
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockProducts: Product[] = [mockProduct, mockProduct2];
