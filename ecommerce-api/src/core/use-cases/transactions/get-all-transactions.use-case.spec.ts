import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTransactionsUseCase } from './get-all-transactions.use-case';
import { TransactionRepositoryMock } from 'src/infrastructure/mocks/transaction.repository.mock';
import { mockTransactions } from 'src/tests/mocks';


describe('GetAllTransactionsUseCase', () => {
  let useCase: GetAllTransactionsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTransactionsUseCase,
        { provide: 'TransactionRepositoryPort', useValue: TransactionRepositoryMock },
        
      ]
    }).compile();

    useCase = module.get(GetAllTransactionsUseCase);
  });

  it('should return all transactions', async () => {
    TransactionRepositoryMock.findAll.mockResolvedValue([mockTransactions, 2]);
    const [transactions, total] = await useCase.execute(1, 10);

    expect(Array.isArray(transactions)).toBe(true);
    expect(typeof total).toBe('number');
  });
});
