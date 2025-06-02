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


export const mockCustomer: Customer = customer1;

export const mockCustomers: Customer[] = [
  mockCustomer,
  customer2,
];