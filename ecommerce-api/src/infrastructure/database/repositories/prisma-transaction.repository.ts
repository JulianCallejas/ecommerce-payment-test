import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionRepositoryPort } from 'src/core/ports/repositories/transaction.repository.port';
import {
  Transaction,
  TransactionStatus
} from 'src/core/entities/transaction.entity';
import { Prisma } from '@prisma/client';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Transaction | null> {
    if (!uuidValidate(id)) return null;
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            product: true,
            customer: true
          }
        }
      }
    });

    return this.parseTransactionStatus(transaction);
  }

  async findAll(
    page: number,
    pageSize: number
  ): Promise<[Transaction[], number]> {
    const skip = (page - 1) * pageSize;

    const [transactions, count] = await Promise.all([
      this.prisma.transaction.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              product: true,
              customer: true
            }
          }
        }
      }),
      this.prisma.transaction.count()
    ]);

    const mappedTransactions = transactions.map((transaction) =>
      this.parseTransactionStatus(transaction)
    );
    return [mappedTransactions, count];
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const createdTransaction = await this.prisma.transaction.create({
      data: transaction as Prisma.TransactionCreateInput
    });

    return this.parseTransactionStatus(createdTransaction);
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    details: any
  ): Promise<Transaction> {
    if (!uuidValidate(id)) return null;
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status,
        details
      }
    });

    return this.parseTransactionStatus(updatedTransaction);
  }

  parseTransactionStatus(transaction): Transaction {
    return {
      ...transaction,
      status: transaction.status as TransactionStatus
    };
  }
}
