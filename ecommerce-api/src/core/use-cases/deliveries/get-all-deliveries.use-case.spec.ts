import { GetAllDeliveriesUseCase } from './get-all-deliveries.use-case';
import { DeliveryRepositoryPort } from '../../ports/repositories/delivery.repository.port';
import { mockDeliveries } from 'src/tests/mocks';

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
    

    mockDeliveryRepository.findAll.mockResolvedValue([mockDeliveries, 2]);

    const result = await useCase.execute(1, 10);

    expect(mockDeliveryRepository.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual([mockDeliveries, 2]);
  });
});
