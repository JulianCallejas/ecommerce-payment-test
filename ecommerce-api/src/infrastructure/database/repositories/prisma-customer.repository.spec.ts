import { PrismaCustomerRepository } from './prisma-customer.repository';
import { PrismaService } from '../prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';

describe('PrismaCustomerRepository', () => {
  let repository: PrismaCustomerRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    repository = new PrismaCustomerRepository(prisma);
  });

  it('should create a customer', async () => {
    const mockCustomer = { id: uuidv4(), customerId: 'C123', fullname: 'John Doe' };
    prisma.customer.create.mockResolvedValueOnce(mockCustomer as any);

    const result = await repository.create(mockCustomer);
    expect(result).toEqual(mockCustomer);
    expect(prisma.customer.create).toHaveBeenCalledWith({ data: mockCustomer });
  });
  
  it('should return null for trhown error on create', async () => {
    const mockCustomer = { id: uuidv4(), customerId: 'C123', fullname: 'John Doe' };
    prisma.customer.create.mockRejectedValueOnce(new Error());

    const result = await repository.create(mockCustomer);
    expect(result).toEqual(null);
    
  });

  it('should return null for invalid UUID on findById', async () => {
    const result = await repository.findById('invalid-uuid');
    expect(result).toBeNull();
  });
  
  it('should return null for trhown error on findById', async () => {
    prisma.customer.findUnique.mockRejectedValueOnce(new Error());
    const result = await repository.findById(uuidv4());
    expect(result).toBeNull();
  });

  it('should find a customer by ID', async () => {
    const mockId = uuidv4();
    const mockCustomer = { id: mockId, fullname: 'Jane' };
    prisma.customer.findUnique.mockResolvedValueOnce(mockCustomer as any);

    const result = await repository.findById(mockId);
    expect(result).toEqual(mockCustomer);
  });

  it('should find all customers with pagination', async () => {
    prisma.customer.findMany.mockResolvedValueOnce([] as any);
    prisma.customer.count.mockResolvedValueOnce(0);

    const [customers, total] = await repository.findAll(1, 10);
    expect(customers).toEqual([]);
    expect(total).toBe(0);
  });

  it('should find customer by customerId', async () => {
    const mockCustomer = { id: uuidv4(), customerId: 'C321' };
    prisma.customer.findUnique.mockResolvedValueOnce(mockCustomer as any);

    const result = await repository.findByCustomerId('C321');
    expect(result).toEqual(mockCustomer);
  });
  
  it('should find customer by customerId with orders', async () => {
    const mockId = uuidv4();
    const mockCustomer = { id: mockId, customerId: 'C321', orders: [{ id: uuidv4() }] };
    prisma.customer.findUnique.mockResolvedValueOnce(mockCustomer as any);

    const result = await repository.findCustomerWithOrders(mockId);
    expect(Array.isArray(result.orders)).toBe(true);
    
  });
  
  it('should return null if thorw on findCustomerWithOrders', async () => {
    const mockId = uuidv4();
    prisma.customer.findUnique.mockRejectedValueOnce(new Error());

    const result = await repository.findCustomerWithOrders(mockId);
    expect(result).toBe(null);
    
  });
});
