import { useForm, type UseFormReturn } from "react-hook-form";
import type { Address, Customer, PaymentData } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, customerSchema, paymentSchema } from "../utils";

export type FormContextDictType = Record<
  string,
  UseFormReturn<Customer> | UseFormReturn<PaymentData> | UseFormReturn<Address>
>;

export interface IDefaultValuesContextForms {
  customer: Customer | null;
  paymentData: PaymentData | null;
  address: Address | null;
}

export const useCheckoutContextForms = (
  dafualtValues: IDefaultValuesContextForms
) => {
  const { customer, paymentData, address } = dafualtValues;

  const customerFormContext = useForm<Customer>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      fullname: "",
      email: "",
      personalIdType: "CC",
      personalIdNumber: "",
    },
    mode: "onChange",
  });

  const paymentFormContext = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentData || {
      cardNumber: "",
      cvc: "",
      expMonth: "",
      expYear: "",
      installments: 12,
      cardHolder: "",
      acceptPersonalAuth: false,
    },
    mode: "onChange",
  });

  const shippingFormContext = useForm<Address>({
      resolver: zodResolver(addressSchema),
      defaultValues: address || {
        country: 'CO',
        addressLine1: '',
        addressLine2: '',
        region: '',
        city: '',
        postalCode: '',
        contactName: customer?.fullname || '',
        phoneNumber: '',
      },
      mode: 'onChange',
    });

  const formContextMap: FormContextDictType = {
    0: customerFormContext,
    1: paymentFormContext,
    2: shippingFormContext,
  };

  return {
    customerFormContext,
    paymentFormContext,
    shippingFormContext,

    formContextMap,
  };
};
