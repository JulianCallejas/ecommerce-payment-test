import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../ports/repositories/product.repository.port';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(page: number, pageSize: number) {
    return this.productRepository.findAll(page, pageSize);
  }
}