import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import type { TransactionCreateRequest } from "../types";
import {
  createTransaction,
  pollTransaction,
  resetTransaction,
} from "../features/transaction/transactionSlice";
import { usePurchaseProcess } from "./usePurchaseProcess";
import { useNotifications } from "@toolpad/core/useNotifications";
import { resetOrder } from "../features/order/orderSlice";
import { clearPaymentData, clearTermsAndPrivacy } from "../features/checkout/checkoutSlice";
import { setTransactionModalMessage } from "../features/purchase/purchaseStageSlice";

export const useTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    closeTransactionModal,
    openCheckoutModal,
    cancelProcess,
   
  } = usePurchaseProcess();
  const { data: order } = useSelector((state: RootState) => state.order);
  const summary = useSelector((state: RootState) => state.summary.data);
  const {
    data: transaction,
    loaded: transactionLoaded,
    error: transactionError,
    loading: transactionLoading,
  } = useSelector((state: RootState) => state.transaction);

  const { paymentData, privacyAccepted, termsAccepted } = useSelector(
    (state: RootState) => state.checkout
  );
  const notifications = useNotifications();

  const canCreateTransaction =
    !!paymentData?.cardNumber &&
    !!termsAccepted &&
    !!privacyAccepted &&
    !!summary?.baseAmount &&
    !!summary?.deliveryFee;

  const { transactionModalMessage } = useSelector(
    (state: RootState) => state.purchaseStageState
  );

  const placeTransaction = useCallback(() => {
    console.log("point1")

    if (transactionError) {
      return;
    }

    if (transaction?.status === "PENDING") {
      dispatch(pollTransaction(transaction?.transactionId));
      return;
    }

    if (!canCreateTransaction && !transaction?.transactionId) {
      notifications.show("Confirme los datos de pago para continuar", {
        severity: "warning",
      });
      closeTransactionModal();
      openCheckoutModal();
    }

    const body: TransactionCreateRequest = {
      orderId: order!.id,
      totalAmount: summary!.baseAmount + summary!.deliveryFee,
      payment: {
        ...paymentData!,
        acceptanceToken: termsAccepted!,
        acceptPersonalAuth: privacyAccepted!,
      },
    };

    dispatch(createTransaction(body));
  }, [canCreateTransaction, closeTransactionModal, dispatch, notifications, openCheckoutModal, order, paymentData, privacyAccepted, summary, termsAccepted, transaction?.transactionId, transaction?.status, transactionError, transactionLoading]);

  useEffect(() => {
    if (!order?.id) return;
    console.log("place transaction")
    placeTransaction();
  }, [order?.id, placeTransaction]);

  // Poll transaction status
  useEffect(() => {
    if (
      transaction?.status !== "PENDING" ||
      !transactionLoaded ||
      transactionError
    )
      return;
    dispatch(pollTransaction(transaction?.transactionId));
  }, [
    dispatch,
    transaction?.transactionId,
    transaction?.status,
    transactionError,
    transactionLoaded,
  ]);

  const handleFinish = useCallback(() => {
    dispatch(resetOrder());
    dispatch(resetTransaction());
    dispatch(clearPaymentData());
    dispatch(clearTermsAndPrivacy());
    cancelProcess();
  }, [cancelProcess, dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(setTransactionModalMessage(""));
    dispatch(resetTransaction());
    dispatch(clearTermsAndPrivacy());
    closeTransactionModal();
    openCheckoutModal();
  }, [closeTransactionModal, dispatch, openCheckoutModal]);

  return {
    transactionModalMessage,
    handleFinish,
    handleRetry,
    transaction
  };
};
