/* istanbul ignore file */

import { Order } from "@prisma/client";

export class Customer {
  id: string;
  customerId: string;
  fullname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  orders?: Order[];
}