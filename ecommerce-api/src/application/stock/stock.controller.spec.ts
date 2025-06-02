import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { GetProductStockUseCase } from 'src/core/use-cases/stock/get-product-stock.use-case';
import { GetAllProductsUseCase } from 'src/core/use-cases/stock/get-all-products.use-case';
import { ProductResponseDto } from './dto/product-response.dto';
import { mockProduct, mockProducts } from 'src/tests/mocks';

describe('StockController', () => {
  let controller: StockController;
  let getProductStockUseCase: GetProductStockUseCase;
  let getAllProductsUseCase: GetAllProductsUseCase;

  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        {
          provide: GetProductStockUseCase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: GetAllProductsUseCase,
          useValue: { execute: jest.fn() }
        }
      ]
    }).compile();

    controller = module.get<StockController>(StockController);
    getProductStockUseCase = module.get<GetProductStockUseCase>(GetProductStockUseCase);
    getAllProductsUseCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
  });

  it('should return product by slug', async () => {
    jest.spyOn(getProductStockUseCase, 'execute').mockResolvedValue(mockProduct as any);

    const result = await controller.getProductBySlug('shoes');

    expect(result).toEqual(ProductResponseDto.fromEntity(mockProduct as any));
    expect(getProductStockUseCase.execute).toHaveBeenCalledWith('shoes');
  });

  it('should return paginated products', async () => {
    
    jest.spyOn(getAllProductsUseCase, 'execute').mockResolvedValue([mockProducts, 2]);

    const result = await controller.getAllProducts({ page: 1, pageSize: 10 });

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(2);
    expect(getAllProductsUseCase.execute).toHaveBeenCalledWith(1, 10);
  });
});
