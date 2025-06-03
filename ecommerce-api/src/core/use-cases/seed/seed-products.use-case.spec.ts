import { SeedProductsUseCase } from './seed-products.use-case';
import { BadRequestException } from '@nestjs/common';
import { seedingProducts } from 'src/application/common/seeding-products';

const mockProductRepository = {
  findAll: jest.fn(),
  create: jest.fn()
};

describe('SeedProductsUseCase', () => {
  let useCase: SeedProductsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SeedProductsUseCase(mockProductRepository as any);
  });

  it('should seed products if none exist', async () => {
    mockProductRepository.findAll.mockResolvedValue([[], 0]);
    mockProductRepository.create.mockImplementation((product) => Promise.resolve({ ...product, id: 'prod-id' }));

    const result = await useCase.execute();

    expect(mockProductRepository.findAll).toHaveBeenCalled();
    expect(result.length).toBe(seedingProducts.length);
    expect(mockProductRepository.create).toHaveBeenCalledTimes(seedingProducts.length);
  });

  it('should throw if products already exist', async () => {
    mockProductRepository.findAll.mockResolvedValue([[{}], 1]);

    await expect(useCase.execute()).rejects.toThrow(BadRequestException);
    await expect(useCase.execute()).rejects.toThrow('Products already seeded');
  });

  it('should throw a BadRequestException on internal errors', async () => {
    mockProductRepository.findAll.mockRejectedValue(new Error('DB error'));

    await expect(useCase.execute()).rejects.toThrow(BadRequestException);
    await expect(useCase.execute()).rejects.toThrow('DB error');
  });
});
