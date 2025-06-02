import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DeliveryRepositoryPort } from 'src/core/ports/repositories/delivery.repository.port';
import { Delivery } from 'src/core/entities/delivery.entity';
import { Prisma } from '@prisma/client';
import { validate as uuidValidate } from 'uuid';
@Injectable()
export class PrismaDeliveryRepository implements DeliveryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Delivery | null> {
    try {
      if (!uuidValidate(id)) return null;
      return this.prisma.delivery.findUnique({
        where: { id },
        include: {
          order: {
            include: {
              product: true,
              customer: true,
              address: true,
            },
          },
        },
      });
    } catch (error) {
      return null;
    }
  }

  async findAll(page: number, pageSize: number): Promise<[Delivery[], number]> {
    const skip = (page - 1) * pageSize;
    
    const [deliveries, count] = await Promise.all([
      this.prisma.delivery.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              product: true,
              customer: true,
              address: true
            },
          },
        },
      }),
      this.prisma.delivery.count(),
    ]);
    return [deliveries, count];
  }

  async findByCustomerId(customerId: string): Promise<Delivery[]> {
    try {
      if (!uuidValidate(customerId)) return null;
      return this.prisma.delivery.findMany({
        where: {
          order: {
            customer: {
              id: customerId,
            },
          },
        },
        include: {
          order: {
            include: {
              product: true,
              customer: true,
              address: true
            },
          },
        },
      });
    } catch (error) {
      return null;
    }
  }

  async create(delivery: Partial<Delivery>): Promise<Delivery> {
    try {
      return this.prisma.delivery.create({
        data: delivery as Prisma.DeliveryCreateInput,
      });
    } catch (error) {
      return null;
    }
  }
}