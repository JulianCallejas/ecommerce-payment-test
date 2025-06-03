import { PrismaOrderAddressRepository } from './prisma-order-address.repository';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';

describe('PrismaOrderAddressRepository', () => {
  let repository: PrismaOrderAddressRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    repository = new PrismaOrderAddressRepository(prisma);
  });

  it('should create an order address', async () => {
    const mockAddress = { id: uuidv4(), addressLine: '123 Main St' };
    prisma.orderAddress.create.mockResolvedValueOnce(mockAddress as any);

    const result = await repository.create(mockAddress);
    expect(result).toEqual(mockAddress);
    expect(prisma.orderAddress.create).toHaveBeenCalledWith({ data: mockAddress });
  });

  it('should return null for invalid UUID on findById', async () => {
    const result = await repository.findById('not-a-uuid');
    expect(result).toBeNull();
  });

  it('should find an order address by ID', async () => {
    const id = uuidv4();
    const mockAddress = { id, addressLine: '456 Main St' };
    prisma.orderAddress.findUnique.mockResolvedValueOnce(mockAddress as any);

    const result = await repository.findById(id);
    expect(result).toEqual(mockAddress);
  });
});
