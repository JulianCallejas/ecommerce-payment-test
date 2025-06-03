import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { TransactionStatus } from 'src/core/entities/transaction.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { BadRequestException } from '@nestjs/common';
import { ProductRepositoryMock } from 'src/infrastructure/mocks/product.repository.mock';
import { OrderRepositoryMock } from 'src/infrastructure/mocks/order.repository.mock';
import { TransactionRepositoryMock } from 'src/infrastructure/mocks/transaction.repository.mock';
import { WompiGatewayServiceMock } from 'src/infrastructure/mocks/wompi-gateway.service.mock';
import { GetTransactionStatusUseCase } from './get-transaction-status.use-case';

class GetTransactionStatusUseCaseMockClass {
  checkTransactionStatus = jest.fn();
}

let getTransactionStatusUseCaseMock: GetTransactionStatusUseCaseMockClass;

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: GetTransactionStatusUseCase, useClass: GetTransactionStatusUseCaseMockClass },
        CreateTransactionUseCase,
        { provide: 'ProductRepositoryPort', useValue: ProductRepositoryMock },
        { provide: 'OrderRepositoryPort', useValue: OrderRepositoryMock },
        { provide: 'TransactionRepositoryPort', useValue: TransactionRepositoryMock },
        { provide: 'WompiGatewayServicePort', useValue: WompiGatewayServiceMock },
        { provide: 'GetTransactionStatusUseCase', useClass: GetTransactionStatusUseCaseMockClass },
      ],
    }).compile();
    useCase = module.get(CreateTransactionUseCase);
    getTransactionStatusUseCaseMock = module.get(GetTransactionStatusUseCase);

    
  });

  const input = {
    orderId: 'order-1',
    totalAmount: 15000,
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

  const mockOrder = {
    id: 'order-1',
    productId: 'prod-1',
    product: {
      id: 'prod-1',
      stock: 10,
      unitPrice: new Decimal(5000),
      version: 1
    },
    unitPrice: new Decimal(5000),
    quantity: 2,
    deliveryFee: new Decimal(5000),
    customer: {
      email: 'john@example.com',
    },
    address: {
      city: 'Bogotá',
      addressLine: 'Street 1 # 2-3'
    },
    transactions: []
  };

  it('should throw if order is not found', async () => {
    OrderRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('Order order-1 not found');
  });

  it('should return existing transaction status if one is pending', async () => {
    const pendingTransaction = { id: 'tx-1', status: TransactionStatus.PENDING };
    OrderRepositoryMock.findById.mockResolvedValue({
      ...mockOrder,
      transactions: [pendingTransaction]
    });
    getTransactionStatusUseCaseMock.checkTransactionStatus.mockResolvedValue('status-called');

    const result = await useCase.execute(input);
    expect(getTransactionStatusUseCaseMock.checkTransactionStatus).toHaveBeenCalledWith(pendingTransaction);
    expect(result).toBe('status-called');
  });

  it('should reject if amount does not match calculated', async () => {
    OrderRepositoryMock.findById.mockResolvedValue({ ...mockOrder, deliveryFee: new Decimal(1000) });

    await expect(useCase.execute(input)).rejects.toThrow('Invalid amount 15000, price out of date');
  });

  it('should reject if not enough product stock', async () => {
    const mockProduct = { ...mockOrder.product, stock: 1 };
    OrderRepositoryMock.findById.mockResolvedValue({
    ...mockOrder,
    product: mockProduct
  });
  ProductRepositoryMock.findById.mockResolvedValue(mockProduct);

    await expect(useCase.execute(input)).rejects.toThrow(`Not enough stock for product prod-1`);
  });

  it('should handle card tokenization failure and rollback stock', async () => {
    OrderRepositoryMock.findById.mockResolvedValue(mockOrder);
    ProductRepositoryMock.updateStock.mockResolvedValue(mockOrder.product);
    WompiGatewayServiceMock.tokenizeCard.mockRejectedValue(new Error('Card rejected'));

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
    expect(ProductRepositoryMock.rollbackStock).toHaveBeenCalledWith('prod-1', 2);
  });

  it('should create transaction successfully', async () => {
    const tokenResponse = { data: { id: 'card-token-123' } };
    const wompiResponse = {
      data: {
        id: 'external-id',
        status: TransactionStatus.PENDING,
        amount_in_cents: 1500000
      }
    };
    const createdTransaction = {
      id: 'tx-2',
      status: TransactionStatus.PENDING
    };

    OrderRepositoryMock.findById.mockResolvedValue(mockOrder);
    ProductRepositoryMock.updateStock.mockResolvedValue(mockOrder.product);
    WompiGatewayServiceMock.tokenizeCard.mockResolvedValue(tokenResponse);
    WompiGatewayServiceMock.createTransaction.mockResolvedValue(wompiResponse);
    WompiGatewayServiceMock.generateSignature.mockReturnValue('signed');
    TransactionRepositoryMock.create.mockResolvedValue(createdTransaction);
    getTransactionStatusUseCaseMock.checkTransactionStatus.mockResolvedValue('final-status');

    const result = await useCase.execute(input);
    expect(result).toBe('final-status');
    expect(TransactionRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({
      reference: expect.any(String),
      externalId: 'external-id',
      status: TransactionStatus.PENDING,
      amount: expect.any(Decimal)
    }));
  });
});
