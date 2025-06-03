import { mockProduct } from 'src/tests/mocks';
import { GetProductStockUseCase } from './get-product-stock.use-case';

const mockProductRepository = {
  findBySlug: jest.fn()
};

describe('GetProductStockUseCase', () => {
  let useCase: GetProductStockUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetProductStockUseCase(mockProductRepository as any);
  });

  it('should return product when found by slug', async () => {
    mockProductRepository.findBySlug.mockResolvedValue(mockProduct);

    const result = await useCase.execute(mockProduct.slug);

    expect(result).toEqual(mockProduct);
    expect(mockProductRepository.findBySlug).toHaveBeenCalledWith(mockProduct.slug);
  });

  it('should return null if product not found', async () => {
    mockProductRepository.findBySlug.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-slug');

    expect(result).toBeNull();
  });
});
