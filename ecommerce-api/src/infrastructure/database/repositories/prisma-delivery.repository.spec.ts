import { PrismaDeliveryRepository } from './prisma-delivery.repository';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';

describe('PrismaDeliveryRepository', () => {
  let repository: PrismaDeliveryRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    repository = new PrismaDeliveryRepository(prisma);
  });

  it('should create a delivery', async () => {
    const mockDelivery = { id: uuidv4(), orderId: uuidv4() };
    prisma.delivery.create.mockResolvedValueOnce(mockDelivery as any);

    const result = await repository.create(mockDelivery);
    expect(result).toEqual(mockDelivery);
    expect(prisma.delivery.create).toHaveBeenCalledWith({ data: mockDelivery });
  });

  it('should return null for invalid UUID on findById', async () => {
    const result = await repository.findById('bad-uuid');
    expect(result).toBeNull();
  });

  it('should return a delivery by ID', async () => {
    const mockId = uuidv4();
    const mockDelivery = { id: mockId };
    prisma.delivery.findUnique.mockResolvedValueOnce(mockDelivery as any);

    const result = await repository.findById(mockId);
    expect(result).toEqual(mockDelivery);
  });

  it('should return paginated deliveries', async () => {
    prisma.delivery.findMany.mockResolvedValueOnce([] as any);
    prisma.delivery.count.mockResolvedValueOnce(0);

    const [deliveries, count] = await repository.findAll(1, 5);
    expect(deliveries).toEqual([]);
    expect(count).toBe(0);
  });

  it('should return null on invalid customerId in findByCustomerId', async () => {
    const result = await repository.findByCustomerId('invalid');
    expect(result).toBeNull();
  });
});
