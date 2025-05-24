import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderAddressRepositoryPort } from 'src/core/ports/repositories/order-address.repository.port';
import { OrderAddress } from 'src/core/entities/order-address.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class PrismaOrderAddressRepository
  implements OrderAddressRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<OrderAddress | null> {
    if (!uuidValidate(id)) return null;
    return this.prisma.orderAddress.findUnique({
      where: { id }
    });
  }

  async create(address: Partial<OrderAddress>): Promise<OrderAddress> {
    return this.prisma.orderAddress.create({
      data: address as any
    });
  }
}
