import { useForm, type UseFormReturn } from "react-hook-form";
import type { Customer } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "../utils";

export type FormContextDictType = Record<string, UseFormReturn<Customer>>;

export interface IDefaultValuesContextForms {
  customer: Customer | null;
}

export const useCheckoutContextForms = (
  dafualtValues: IDefaultValuesContextForms
) => {
  const { customer } = dafualtValues;
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

  const formContextMap: FormContextDictType = {
    0: customerFormContext,
  };

  return {
    customerFormContext,
    
    formContextMap
  };
};
