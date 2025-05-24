import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../ports/repositories/product.repository.port';

@Injectable()
export class GetProductStockUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort
  ) {}
  // constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(slug: string) {
    return this.productRepository.findBySlug(slug);
  }
}
