
import { GetAllCustomersUseCase } from './get-all-customers.use-case';
import { CustomerRepositoryPort } from '../../ports/repositories/customer.repository.port';
import { Customer } from 'src/core/entities/customer.entity';


const customer1: Customer ={
  id: '1',
  fullname: 'Alice',
  email: 'alice@example.com',
  customerId: 'CC123456',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const customer2: Customer ={
  id: '2',
  fullname: 'Bob',
  email: 'bob@example.com',
  customerId: 'CC456789',
  createdAt: new Date(),
  updatedAt: new Date(),
};

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
    const mockResult: [Customer[], number] = [[
      customer1,
      customer2
    ], 2];
    mockCustomerRepository.findAll.mockResolvedValue(mockResult);

    const result = await useCase.execute(1, 10);

    expect(mockCustomerRepository.findAll).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(mockResult);
  });
});
