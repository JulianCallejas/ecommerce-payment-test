import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from './checkout.controller';
import { CheckoutDataUseCase } from 'src/core/use-cases/checkout/checkout-data.use-case';
import { CheckoutDto } from './dto/chekout.dto';

import { mockCustomer, mockOrderAddress, mockProduct } from 'src/tests/mocks';

describe('CheckoutController', () => {
  let controller: CheckoutController;
  let checkoutDataUseCaseMock: jest.Mocked<CheckoutDataUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [
        {
          provide: CheckoutDataUseCase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<CheckoutController>(CheckoutController);
    checkoutDataUseCaseMock = module.get(CheckoutDataUseCase);
  });

  it('should return confirmation response from use case', async () => {
    const dto: CheckoutDto = {
      productId: mockProduct.id,
      quantity: 2,
      customer: mockCustomer,
      address: {
        addressLine1: mockOrderAddress.addressLine1,
        city: mockOrderAddress.city,
        country: mockOrderAddress.country,
        region: mockOrderAddress.region,
        postalCode: mockOrderAddress.postalCode,
        phoneNumber: mockOrderAddress.phoneNumber,
        contactName: mockOrderAddress.contactName,
      }
    };

    checkoutDataUseCaseMock.execute.mockResolvedValue({
      product: mockProduct,
      quantity: 2,
      baseAmount: Number(mockProduct.unitPrice) * 2,
      unitPrice: mockProduct.unitPrice,
      deliveryFee: 3000
    });

    const result = await controller.confirmOrder(dto);

    expect(checkoutDataUseCaseMock.execute).toHaveBeenCalledWith(mockProduct.id, 2);
    expect(result).toEqual({
      product: {
        id: mockProduct.id,
        images: mockProduct.images,
        product: mockProduct.product
      },
      quantity: 2,
      baseAmount: Number(mockProduct.unitPrice) * 2,
      deliveryFee: 3000,
      customer: dto.customer,
      address: {
        ...dto.address,
        country: 'CO'
      },
      unitPrice: Number(mockProduct.unitPrice),
    });
  });

  it('should throw if use case fails', async () => {
    const dto: CheckoutDto = {
      productId: 'prod-1',
      quantity: 2,
      customer: mockCustomer,
      address: {
        addressLine1: mockOrderAddress.addressLine1,
        city: mockOrderAddress.city,
        country: mockOrderAddress.country,
        region: mockOrderAddress.region,
        postalCode: mockOrderAddress.postalCode,
        phoneNumber: mockOrderAddress.phoneNumber,
        contactName: mockOrderAddress.contactName,
      }
    };

    checkoutDataUseCaseMock.execute.mockRejectedValue(
      new Error('Product not found')
    );

    await expect(controller.confirmOrder(dto)).rejects.toThrow('Product not found');
  });
});
