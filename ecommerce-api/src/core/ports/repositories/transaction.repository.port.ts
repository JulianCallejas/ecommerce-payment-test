import { Transaction, TransactionStatus } from '../../entities/transaction.entity';

export interface TransactionRepositoryPort {
  findById(id: string): Promise<Transaction | null>;
  findAll(page: number, pageSize: number): Promise<[Transaction[], number]>;
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  updateStatus(id: string, status: TransactionStatus, details: any): Promise<Transaction>;
}