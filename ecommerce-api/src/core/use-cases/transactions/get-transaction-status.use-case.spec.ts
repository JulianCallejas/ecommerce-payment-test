import { Test, TestingModule } from '@nestjs/testing';
import { GetTransactionStatusUseCase } from './get-transaction-status.use-case';
import { TransactionStatus } from 'src/core/entities/transaction.entity';
import { TransactionRepositoryMock } from 'src/infrastructure/mocks/transaction.repository.mock';
import { WompiGatewayServiceMock } from 'src/infrastructure/mocks/wompi-gateway.service.mock';
import { DeliveryRepositoryMock } from 'src/infrastructure/mocks/delivery.repository.mock';
import { ProductRepositoryMock } from 'src/infrastructure/mocks/product.repository.mock';
import { mockDelivery } from 'src/tests/mocks';

const transactionBase = {
  id: 'tx-id',
  amount: 100,
  createdAt: new Date(),
  orderId: 'order-id',
  order: {
    customer: { fullname: 'John Doe' },
    product: { product: 'Laptop' },
    productId: 'prod-id',
    quantity: 1,
    address: { id: 'addr-id' }
  },
  details: { some: 'details' }
};

describe('GetTransactionStatusUseCase', () => {
  let useCase: GetTransactionStatusUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTransactionStatusUseCase,
        {
          provide: 'TransactionRepositoryPort',
          useValue: TransactionRepositoryMock
        },
        {
          provide: 'WompiGatewayServicePort',
          useValue: WompiGatewayServiceMock
        },
        { provide: 'DeliveryRepositoryPort', useValue: DeliveryRepositoryMock },
        { provide: 'ProductRepositoryPort', useValue: ProductRepositoryMock }
      ]
    }).compile();

    useCase = module.get(GetTransactionStatusUseCase);

    jest.clearAllMocks();
    DeliveryRepositoryMock.create.mockResolvedValue(mockDelivery);
    let callCount = 0;
    WompiGatewayServiceMock.getTransactionStatus.mockImplementation(() => {
      callCount++;
      return Promise.resolve({
        data: { status: callCount < 10 ? 'PENDING' : 'APPROVED' }
      });
    });
  });

  it('should throw NotFoundException if transaction does not exist', async () => {
    TransactionRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrowError(
      'Transaction with id invalid-id not found'
    );
  });

  it('should return non-pending transaction immediately', async () => {
    const transaction = {
      ...transactionBase,
      status: TransactionStatus.APPROVED
    };
    TransactionRepositoryMock.findById.mockResolvedValue(transaction);

    const result = await useCase.execute(transaction.id);
    expect(result.status).toBe(TransactionStatus.APPROVED);
    expect(result.transactionId).toBe(transaction.id);
  });

  it('should process a pending transaction that gets approved', async () => {
    const transaction = {
      ...transactionBase,
      status: TransactionStatus.PENDING
    };

    const updatedTransaction = {
      ...transaction,
      status: TransactionStatus.APPROVED
    };

    TransactionRepositoryMock.findById.mockResolvedValue(transaction);
    WompiGatewayServiceMock.getTransactionStatus.mockResolvedValue({
      data: { status: 'APPROVED' }
    });
    TransactionRepositoryMock.updateStatus.mockResolvedValue(
      updatedTransaction
    );

    const result = await useCase.execute(transaction.id);

    expect(TransactionRepositoryMock.updateStatus).toHaveBeenCalledWith(
      transaction.id,
      'APPROVED',
      { status: 'APPROVED' }
    );
    expect(DeliveryRepositoryMock.create).toHaveBeenCalledWith({
      orderId: transaction.orderId
    });
    expect(result.status).toBe(TransactionStatus.APPROVED);
  });

  it('should retry and return pending if still pending after retries', async () => {
    const transaction = {
      ...transactionBase,
      status: TransactionStatus.PENDING
    };

    TransactionRepositoryMock.findById.mockResolvedValue(transaction);
    WompiGatewayServiceMock.getTransactionStatus.mockResolvedValue({
      data: { status: 'PENDING' }
    });

    const result = await useCase.execute(transaction.id);

    expect(WompiGatewayServiceMock.getTransactionStatus).toHaveBeenCalledTimes(
      10
    );
    expect(result.status).toBe(TransactionStatus.PENDING);
  });

  it('should rollback stock if transaction is declined', async () => {
    const transaction = {
      ...transactionBase,
      status: TransactionStatus.PENDING
    };

    const updatedTransaction = {
      ...transaction,
      status: TransactionStatus.DECLINED
    };

    TransactionRepositoryMock.findById.mockResolvedValue(transaction);
    WompiGatewayServiceMock.getTransactionStatus.mockResolvedValue({
      data: { status: 'DECLINED' }
    });
    TransactionRepositoryMock.updateStatus.mockResolvedValue(
      updatedTransaction
    );


    const result = await useCase.execute(transaction.id);

    expect(ProductRepositoryMock.rollbackStock).toHaveBeenCalledWith(
      'prod-id',
      1
    );
    expect(result.status).toBe(TransactionStatus.DECLINED);
  });

  it('should log an error if delivery creation fails', async () => {
    const transaction = {
      ...transactionBase,
      status: TransactionStatus.PENDING
    };

    const updatedTransaction = {
      ...transaction,
      status: TransactionStatus.APPROVED
    };

    TransactionRepositoryMock.findById.mockResolvedValue(transaction);
    WompiGatewayServiceMock.getTransactionStatus.mockResolvedValue({
      data: { status: 'APPROVED' }
    });
    TransactionRepositoryMock.updateStatus.mockResolvedValue(
      updatedTransaction
    );
    DeliveryRepositoryMock.create.mockRejectedValue(
      new Error('Delivery error')
    );

    const result = await useCase.execute(transaction.id);

    expect(result.status).toBe(TransactionStatus.APPROVED);
    expect(DeliveryRepositoryMock.create).toHaveBeenCalled();
  });

  it('should log an error if rollback stock fails', async () => {
    const transaction = {
      ...transactionBase,
      status: TransactionStatus.PENDING
    };

    const updatedTransaction = {
      ...transaction,
      status: TransactionStatus.DECLINED
    };

    TransactionRepositoryMock.findById.mockResolvedValue(transaction);
    WompiGatewayServiceMock.getTransactionStatus.mockResolvedValue({
      data: { status: 'DECLINED' }
    });
    TransactionRepositoryMock.updateStatus.mockResolvedValue(
      updatedTransaction
    );
    ProductRepositoryMock.rollbackStock.mockRejectedValue(
      new Error('Rollback error')
    );

    const result = await useCase.execute(transaction.id);

    expect(result.status).toBe(TransactionStatus.DECLINED);
    expect(ProductRepositoryMock.rollbackStock).toHaveBeenCalled();
  });
});
