import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderRepositoryPort } from 'src/core/ports/repositories/order.repository.port';
import { Order } from 'src/core/entities/order.entity';
import { validate as uuidValidate } from 'uuid';
import { OrderAddress } from 'src/core/entities/order-address.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Prisma } from '@prisma/client';

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
      data: order as Prisma.OrderCreateInput,
      include: {
        product: true,
        customer: true,
        address: true
      }
    });
  }

  async createAddressAndCustomer(address: Partial<OrderAddress>, customer: Partial<Customer>): Promise<[OrderAddress, Customer]> {
   return this.prisma.$transaction(async (tx)=>{

    const addressData = await tx.orderAddress.create({
      data: address as Prisma.OrderAddressCreateInput
    });

    const customerData = await tx.customer.create({
      data: customer as Prisma.CustomerCreateInput
    });

    return [addressData, customerData];
   }); 
    
  }

}
