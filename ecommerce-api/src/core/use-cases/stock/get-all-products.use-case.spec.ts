import { mockProducts } from 'src/tests/mocks';
import { GetAllProductsUseCase } from './get-all-products.use-case';

const mockProductRepository = {
  findAll: jest.fn()
};

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetAllProductsUseCase(mockProductRepository as any);
  });

  it('should return all products for given page and size', async () => {
    const resultData = mockProducts;
    mockProductRepository.findAll.mockResolvedValue(mockProducts);

    const result = await useCase.execute(1, 10);

    expect(result).toEqual(resultData);
    expect(mockProductRepository.findAll).toHaveBeenCalledWith(1, 10);
  });
});
