import { Customer } from './customer.entity';
import { Product } from './product.entity';

export class Order {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  customerId: string;
  customer?: Customer;
  addressId: string;
  createdAt: Date;
  updatedAt: Date;
}