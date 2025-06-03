import { OrderAddress } from 'src/core/entities/order-address.entity';

export const mockOrderAddress: OrderAddress = {
  id: 'address-001',
  addressLine1: '123 Mockingbird Lane',
  addressLine2: 'Apt 4',
  country: 'Wonderland',
  region: 'Mock Region',
  city: 'Mock City',
  postalCode: '123456',
  contactName: 'Mock User',
  phoneNumber: '3211112222',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockOrderAddress2: OrderAddress = {
  id: 'address-002',
  addressLine1: '123 Mockingbird Lane',
  addressLine2: 'Apt 4',
  country: 'Wonderland',
  region: 'Mock Region',
  city: 'Mock City',
  postalCode: '123456',
  contactName: 'Mock User',
  phoneNumber: '3211112222',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockOrderAddresses: OrderAddress[] = [
  mockOrderAddress,
  {
    ...mockOrderAddress,
    id: 'address-002',
    addressLine1: '456 Test Street',
    city: 'Testville',
  },
];
