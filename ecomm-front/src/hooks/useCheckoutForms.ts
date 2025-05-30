import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
  useCheckoutContextForms,
  type ITermsFormData,
} from "./useCheckoutContextForms";
import type { Address, Customer, PaymentData } from "../types";
import {
  setAddress,
  setCustomer,
  setPaymentData,
} from "../features/checkout/checkoutSlice";

export const useCheckoutForms = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customer, address, paymentData } = useSelector(
    (state: RootState) => state.checkout
  );

  const {
    formContextMap,
    termsFormContext,
    customerFormContext,
    paymentFormContext,
    shippingFormContext,
  } = useCheckoutContextForms({
    customer,
    paymentData,
    address,
  });

  const [termsAcceptedCheck, privacyAcceptedCheck] = termsFormContext.watch([
    "termsAccepted",
    "privacyAccepted",
  ]);
  const areTermsAccepted = termsAcceptedCheck && privacyAcceptedCheck;

  const updateCheckoutState = (
    section: string,
    data: Customer | PaymentData | Address | ITermsFormData
  ) => {
    switch (section) {
      case "customer":
        dispatch(setCustomer(data as Customer));
        break;
      case "paymentData":
        dispatch(setPaymentData(data as PaymentData));
        break;
      case "address":
        dispatch(setAddress(data as Address));
        break;
      default:
        break;
    }
  };

  const updateFormSection = async (section: string, activeStep: number) => {
    const data = await formContextMap[activeStep].getValues();
    updateCheckoutState(section, data);
  };

  const checkFormErrors = async (activeStep: number) => {
    return await formContextMap[activeStep].trigger();
  };

  return {
    formContextMap,
    termsFormContext,
    areTermsAccepted,
    customerFormContext,
    paymentFormContext,
    shippingFormContext,

    checkFormErrors,
    updateFormSection,
  };
};
