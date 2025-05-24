import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderRepositoryPort } from 'src/core/ports/repositories/order.repository.port';
import { Order } from 'src/core/entities/order.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class PrismaOrderRepository implements OrderRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    if (!uuidValidate(id)) return null;
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
        customer: true,
        address: true
      }
    });
  }

  async create(order: Partial<Order>): Promise<Order> {
    return this.prisma.order.create({
      data: order as any
    });
  }
}
