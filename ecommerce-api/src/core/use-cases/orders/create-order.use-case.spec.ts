import { mockProduct } from 'src/tests/mocks';
import { CreateOrderUseCase } from './create-order.use-case';


const mockProductRepository = {
  findById: jest.fn()
};

const mockOrderRepository = {
  createAddressAndCustomerAndOrder: jest.fn()
};

const mockConfigService = {
  get: jest.fn()
};

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateOrderUseCase(
      mockConfigService as any,
      mockProductRepository as any,
      mockOrderRepository as any
    );
  });

  const validInput = {
    productId: mockProduct.id,
    quantity: 2,
    baseAmount: 200,
    deliveryFee: 20,
    customer: {
      customerId: 'cust-123',
      fullname: 'Test User',
      email: 'test@example.com'
    },
    address: {
      addressLine1: '123 Main St',
      region: 'Test Region',
      city: 'Test City'
    }
  };

  it('should create order with valid input', async () => {
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockConfigService.get.mockReturnValue(10);
    mockOrderRepository.createAddressAndCustomerAndOrder.mockResolvedValue({ id: 'order-123' });

    const result = await useCase.execute(validInput);

    expect(result).toEqual({ id: 'order-123' });
    expect(mockProductRepository.findById).toHaveBeenCalledWith(validInput.productId);
    expect(mockOrderRepository.createAddressAndCustomerAndOrder).toHaveBeenCalled();
  });

  it('should throw if product does not exist', async () => {
    mockProductRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(`Invalid product id ${validInput.productId}`);
  });

  it('should throw if not enough stock', async () => {
    mockProductRepository.findById.mockResolvedValue({ ...mockProduct, stock: 1 });

    await expect(useCase.execute(validInput)).rejects.toThrow(`Not enough stock for product ${validInput.productId}`);
  });

  it('should throw if base amount is incorrect', async () => {
    mockProductRepository.findById.mockResolvedValue(mockProduct);

    await expect(
      useCase.execute({ ...validInput, baseAmount: 999 }) // wrong amount
    ).rejects.toThrow(/Invalid base amount/);
  });

  it('should throw if delivery fee is incorrect', async () => {
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockConfigService.get.mockReturnValue(10); // 10% delivery

    await expect(
      useCase.execute({ ...validInput, deliveryFee: 999 }) // wrong fee
    ).rejects.toThrow(/Invalid delivery fee/);
  });
});
