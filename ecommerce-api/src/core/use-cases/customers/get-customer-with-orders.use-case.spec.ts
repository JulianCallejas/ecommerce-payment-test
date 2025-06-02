
import { GetCustomerWithOrdersUseCase } from './get-customer-with-orders.use-case';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';
import { NotFoundException } from '@nestjs/common';
import { mockCustomer } from 'src/tests/mocks';


describe('GetCustomerWithOrdersUseCase', () => {
  let useCase: GetCustomerWithOrdersUseCase;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(() => {
    mockCustomerRepository = {
      findCustomerWithOrders: jest.fn(),
    } as any;

    useCase = new GetCustomerWithOrdersUseCase(mockCustomerRepository);
  });

  it('should throw NotFoundException if customer is not found', async () => {
    mockCustomerRepository.findCustomerWithOrders.mockResolvedValue(null);

    await expect(useCase.execute('not-found-id')).rejects.toThrow(NotFoundException);
  });

  it('should return customer with orders if found', async () => {
    const mockCustomerWithOrders = {
      ...mockCustomer,
      orders: [{ id: 'o1', customerId: '1', total: 100 }],
    } as any;

    mockCustomerRepository.findCustomerWithOrders.mockResolvedValue(mockCustomerWithOrders);

    const result = await useCase.execute('1');

    expect(mockCustomerRepository.findCustomerWithOrders).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockCustomerWithOrders);
  });
});
