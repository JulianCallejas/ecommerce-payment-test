import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from './seed.controller';
import { SeedProductsUseCase } from 'src/core/use-cases/seed/seed-products.use-case';

describe('SeedController', () => {
  let controller: SeedController;
  let seedProductsUseCase: SeedProductsUseCase;

  const mockProducts = [
    { id: 'p1', product: 'Shirt', images: [], stock: 10 },
    { id: 'p2', product: 'Pants', images: [], stock: 5 }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [
        {
          provide: SeedProductsUseCase,
          useValue: { execute: jest.fn() }
        }
      ]
    }).compile();

    controller = module.get<SeedController>(SeedController);
    seedProductsUseCase = module.get<SeedProductsUseCase>(SeedProductsUseCase);
  });

  it('should seed products and return mapped DTOs', async () => {
    jest.spyOn(seedProductsUseCase, 'execute').mockResolvedValue(mockProducts as any);

    const result = await controller.seedProducts();

    expect(result.length).toBe(2);
    expect(seedProductsUseCase.execute).toHaveBeenCalled();
  });
});
