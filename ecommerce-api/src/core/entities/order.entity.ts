import { Decimal } from '@prisma/client/runtime/library';
import { Customer } from './customer.entity';
import { OrderAddress } from './order-address.entity';
import { Product } from './product.entity';

export class Order {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: Decimal;
  deliveryFee: Decimal;
  customerId: string;
  customer?: Customer;
  addressId: string;
  address?: OrderAddress;
  createdAt: Date;
  updatedAt: Date;
}