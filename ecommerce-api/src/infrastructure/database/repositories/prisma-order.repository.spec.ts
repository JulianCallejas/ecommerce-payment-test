import { PrismaOrderRepository } from './prisma-order.repository';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('PrismaOrderRepository', () => {
  let repository: PrismaOrderRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    repository = new PrismaOrderRepository(prisma);
  });

  it('should find an order by ID', async () => {
    const mockOrder = {
      id: uuidv4(),
      transactions: [{ status: 'APPROVED' }],
    } as any;

    prisma.order.findUnique.mockResolvedValueOnce(mockOrder);

    const result = await repository.findById(mockOrder.id);
    expect(result.transactions[0].status).toBe('APPROVED');
  });

  it('should return null if ID is invalid in findById', async () => {
    const result = await repository.findById('invalid-id');
    expect(result).toBeNull();
  });

  it('should return null if Prisma throws in findById', async () => {
    prisma.order.findUnique.mockRejectedValueOnce(new Error('fail'));
    const result = await repository.findById(uuidv4());
    expect(result).toBeNull();
  });

  it('should create an order', async () => {
    const mockOrder = { id: uuidv4() } as any;
    prisma.order.create.mockResolvedValueOnce(mockOrder);

    const result = await repository.create(mockOrder);
    expect(result).toEqual(mockOrder);
  });

  it('should return null if create throws', async () => {
    prisma.order.create.mockRejectedValueOnce(new Error('fail'));
    const result = await repository.create({} as any);
    expect(result).toBeNull();
  });

  it('should create address, customer and order in transaction', async () => {
    const mockOrder = { id: uuidv4(), productId: 'p1' } as any;
    const mockCustomer = { customerId: 'C123' } as any;
    const mockAddress = {} as any;

    prisma.$transaction.mockImplementationOnce(async (cb) => {
      return cb(prisma);
    });

    prisma.orderAddress.create.mockResolvedValueOnce({ id: 'addr1' } as any);
    prisma.customer.findUnique.mockResolvedValueOnce(null);
    prisma.customer.create.mockResolvedValueOnce({ id: 'cust1' } as any);
    prisma.order.create.mockResolvedValueOnce(mockOrder);

    const result = await repository.createAddressAndCustomerAndOrder(mockAddress, mockCustomer, mockOrder);
    expect(result).toEqual(mockOrder);
  });

  it('should return null if createAddressAndCustomerAndOrder throws', async () => {
    prisma.$transaction.mockRejectedValueOnce(new Error('fail'));
    const result = await repository.createAddressAndCustomerAndOrder({}, {}, {});
    expect(result).toBeNull();
  });
});
