/* istanbul ignore file */

export class OrderAddress {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  region: string;
  city: string;
  postalCode?: string;
  contactName?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}