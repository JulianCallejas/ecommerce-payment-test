import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import {
  resetPurchaseStage,
  setIsCheckoutModalOpen,
  setIsSummaryOpen,
  setPurchaseStage,
  setTransactionModalMessage,
} from "../features/purchase/purchaseStageSlice";
import { clearTermsAndPrivacy, setProductId } from "../features/checkout/checkoutSlice";
import { useCallback } from "react";

export const usePurchaseProcess = () => {
  const dispatch = useDispatch<AppDispatch>();

  const cancelProcess = useCallback(() => {
    dispatch(resetPurchaseStage());
  }, [dispatch]);

  const openCheckoutModal = useCallback(() => {
    dispatch(setPurchaseStage("checkout"));
    dispatch(clearTermsAndPrivacy());
    dispatch(setIsCheckoutModalOpen(true));
  }, [dispatch]);

  const startCheckout = useCallback(
    (productId: string) => {
      dispatch(setProductId(productId));
      dispatch(setPurchaseStage("checkout"));
      dispatch(setIsCheckoutModalOpen(true));
    },
    [dispatch]
  );

  const closeCheckoutModal = useCallback(() => {
    dispatch(setPurchaseStage(""));
    dispatch(setIsCheckoutModalOpen(false));
  }, [dispatch]);

  const startSummary = useCallback(() => {
    dispatch(setPurchaseStage("summary"));
    dispatch(setIsSummaryOpen(true));
  }, [dispatch]);

  const closeSummary = useCallback(() => {
    dispatch(setPurchaseStage(""));
    dispatch(setIsSummaryOpen(false));
  }, [dispatch]);

  const startTransaction = useCallback(
    () => {
      dispatch(setTransactionModalMessage("creating-order"));
  }, [dispatch]);
  
  const closeTransactionModal = useCallback(
    () => {
      dispatch(setTransactionModalMessage(""));
  }, [dispatch]);

  const setOrderCreated = useCallback(() => {
    dispatch(setPurchaseStage("order-created"));
  }, [dispatch]);


  return {
    openCheckoutModal,
    cancelProcess,
    startCheckout,
    closeCheckoutModal,
    startSummary,
    closeSummary,
    startTransaction,
    closeTransactionModal,
    setOrderCreated,
  };
};
