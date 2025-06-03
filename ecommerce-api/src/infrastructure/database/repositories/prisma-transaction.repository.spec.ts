import { PrismaTransactionRepository } from './prisma-transaction.repository';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma.service';
import { TransactionStatus } from 'src/core/entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

describe('PrismaTransactionRepository', () => {
  let repository: PrismaTransactionRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    repository = new PrismaTransactionRepository(prisma);
  });

  it('should find transaction by ID', async () => {
    const tx = { id: uuidv4(), status: 'APPROVED' } as any;
    prisma.transaction.findUnique.mockResolvedValueOnce(tx);

    const result = await repository.findById(tx.id);
    expect(result.status).toBe(TransactionStatus.APPROVED);
  });

  it('should return null for invalid ID in findById', async () => {
    const result = await repository.findById('invalid');
    expect(result).toBeNull();
  });

  it('should return null if Prisma throws in findById', async () => {
    prisma.transaction.findUnique.mockRejectedValueOnce(new Error());
    const result = await repository.findById(uuidv4());
    expect(result).toBeNull();
  });

  it('should find all transactions with pagination', async () => {
    prisma.transaction.findMany.mockResolvedValueOnce([
      { status: 'PENDING' } as any
    ]);
    prisma.transaction.count.mockResolvedValueOnce(1);

    const [transactions, total] = await repository.findAll(1, 10);
    expect(transactions[0].status).toBe(TransactionStatus.PENDING);
    expect(total).toBe(1);
  });

  it('should return empty if Prisma throws in findAll', async () => {
    prisma.transaction.findMany.mockRejectedValueOnce(new Error());
    const [transactions, total] = await repository.findAll(1, 10);
    expect(transactions).toEqual([]);
    expect(total).toBe(0);
  });

  it('should create a transaction', async () => {
    const tx = { status: 'APPROVED' } as any;
    prisma.transaction.create.mockResolvedValueOnce(tx);

    const result = await repository.create(tx);
    expect(result.status).toBe(TransactionStatus.APPROVED);
  });

  it('should return null if Prisma throws in create', async () => {
    prisma.transaction.create.mockRejectedValueOnce(new Error());
    const result = await repository.create({} as any);
    expect(result).toBeNull();
  });

  it('should update status', async () => {
    const tx = { status: 'DECLINED' } as any;
    prisma.transaction.update.mockResolvedValueOnce(tx);

    const result = await repository.updateStatus(uuidv4(), TransactionStatus.DECLINED, {});
    expect(result.status).toBe(TransactionStatus.DECLINED);
  });

  it('should return null if updateStatus throws', async () => {
    prisma.transaction.update.mockRejectedValueOnce(new Error());
    const result = await repository.updateStatus(uuidv4(), TransactionStatus.APPROVED, {});
    expect(result).toBeNull();
  });

  it('should return null if updateStatus ID is invalid', async () => {
    const result = await repository.updateStatus('invalid', TransactionStatus.APPROVED, {});
    expect(result).toBeNull();
  });
});
