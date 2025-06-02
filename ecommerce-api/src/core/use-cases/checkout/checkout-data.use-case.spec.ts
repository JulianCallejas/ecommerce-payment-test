import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckoutDataUseCase } from './checkout-data.use-case';
import { ProductRepositoryPort } from 'src/core/ports/repositories/product.repository.port';
import { Decimal } from '@prisma/client/runtime/library';

describe('CheckoutDataUseCase', () => {
  let useCase: CheckoutDataUseCase;
  let productRepository: jest.Mocked<ProductRepositoryPort>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
    } as any;

    configService = {
      get: jest.fn(),
    } as any;

    useCase = new CheckoutDataUseCase(productRepository, configService);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id', 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if stock is insufficient', async () => {
    const mockProduct = {
      id: 'p1',
      product: 'Test Product',
      stock: 1,
      unitPrice: new Decimal(10),
    } as any;

    productRepository.findById.mockResolvedValue(mockProduct);

    await expect(useCase.execute('p1', 2)).rejects.toThrow(BadRequestException);
  });

  it('should return checkout data when valid product and quantity provided', async () => {
    const mockProduct = {
      id: 'p1',
      product: 'Test Product',
      stock: 10,
      unitPrice: new Decimal(20),
    } as any;

    productRepository.findById.mockResolvedValue(mockProduct);
    configService.get.mockReturnValue(15); // 15% delivery rate

    const result = await useCase.execute('p1', 3);

    expect(result).toEqual({
      product: mockProduct,
      quantity: 3,
      unitPrice: mockProduct.unitPrice,
      baseAmount: 60, // 20 * 3
      deliveryFee: 9,  // 60 * 0.15
    });

    expect(productRepository.findById).toHaveBeenCalledWith('p1');
    expect(configService.get).toHaveBeenCalledWith('DELIVERY_RATE');
  });

  it('should default to 10% delivery rate if not set in config', async () => {
    const mockProduct = {
      id: 'p1',
      product: 'Test Product',
      stock: 5,
      unitPrice: new Decimal(50),
    } as any;

    productRepository.findById.mockResolvedValue(mockProduct);
    configService.get.mockReturnValue(undefined); // simulate missing config

    const result = await useCase.execute('p1', 2);

    expect(result.deliveryFee).toBe(10);
  });
});
