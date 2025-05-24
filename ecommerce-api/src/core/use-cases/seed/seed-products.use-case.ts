import { Inject, Injectable } from '@nestjs/common';
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
      await this.productRepository.deleteMany();

      const createManyPosts = seedingProducts.map(
        async (product) =>
          await this.productRepository.create({
            ...product
          })
      );

      const createdProducts = await Promise.all(createManyPosts);

      return createdProducts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
