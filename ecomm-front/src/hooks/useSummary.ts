import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { usePurchaseProcess } from "./usePurchaseProcess";

import type {
  OrderCreateRequest,
} from "../types";
import { createOrder } from "../features/order/orderSlice";
import { setPurchaseStage  } from "../features/purchase/purchaseStageSlice";
import { resetSummary } from "../features/summary/summarySlice";

export const useSummary = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { closeSummary } = usePurchaseProcess();
  
  const summary = useSelector((state: RootState) => state.summary.data);
  const title = useSelector((state: RootState) => state.product.data?.name);
  const order = useSelector((state: RootState) => state.order.data);
  const { paymentData, address, customer, privacyAccepted, termsAccepted } = useSelector((state: RootState) => state.checkout);
  const canStartpaymentProcess =
    !!paymentData &&
    !!address &&
    !!customer &&
    !!termsAccepted &&
    !!privacyAccepted &&
    !!summary;

  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);

  const placeOrder = useCallback(() => {
    const request: OrderCreateRequest = {
      productId: summary!.product.id,
      quantity: summary!.quantity,
      customer: {
        fullname: summary!.customer.fullname,
        email: summary!.customer.email,
        customerId: `${customer!.personalIdType}${customer!.personalIdNumber}`,
      },
      address: {
        ...summary!.address,
        postalCode: summary!.address.postalCode || undefined,
        addressLine2: summary!.address.addressLine2 || undefined,
      },
      baseAmount: summary!.baseAmount,
      deliveryFee: summary!.deliveryFee,
    };

    dispatch(createOrder(request));
  }, [customer, dispatch, summary]);

  const startPaymentProcess = useCallback(async () => {
    setIsProcessingPayment(true);
    // startTransaction();
    if (order && order.quantity === summary!.quantity) {
        dispatch(setPurchaseStage("order-created"));
        return;
    };
    placeOrder();
  }, [dispatch, order, placeOrder, summary]);

  const openCheckoutModal = useCallback(() => {
    closeSummary();
    openCheckoutModal();
  }, [closeSummary]);

  const cancelSummary = useCallback(() => {
    dispatch(resetSummary());
    closeSummary();
  }, [closeSummary, dispatch]);

  return {
    summary,
    title,
    hasPaymentData: !!paymentData?.cardNumber,
    isProcessingPayment,
    canStartpaymentProcess,

    
    startPaymentProcess,
    cancelSummary,
    openCheckoutModal,
  };
};
