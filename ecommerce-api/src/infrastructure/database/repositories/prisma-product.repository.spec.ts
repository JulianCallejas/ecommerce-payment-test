import { PrismaProductRepository } from './prisma-product.repository';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('PrismaProductRepository', () => {
  let repository: PrismaProductRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    repository = new PrismaProductRepository(prisma);
  });

  it('should find product by slug', async () => {
    const product = { slug: 'test' } as any;
    prisma.product.findUnique.mockResolvedValueOnce(product);
    const result = await repository.findBySlug('test');
    expect(result).toEqual(product);
  });

  it('should return null if Prisma throws in findBySlug', async () => {
    prisma.product.findUnique.mockRejectedValueOnce(new Error());
    const result = await repository.findBySlug('test');
    expect(result).toBeNull();
  });

  it('should find product by ID', async () => {
    const product = { id: uuidv4() } as any;
    prisma.product.findUnique.mockResolvedValueOnce(product);
    const result = await repository.findById(product.id);
    expect(result).toEqual(product);
  });

  it('should return null if ID is invalid in findById', async () => {
    const result = await repository.findById('invalid');
    expect(result).toBeNull();
  });

  it('should find all products with pagination', async () => {
    prisma.product.findMany.mockResolvedValueOnce([]);
    prisma.product.count.mockResolvedValueOnce(0);
    const [products, total] = await repository.findAll(1, 10);
    expect(products).toEqual([]);
    expect(total).toBe(0);
  });

  it('should create a product', async () => {
    const product = { name: 'New Product' } as any;
    prisma.product.create.mockResolvedValueOnce(product);
    const result = await repository.create(product);
    expect(result).toEqual(product);
  });

  it('should return null if create throws', async () => {
    prisma.product.create.mockRejectedValueOnce(new Error());
    const result = await repository.create({} as any);
    expect(result).toBeNull();
  });

  it('should update stock', async () => {
    const product = { id: uuidv4() } as any;
    prisma.product.update.mockResolvedValueOnce(product);
    const result = await repository.updateStock(product.id, 10, 1);
    expect(result).toEqual(product);
  });

  it('should throw error for concurrent update', async () => {
    const error: PrismaClientKnownRequestError = new PrismaClientKnownRequestError('Concurrent update detected', {
        code: 'P2025',
        clientVersion: '4.9.0',
    })
    prisma.product.update.mockRejectedValueOnce(error);

    await expect(repository.updateStock(uuidv4(), 10, 1)).rejects.toThrow(
      'Concurrent stock update detected. Please try again.'
    );
  });

  it('should rollback stock', async () => {
    const product = { id: uuidv4() } as any;
    prisma.product.update.mockResolvedValueOnce(product);
    const result = await repository.rollbackStock(product.id, 5);
    expect(result).toEqual(product);
  });

  it('should return null if rollback throws', async () => {
    prisma.product.update.mockRejectedValueOnce(new Error());
    const result = await repository.rollbackStock(uuidv4(), 5);
    expect(result).toBeNull();
  });
});
