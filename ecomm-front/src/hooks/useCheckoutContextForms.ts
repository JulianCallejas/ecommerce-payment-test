import { useForm, type UseFormReturn } from "react-hook-form";
import type { Address, Customer, PaymentData } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, customerSchema, paymentSchema, termsSchema } from "../utils";

export interface ITermsFormData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  
}

export type FormContextDictType = Record<
  string,
  UseFormReturn<Customer> | UseFormReturn<PaymentData> | UseFormReturn<Address> | UseFormReturn<ITermsFormData>
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
      acceptPersonalAuth: "",
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

    const termsFormContext = useForm<ITermsFormData>({
      resolver: zodResolver(termsSchema),
      defaultValues:  {
        termsAccepted: false,
        privacyAccepted: false
      },
      mode: 'onChange',
    });

  const formContextMap: FormContextDictType = {
    0: customerFormContext,
    1: paymentFormContext,
    2: shippingFormContext,
    3: termsFormContext,
  };

  return {
    customerFormContext,
    paymentFormContext,
    shippingFormContext,
    termsFormContext,

    formContextMap,
  };
};
