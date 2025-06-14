import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductRepositoryPort } from 'src/core/ports/repositories/product.repository.port';
import { Product } from 'src/core/entities/product.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class PrismaProductRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string): Promise<Product | null> {
    try {
      return await this.prisma.product.findUnique({
        where: { slug }
      });
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      if (!uuidValidate(id)) return null;
      return await this.prisma.product.findUnique({
        where: { id }
      });
    } catch (error) {
      return null;
    }
  }

  async findAll(page: number, pageSize: number): Promise<[Product[], number]> {
    const skip = (page - 1) * pageSize;

    const [products, count] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count()
    ]);

    return [products, count];
  }

  async create(product: Partial<Product>): Promise<Product> {
    try {
      return await this.prisma.product.create({
        data: product as any
      });
    } catch (error) {
      return null;
    }
  }

  async updateStock(
    id: string,
    quantity: number,
    currentVersion: number
  ): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: {
          id,
          version: currentVersion
        },
        data: {
          stock: {
            increment: quantity
          },
          version: {
            increment: 1
          }
        }
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error('Concurrent stock update detected. Please try again.');
      }
      throw error;
    }
  }
  async rollbackStock(id: string, quantity: number): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: {
          id
        },
        data: {
          stock: {
            increment: quantity
          },
          version: {
            increment: 1
          }
        }
      });
    } catch (error) {
      return null;
    }
  }
}
