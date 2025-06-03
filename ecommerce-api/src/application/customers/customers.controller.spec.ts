import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { GetAllCustomersUseCase } from 'src/core/use-cases/customers/get-all-customers.use-case';
import { GetCustomerWithOrdersUseCase } from 'src/core/use-cases/customers/get-customer-with-orders.use-case';
import { NotFoundException } from '@nestjs/common';

describe('CustomersController', () => {
  let controller: CustomersController;
  let getAllCustomersUseCase: GetAllCustomersUseCase;
  let getCustomerWithOrdersUseCase: GetCustomerWithOrdersUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: GetAllCustomersUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetCustomerWithOrdersUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    getAllCustomersUseCase = module.get(GetAllCustomersUseCase);
    getCustomerWithOrdersUseCase = module.get(GetCustomerWithOrdersUseCase);
  });

  it('should return paginated customers', async () => {
    const mockCustomers = [
      { id: '1', customerId: 'C1', fullname: 'John Doe', email: 'john@example.com', createdAt: new Date() },
    ];
    (getAllCustomersUseCase.execute as jest.Mock).mockResolvedValue([mockCustomers, 1]);

    const result = await controller.getAllCustomers({ page: 1, pageSize: 10 });

    expect(result.data.length).toBe(1);
    expect(result.total).toBe(1);
    expect(getAllCustomersUseCase.execute).toHaveBeenCalledWith(1, 10);
  });
  
  it('should return paginated customers without params', async () => {
    const mockCustomers = [
      { id: '1', customerId: 'C1', fullname: 'John Doe', email: 'john@example.com', createdAt: new Date() },
    ];
    (getAllCustomersUseCase.execute as jest.Mock).mockResolvedValue([mockCustomers, 1]);

    const result = await controller.getAllCustomers({});

    expect(result.data.length).toBe(1);
    expect(result.total).toBe(1);
    expect(getAllCustomersUseCase.execute).toHaveBeenCalledWith(1, 10);
  });

  it('should return customer by ID', async () => {
    const mockCustomer = {
      id: '1',
      customerId: 'C1',
      fullname: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      orders: [],
    };

    (getCustomerWithOrdersUseCase.execute as jest.Mock).mockResolvedValue(mockCustomer);

    const result = await controller.getCustomerById('1');

    expect(result.fullname).toBe('John Doe');
    expect(getCustomerWithOrdersUseCase.execute).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if customer not found', async () => {
    (getCustomerWithOrdersUseCase.execute as jest.Mock).mockResolvedValue(null);

    await expect(controller.getCustomerById('999')).rejects.toThrow(NotFoundException);
  });
});
