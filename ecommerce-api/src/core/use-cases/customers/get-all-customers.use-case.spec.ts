
import { GetAllCustomersUseCase } from './get-all-customers.use-case';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';
import { Customer } from 'src/core/entities/customer.entity';
import { mockCustomers } from 'src/tests/mocks';


describe('GetAllCustomersUseCase', () => {
  let useCase: GetAllCustomersUseCase;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryPort>;

  beforeEach(() => {
    mockCustomerRepository = {
      findAll: jest.fn(),
    } as any;

    useCase = new GetAllCustomersUseCase(mockCustomerRepository);
  });

  it('should call findAll with correct pagination and return the result', async () => {
    const mockResult: [Customer[], number] = [mockCustomers, 2];
    mockCustomerRepository.findAll.mockResolvedValue(mockResult);

    const result = await useCase.execute(1, 10);

    expect(mockCustomerRepository.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(mockResult);
  });
});
