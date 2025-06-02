import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderRepositoryPort } from 'src/core/ports/repositories/order.repository.port';
import { Order } from 'src/core/entities/order.entity';
import { validate as uuidValidate } from 'uuid';
import { OrderAddress } from 'src/core/entities/order-address.entity';
import { Customer } from 'src/core/entities/customer.entity';
import { Prisma } from '@prisma/client';
import { TransactionStatus } from 'src/core/entities/transaction.entity';

@Injectable()
export class PrismaOrderRepository implements OrderRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    try {
      if (!uuidValidate(id)) return null;
      const order = await this.prisma.order.findUnique({
        where: { id },
        select: {
          id: true,
          productId: true,
          product: true,
          quantity: true,
          unitPrice: true,
          deliveryFee: true,
          customerId: true,
          customer: true,
          addressId: true,
          address: true,
          transactions: true,
          createdAt: true,
          updatedAt: true
        }
      });
      return {
        ...order,
        transactions: order.transactions.map((transaction) => ({
          ...transaction,
          status: transaction.status as TransactionStatus
        }))
      };
    } catch (error) {
      return null;
    }
  }

  async create(order: Partial<Order>): Promise<Order> {
    try {
      return this.prisma.order.create({
        data: order as Prisma.OrderCreateInput,
        include: {
          product: true,
          customer: true,
          address: true
        }
      });
    } catch (error) {
      return null;
    }
  }

  async createAddressAndCustomerAndOrder(
    address: Partial<OrderAddress>,
    customer: Partial<Customer>,
    order: Partial<Order>
  ): Promise<Order> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const addressData = await tx.orderAddress.create({
          data: address as Prisma.OrderAddressCreateInput
        });

        let customerData = await tx.customer.findUnique({
          where: {
            customerId: customer.customerId
          }
        });

        if (!customerData) {
          customerData = await tx.customer.create({
            data: customer as Prisma.CustomerCreateInput
          });
        }

        const orderData = await tx.order.create({
          data: {
            productId: order.productId,
            quantity: order.quantity,
            unitPrice: order.unitPrice,
            deliveryFee: order.deliveryFee,
            customerId: customerData.id,
            addressId: addressData.id
          },
          include: {
            product: true,
            customer: true,
            address: true
          }
        });
        return orderData;
      });
    } catch (error) {
      return null;
    }
  }
}
