import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from 'src/core/use-cases/orders/create-order.use-case';
import { GetOrderIdUseCase } from 'src/core/use-cases/orders/get-order-id.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/core/entities/order.entity';
import { mockCustomer, mockOrderAddress } from 'src/tests/mocks';

describe('OrdersController', () => {
  let controller: OrdersController;
  let createOrderUseCase: CreateOrderUseCase;
  let getOrderIdUseCase: GetOrderIdUseCase;

  const mockOrder = { id: '1', productId: 'abc', quantity: 2 } as unknown as Order;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: CreateOrderUseCase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: GetOrderIdUseCase,
          useValue: { execute: jest.fn() }
        }
      ]
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    createOrderUseCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    getOrderIdUseCase = module.get<GetOrderIdUseCase>(GetOrderIdUseCase);
  });

  it('should create an order', async () => {
    const dto: CreateOrderDto = { productId: 'abc', quantity: 2, customer: mockCustomer, address: {...mockOrderAddress, phoneNumber: mockOrderAddress.phoneNumber!}, baseAmount: 5000 , deliveryFee: 1000 };
    jest.spyOn(createOrderUseCase, 'execute').mockResolvedValue(mockOrder);

    const result = await controller.createOrder(dto);

    expect(result).toEqual(mockOrder);
    expect(createOrderUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should get an order by id', async () => {
    jest.spyOn(getOrderIdUseCase, 'execute').mockResolvedValue(mockOrder);

    const result = await controller.getTransaction('1');

    expect(result).toEqual(mockOrder);
    expect(getOrderIdUseCase.execute).toHaveBeenCalledWith('1');
  });
});
