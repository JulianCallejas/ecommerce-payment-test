import { mockOrder } from 'src/tests/mocks';
import { GetOrderIdUseCase } from './get-order-id.use-case';

const mockOrderRepository = {
  findById: jest.fn()
};

describe('GetOrderIdUseCase', () => {
  let useCase: GetOrderIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetOrderIdUseCase(mockOrderRepository as any);
  });

  it('should return order when found', async () => {
    
    mockOrderRepository.findById.mockResolvedValue(mockOrder);

    const result = await useCase.execute(mockOrder.id);

    expect(result).toEqual(mockOrder);
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(mockOrder.id);
  });

  it('should return null if order not found', async () => {
    mockOrderRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id');

    expect(result).toBeNull();
  });
});
