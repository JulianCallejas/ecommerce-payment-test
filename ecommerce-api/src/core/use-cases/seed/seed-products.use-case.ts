import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../ports/repositories/product.repository.port';
import { seedingProducts } from 'src/application/common/seeding-products';

@Injectable()
export class SeedProductsUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort
  ) { }

  async execute() {
    try {
      const existingProducts = await this.productRepository.findAll(1, 10);
      

      if (existingProducts[1] > 0) throw new Error('Products already seeded');

      const createManyProducts = seedingProducts.map(
        async (product) =>
          await this.productRepository.create({
            ...product
          })
      );

      const createdProducts = await Promise.all(createManyProducts);

      return createdProducts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
