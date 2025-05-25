import { Product } from '../../entities/product.entity';

export interface ProductRepositoryPort {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findAll(page: number, pageSize: number): Promise<[Product[], number]>;
  create(product: Partial<Product>): Promise<Product>;
  updateStock(id: string, quantity: number, currentVersion: number): Promise<Product>;
  
}