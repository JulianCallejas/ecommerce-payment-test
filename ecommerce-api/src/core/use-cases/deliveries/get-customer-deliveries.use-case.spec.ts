import { GetCustomerDeliveriesUseCase } from './get-customer-deliveries.use-case';
import { DeliveryRepositoryPort } from '../../ports/repositories/delivery.repository.port';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';
import { NotFoundException } from '@nestjs/common';
import { mockCustomer } from 'src/tests/mocks';


describe('GetCustomerDeliveriesUseCase', () => {
  let useCase: GetCustomerDeliveriesUseCase;
  let mockDeliveryRepository: jest.Mocked<DeliveryRepositoryPort>;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(() => {
    mockDeliveryRepository = {
      findByCustomerId: jest.fn(),
    } as any;

    mockCustomerRepository = {
      findById: jest.fn(),
    } as any;

    useCase = new GetCustomerDeliveriesUseCase(
      mockDeliveryRepository,
      mockCustomerRepository
    );
  });

  it('should throw NotFoundException if customer does not exist', async () => {
    mockCustomerRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should return customer deliveries if customer exists', async () => {
    
    const mockDeliveries = [
      { id: 'd1', orderId: 'o1', status: 'DELIVERED' },
      { id: 'd2', orderId: 'o2', status: 'COMPLETED' },
    ] as any;

    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockDeliveryRepository.findByCustomerId.mockResolvedValue(mockDeliveries);

    const result = await useCase.execute('c1');

    expect(mockCustomerRepository.findById).toHaveBeenCalledWith('c1');
    expect(mockDeliveryRepository.findByCustomerId).toHaveBeenCalledWith('c1');
    expect(result).toEqual(mockDeliveries);
  });
});
