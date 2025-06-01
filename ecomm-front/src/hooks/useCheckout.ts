import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useCallback, useState } from "react";
import { usePurchaseProcess } from "./usePurchaseProcess";
import type { OrderConfirmRequest } from "../types";
import apiService from "../services/api";
import { setSummary } from "../features/summary/summarySlice";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useCheckoutForms } from "./useCheckoutForms";

const steps = [
  "Informacón Personal",
  "Tarjeta de Crédito",
  "Datos de Envío",
  "Confirmación",
];

const checkoutFormDataMap: Record<number, string> = {
  0: "customer",
  1: "paymentData",
  2: "address",
};

export const useCheckout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useNotifications();

  const [isProcessingSummary, setIsProcessingSummary] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { closeCheckoutModal, startSummary } = usePurchaseProcess();
  const {
    checkFormErrors,
    updateFormSection,
    formContextMap,
    termsFormContext,
    areTermsAccepted,
    customerFormContext,
    paymentFormContext,
    shippingFormContext,
  } = useCheckoutForms();
  const {
    productId,
    customer,
    address,
    paymentData,
    quantity,
    termsAccepted,
    privacyAccepted,
  } = useSelector((state: RootState) => state.checkout);
  const hasAcceptTokens = !!termsAccepted && !!privacyAccepted;

  const handleCloseModal = useCallback(() => {
    setActiveStep(0);
    closeCheckoutModal();
  }, [closeCheckoutModal]);

  const calculateSummary = useCallback(async () => {
    setIsProcessingSummary(true);
    const orderConfirmRequest: OrderConfirmRequest = {
      productId,
      quantity: quantity!,
      customer: {
        fullname: customer!.fullname,
        email: customer!.email,
        customerId: `${customer!.personalIdType}${customer!.personalIdNumber}`,
      },
      address: {
        ...address!,
        postalCode: address!.postalCode || undefined,
        addressLine2: address!.addressLine2 || undefined,
      },
    };

    try {
      const orderConfirmationResponse =
        await apiService.confirmOrder(orderConfirmRequest);
      dispatch(setSummary(orderConfirmationResponse));
      setIsProcessingSummary(false);
      closeCheckoutModal();
      startSummary();
    } catch (error) {
      console.error(error);
      notifications.show(
        "Verifique los datos ingresados e intente nuevamente",
        {
          severity: "error",
        }
      );
      setIsProcessingSummary(false);
    }
  }, [
    address,
    closeCheckoutModal,
    customer,
    dispatch,
    notifications,
    productId,
    quantity,
    startSummary,
  ]);

  const handleCheckout = useCallback(async () => {
    if (!productId || !customer || !address || !paymentData || !quantity) {
      notifications.show("Verifique los datos e intente nuevamente", {
        severity: "warning",
        autoHideDuration: 6000
      });
      return;
    }
    await calculateSummary();
  }, [
    address,
    calculateSummary,
    customer,
    notifications,
    paymentData,
    productId,
    quantity,
  ]);

  const handleNext = useCallback(async () => {
    if (!(await checkFormErrors(activeStep))) return;
    updateFormSection(checkoutFormDataMap[activeStep], activeStep);

    if (activeStep === steps.length - 1) {
      handleCheckout();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }, [activeStep, checkFormErrors, handleCheckout, updateFormSection]);

  const handleBack = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, []);

  return {
    isProcessingSummary,
    activeStep,
    formContextMap,
    termsFormContext,
    areTermsAccepted,
    hasAcceptTokens,
    customerFormContext,
    paymentFormContext,
    shippingFormContext,
    steps,

    handleCloseModal,
    handleNext,
    handleBack,
  };
};
