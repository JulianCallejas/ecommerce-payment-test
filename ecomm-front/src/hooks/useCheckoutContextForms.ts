import { useForm, type UseFormReturn } from "react-hook-form";
import type { Customer, PaymentData } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, paymentSchema } from "../utils";

export type FormContextDictType = Record<
  string,
  UseFormReturn<Customer> | UseFormReturn<PaymentData>
>;

export interface IDefaultValuesContextForms {
  customer: Customer | null;
  paymentData: PaymentData | null;
}

export const useCheckoutContextForms = (
  dafualtValues: IDefaultValuesContextForms
) => {
  const { customer, paymentData } = dafualtValues;

  const customerFormContext = useForm<Customer>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      fullname: "",
      email: "",
      personalIdType: "CC",
      personalIdNumber: "",
    },
    mode: "all",
  });

  const paymentFormContext = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentData || {
      cardNumber: "",
      cvc: "",
      expMonth: "",
      expYear: "",
      installments: 1,
      cardHolder: "",
      acceptPersonalAuth: false,
    },
    mode: "onChange",
  });

  const formContextMap: FormContextDictType = {
    0: customerFormContext,
    1: paymentFormContext,
  };

  return {
    customerFormContext,
    paymentFormContext,

    formContextMap,
  };
};
