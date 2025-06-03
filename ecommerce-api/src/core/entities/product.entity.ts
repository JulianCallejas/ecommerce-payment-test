/* istanbul ignore file */

import { Decimal } from "@prisma/client/runtime/library";

export class Product {
  id: string;
  slug: string;
  product: string;
  description: string;
  stock: number;
  unitPrice: Decimal;
  images: string[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
