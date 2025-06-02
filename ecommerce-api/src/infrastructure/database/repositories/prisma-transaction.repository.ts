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
    try {
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
    } catch (error) {
      return null;
    }
  }

  async findAll(
    page: number,
    pageSize: number
  ): Promise<[Transaction[], number]> {
    const skip = (page - 1) * pageSize;

   try {
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
   } catch (error) {
    return [[], 0];
   }
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const createdTransaction = await this.prisma.transaction.create({
        data: transaction as Prisma.TransactionCreateInput
      });
  
      return this.parseTransactionStatus(createdTransaction);
    } catch (error) {
      return null;
    }
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
    details: any
  ): Promise<Transaction> {
    try {
      if (!uuidValidate(id)) return null;
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id },
        data: {
          status: status as string,
          details
        },
        include: {
          order: {
            select: {
              product: true,
              customer: true,
              address: true,
              quantity: true,
              productId: true,
            }
          }
        }
      });
      return this.parseTransactionStatus(updatedTransaction);
    } catch (error) {
      return null;
      
    }
  }

  parseTransactionStatus(transaction): Transaction {
    return {
      ...transaction,
      status: transaction.status as TransactionStatus
    };
  }
}
