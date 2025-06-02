import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from 'src/core/ports/repositories/customer.repository.port';
import { PrismaService } from '../prisma.service';
import { Customer } from 'src/core/entities/customer.entity';
import { Prisma } from '@prisma/client';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class PrismaCustomerRepository implements CustomerRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Customer | null> {
    try {
      if (!uuidValidate(id)) return null;
      return this.prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              product: true,
              address: true,
              transactions: true
            }
          }
        }
      });
    } catch (error) {
      return null;
    }
  }

  async findByCustomerId(customerId: string): Promise<Customer | null> {
    try {
      return this.prisma.customer.findUnique({
        where: { customerId }
      });
    } catch (error) {
      return null;
    }
  }

  async findAll(page: number, pageSize: number): Promise<[Customer[], number]> {
    const skip = (page - 1) * pageSize;

    const [customers, count] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.customer.count()
    ]);

    return [customers, count];
  }

  async create(customer: Partial<Customer>): Promise<Customer> {
    try {
      return this.prisma.customer.create({
        data: customer as Prisma.CustomerCreateInput
      });
    } catch (error) {
      return null;
    }
  }

  async findCustomerWithOrders(id: string): Promise<Customer | null> {
    try {
      if (!uuidValidate(id)) return null;
      return this.prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              product: true,
              address: true,
              transactions: true
            }
          }
        }
      });
    } catch (error) {
      return null;
    }
  }
}
