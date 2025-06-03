import { Test, TestingModule } from '@nestjs/testing';
import { WompiGatewayService } from './wompi-gateway.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('WompiGatewayService', () => {
  let service: WompiGatewayService;
  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn()
  };
  const mockConfigService = {
    get: jest.fn((key: string) => {
      const defaults = {
        WOMPI_URL: 'https://fake.url',
        WOMPI_PUBLIC_KEY: 'pk_test',
        WOMPI_PRIVATE_KEY: 'sk_test',
        WOMPI_INTEGRITY_KEY: 'integrity_key'
      };
      return defaults[key];
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WompiGatewayService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile();

    service = module.get<WompiGatewayService>(WompiGatewayService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('tokenizeCard', () => {
    const params = {
      number: '4111111111111111',
      cvc: '123',
      expMonth: '12',
      expYear: '30',
      cardHolder: 'Test User'
    };

    it('should return token data on success', async () => {
      const mockResponse: AxiosResponse = { data: { token: 'abc123' } } as any;
      mockHttpService.post.mockReturnValueOnce(of(mockResponse));
      const result = await service.tokenizeCard(params);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failure', async () => {
      mockHttpService.post.mockReturnValueOnce(
        throwError(() => ({
          response: { data: { error: { messages: ['Invalid'] } } }
        }))
      );
      await expect(service.tokenizeCard(params)).rejects.toThrowError();
    });
  });

  describe('createTransaction', () => {
    const params = {
      acceptanceToken: 'accept123',
      amountInCents: 100000,
      currency: 'COP',
      signature: 'sig123',
      customerEmail: 'user@test.com',
      token: 'cardtok123',
      installments: 1,
      reference: 'ref123',
      expiresAt: new Date().toISOString(),
      customerData: {
        fullname: 'John Doe',
        customerId: 'CC123456',
        id: "c1", 
        email: "jd@example.com", 
        createdAt: new Date(), 
        updatedAt: new Date()
      },
      shippingAddress: {
        addressLine1: 'Street 1',
        addressLine2: '',
        region: 'Bogotá',
        city: 'Bogotá',
        phoneNumber: '3000000000',
        postalCode: '111111',
        contactName: '',
        id: "ad1",
        country: "CO",
        createdAt: new Date(), 
        updatedAt: new Date()
      }
    };

    it('should create transaction successfully', async () => {
      const mockResponse: AxiosResponse = { data: { transaction: 'ok' } } as any;
      mockHttpService.post.mockReturnValueOnce(of(mockResponse));
      const result = await service.createTransaction(params);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failure', async () => {
      mockHttpService.post.mockReturnValueOnce(
        throwError(() => ({
          response: { data: { error: { messages: ['Rejected'] } } }
        }))
      );
      await expect(service.createTransaction(params)).rejects.toThrowError();
    });
  });

  describe('getTransactionStatus', () => {
    const transaction = { externalId: 'ext123' } as any;

    it('should return transaction status', async () => {
      const mockResponse: AxiosResponse = { data: { status: 'APPROVED' } } as any;
      mockHttpService.get.mockReturnValueOnce(of(mockResponse));
      const result = await service.getTransactionStatus(transaction);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error if API call fails', async () => {
      mockHttpService.get.mockReturnValueOnce(
        throwError(() => ({
          response: { data: { error: { messages: ['Not Found'] } } }
        }))
      );
      await expect(service.getTransactionStatus(transaction)).rejects.toThrowError();
    });
  });

  describe('generateSignature', () => {
    it('should generate SHA256 signature correctly', () => {
      const result = service.generateSignature(
        'tx123',
        1000,
        'COP',
        new Date('2025-01-01T00:00:00Z')
      );
      expect(typeof result).toBe('string');
      expect(result).toHaveLength(64);
    });
  });
});
