import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesController } from './deliveries.controller';
import { GetAllDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-all-deliveries.use-case';
import { GetCustomerDeliveriesUseCase } from 'src/core/use-cases/deliveries/get-customer-deliveries.use-case';
import { mockDelivery, mockDelivery2 } from 'src/tests/mocks';

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
          useValue: { execute: jest.fn() }
        },
        {
          provide: GetCustomerDeliveriesUseCase,
          useValue: { execute: jest.fn() }
        }
      ]
    }).compile();

    controller = module.get<DeliveriesController>(DeliveriesController);
    getAllDeliveriesUseCase = module.get(GetAllDeliveriesUseCase);
    getCustomerDeliveriesUseCase = module.get(GetCustomerDeliveriesUseCase);
  });

  it('should return paginated deliveries with correct structure', async () => {
    (getAllDeliveriesUseCase.execute as jest.Mock).mockResolvedValue([
      [mockDelivery],
      1
    ]);

    const result = await controller.getAllDeliveries({ page: 1, pageSize: 10 });

    expect(result.data.length).toBe(1);
    expect(result.total).toBe(1);
    expect(getAllDeliveriesUseCase.execute).toHaveBeenCalledWith(1, 10);

    const dto = result.data[0];
    expect(dto.id).toBe(mockDelivery.id);
    expect(dto.status).toBe(mockDelivery.status);
    expect(dto.order.productName).toBe(mockDelivery.order.product.product);
    expect(dto.order.quantity).toBe(mockDelivery.order.quantity);
    expect(dto.order.totalPrice.toString()).toBe(
      (
        Number(mockDelivery.order.unitPrice) * mockDelivery.order.quantity
      ).toString()
    );
    expect(dto.order.deliveryFee.toString()).toBe(
      mockDelivery.order.deliveryFee.toString()
    );
    expect(dto.order.customer.fullname).toBe(
      mockDelivery.order.customer.fullname
    );
    expect(dto.order.address.city).toBe(mockDelivery.order.address.city);
  });
  
  it('should return paginated deliveries with no params', async () => {
    (getAllDeliveriesUseCase.execute as jest.Mock).mockResolvedValue([
      [mockDelivery],
      1
    ]);

    const result = await controller.getAllDeliveries({});

    expect(result.data.length).toBe(1);
    expect(result.total).toBe(1);
    expect(getAllDeliveriesUseCase.execute).toHaveBeenCalledWith(1, 10);

    const dto = result.data[0];
    expect(dto.id).toBe(mockDelivery.id);
    expect(dto.status).toBe(mockDelivery.status);
    expect(dto.order.productName).toBe(mockDelivery.order.product.product);
    expect(dto.order.quantity).toBe(mockDelivery.order.quantity);
    expect(dto.order.totalPrice.toString()).toBe(
      (
        Number(mockDelivery.order.unitPrice) * mockDelivery.order.quantity
      ).toString()
    );
    expect(dto.order.deliveryFee.toString()).toBe(
      mockDelivery.order.deliveryFee.toString()
    );
    expect(dto.order.customer.fullname).toBe(
      mockDelivery.order.customer.fullname
    );
    expect(dto.order.address.city).toBe(mockDelivery.order.address.city);
  });

  it('should return customer deliveries with correct structure', async () => {
    (getCustomerDeliveriesUseCase.execute as jest.Mock).mockResolvedValue([
      mockDelivery2
    ]);

    const result = await controller.getCustomerDeliveries(
      mockDelivery2.order.customerId
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(getCustomerDeliveriesUseCase.execute).toHaveBeenCalledWith(
      mockDelivery2.order.customerId
    );

    const dto = result[0];
    expect(dto.id).toBe(mockDelivery2.id);
    expect(dto.status).toBe(mockDelivery2.status);
    expect(dto.order.productName).toBe(mockDelivery2.order.product.product);
    expect(dto.order.quantity).toBe(mockDelivery2.order.quantity);
    expect(dto.order.totalPrice.toString()).toBe(
      (
        Number(mockDelivery2.order.unitPrice) * mockDelivery2.order.quantity
      ).toString()
    );
    expect(dto.order.deliveryFee.toString()).toBe(
      mockDelivery2.order.deliveryFee.toString()
    );
    expect(dto.order.customer.fullname).toBe(
      mockDelivery2.order.customer.fullname
    );
    expect(dto.order.address.city).toBe(mockDelivery2.order.address.city);
  });

  it('should map multiple deliveries correctly', () => {
    const dtos = (controller as any).mapDeliveriesToDtos([
      mockDelivery,
      mockDelivery2
    ]);
    expect(dtos.length).toBe(2);
    expect(dtos[0].order.productName).toBe(mockDelivery.order.product.product);
    expect(dtos[1].order.productName).toBe(mockDelivery2.order.product.product);
  });

  it('should map delivery to DTO correctly', () => {
    const dto = (controller as any).deliveryToDto(mockDelivery);

    expect(dto.id).toBe(mockDelivery.id);
    expect(dto.status).toBe(mockDelivery.status);
    expect(dto.order.productName).toBe(mockDelivery.order.product.product);
    expect(dto.order.quantity).toBe(mockDelivery.order.quantity);
    expect(dto.order.totalPrice.toString()).toBe(
      (
        Number(mockDelivery.order.unitPrice) * mockDelivery.order.quantity
      ).toString()
    );
    expect(dto.order.deliveryFee.toString()).toBe(
      mockDelivery.order.deliveryFee.toString()
    );
    expect(dto.order.customer.fullname).toBe(
      mockDelivery.order.customer.fullname
    );
    expect(dto.order.address.city).toBe(mockDelivery.order.address.city);
  });
});
