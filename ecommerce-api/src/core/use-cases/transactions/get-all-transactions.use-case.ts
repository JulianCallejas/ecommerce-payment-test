import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../ports/repositories/transaction.repository.port';

@Injectable()
export class GetAllTransactionsUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepository: TransactionRepositoryPort
  ) {}

  async execute(page: number, pageSize: number) {
    return this.transactionRepository.findAll(page, pageSize);
  }
}
