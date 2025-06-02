import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesController } from './deliveries.controller';
import { GetAllDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-all-deliveries.use-case';
import { GetCustomerDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-customer-deliveries.use-case';

describe('DeliveriesController', () => {
  let controller: DeliveriesController;
  let getAllDeliveriesUseCase: GetAllDeliveriesUseCase;
  let getCustomerDeliveriesUseCase: GetCustomerDeliveriesUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveriesController],
      providers: [
        {
          provide: GetAllDeliveriesUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetCustomerDeliveriesUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<DeliveriesController>(DeliveriesController);
    getAllDeliveriesUseCase = module.get(GetAllDeliveriesUseCase);
    getCustomerDeliveriesUseCase = module.get(GetCustomerDeliveriesUseCase);
  });

  it('should return paginated deliveries', async () => {
    const mockDeliveries = [{
      id: '1',
      order: {
        id: 'O1',
        product: { product: 'Laptop' },
        quantity: 1,
        unitPrice: 1000,
        deliveryFee: 50,
        customer: {
          id: 'C1',
          customerId: 'CU1',
          fullname: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date(),
        },
        address: {
          addressLine1: '123 Street',
          addressLine2: '',
          city: 'City',
          region: 'Region',
          country: 'CO',
          postalCode: '12345',
          contactName: 'John',
          phoneNumber: '123456789',
        },
      },
      status: 'PENDING',
      createdAt: new Date(),
    }];

    (getAllDeliveriesUseCase.execute as jest.Mock).mockResolvedValue([mockDeliveries, 1]);

    const result = await controller.getAllDeliveries({ page: 1, pageSize: 10 });

    expect(result.data.length).toBe(1);
    expect(result.total).toBe(1);
    expect(getAllDeliveriesUseCase.execute).toHaveBeenCalledWith(1, 10);
  });

  it('should return customer deliveries', async () => {
    const mockCustomerDeliveries = [{ id: '1', order: { product: { product: 'Phone' } }, status: 'DELIVERED', createdAt: new Date() }];
    (getCustomerDeliveriesUseCase.execute as jest.Mock).mockResolvedValue(mockCustomerDeliveries);

    const result = await controller.getCustomerDeliveries('customer-id');

    expect(Array.isArray(result)).toBe(true);
    expect(getCustomerDeliveriesUseCase.execute).toHaveBeenCalledWith('customer-id');
  });
});
