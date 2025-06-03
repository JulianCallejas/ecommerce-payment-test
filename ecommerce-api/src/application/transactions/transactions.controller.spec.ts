import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { CreateTransactionUseCase } from 'src/core/use-cases/transactions/create-transaction.use-case';
import { GetAllTransactionsUseCase } from 'src/core/use-cases/transactions/get-all-transactions.use-case';
import { GetTransactionStatusUseCase } from 'src/core/use-cases/transactions/get-transaction-status.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { mockTransactions } from 'src/tests/mocks';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let createTransactionUseCase: CreateTransactionUseCase;
  let getAllTransactionsUseCase: GetAllTransactionsUseCase;
  let getTransactionStatusUseCase: GetTransactionStatusUseCase;

  const mockTransaction = {
    id: 'txn1',
    status: 'APPROVED',
    amount: 10000,
    createdAt: new Date(),
    orderId: 'order1',
    order: {
      customer: { fullname: 'John Doe' },
      product: { product: 'Sneakers' },
    },
  };

  const mockTransactionDetails = {
    transactionId: 'txn-001',
    status: 'APPROVED',
    amount: 10000,
    orderId: 'order1',
    customerName: 'John Doe',
    productName: 'Sneakers',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: CreateTransactionUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetAllTransactionsUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetTransactionStatusUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    createTransactionUseCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    getAllTransactionsUseCase = module.get<GetAllTransactionsUseCase>(GetAllTransactionsUseCase);
    getTransactionStatusUseCase = module.get<GetTransactionStatusUseCase>(GetTransactionStatusUseCase);
  });

  it('should create a transaction', async () => {
    const dto: CreateTransactionDto = {
      orderId: 'order1',
      totalAmount: 10000,
      payment: {
        cardNumber: '4111111111111111',
        cvc: '123',
        expMonth: '12',
        expYear: '2025',
        installments: 1,
        cardHolder: 'John Doe',
        acceptanceToken: 'token',
        acceptPersonalAuth: 'auth'
      }      
    };

    jest.spyOn(createTransactionUseCase, 'execute').mockResolvedValue(mockTransaction as any);

    const result = await controller.createTransaction(dto);

    expect(result).toEqual(mockTransaction);
    expect(createTransactionUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should return paginated transactions', async () => {
    
    jest.spyOn(getAllTransactionsUseCase, 'execute').mockResolvedValue([mockTransactions, 2]);

    const result = await controller.getAllTransactions({ page: 1, pageSize: 10 });

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.data[0].transactionId).toBe('txn-001');
    expect(getAllTransactionsUseCase.execute).toHaveBeenCalledWith(1, 10);
  });
  
  it('should return paginated transactions without params', async () => {
    
    jest.spyOn(getAllTransactionsUseCase, 'execute').mockResolvedValue([mockTransactions, 2]);

    const result = await controller.getAllTransactions({});

    expect(result.data.length).toBe(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
    expect(result.data[0].transactionId).toBe('txn-001');
    expect(getAllTransactionsUseCase.execute).toHaveBeenCalledWith(1, 10);
  });

  it('should return transaction details by id', async () => {
    jest.spyOn(getTransactionStatusUseCase, 'execute').mockResolvedValue(mockTransactionDetails as any);

    const result = await controller.getTransaction('txn-001');

    expect(result).toEqual(mockTransactionDetails);
    expect(getTransactionStatusUseCase.execute).toHaveBeenCalledWith('txn-001');
  });
});
