import { GetAllDeliveriesUseCase } from './get-all-deliveries.use-case';
import { DeliveryRepositoryPort } from '../../ports/repositories/delivery.repository.port';

describe('GetAllDeliveriesUseCase', () => {
  let useCase: GetAllDeliveriesUseCase;
  let mockDeliveryRepository: jest.Mocked<DeliveryRepositoryPort>;

  beforeEach(() => {
    mockDeliveryRepository = {
      findAll: jest.fn(),
    } as any;

    useCase = new GetAllDeliveriesUseCase(mockDeliveryRepository);
  });

  it('should call findAll with pagination and return the result', async () => {
    const mockDeliveries = [
      { id: 'd1', orderId: 'o1', status: 'IN_TRANSIT' },
      { id: 'd2', orderId: 'o2', status: 'DELIVERED' },
    ] as any;

    mockDeliveryRepository.findAll.mockResolvedValue(mockDeliveries);

    const result = await useCase.execute(1, 10);

    expect(mockDeliveryRepository.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(mockDeliveries);
  });
});
