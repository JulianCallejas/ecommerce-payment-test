import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import {
  resetPurchaseStage,
  setIsCheckoutModalOpen,
  setIsSummaryOpen,
  setPurchaseStage,
} from "../features/purchase/purchaseStageSlice";
import { setProductId } from "../features/checkout/checkoutSlice";

export const usePurchaseProcess = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const cancelProcess = () => {
    dispatch(resetPurchaseStage());
  };

  const startCheckout = (productId: string) => {
    dispatch(setProductId(productId));
    dispatch(setPurchaseStage("checkout"));
    dispatch(setIsCheckoutModalOpen(true));
  };
  

  const closeCheckoutModal = () => {
    dispatch(setPurchaseStage(""));
    dispatch(setIsCheckoutModalOpen(false));
  };

  const startSummary = () => {
    dispatch(setPurchaseStage("summary"));
    dispatch(setIsSummaryOpen(true));
  };

  return {
    cancelProcess,
    startCheckout,
    closeCheckoutModal,
    startSummary,

  };
};
