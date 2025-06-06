import { useCallback, useEffect, useState } from "react";
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
import {
  clearPaymentData,
  clearTermsAndPrivacy,
} from "../features/checkout/checkoutSlice";
import { setTransactionModalMessage } from "../features/purchase/purchaseStageSlice";
import { fetchProduct } from "../features/product/productSlice";

export const useTransaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { closeTransactionModal, openCheckoutModal, cancelProcess } =
    usePurchaseProcess();
  const { data: order } = useSelector((state: RootState) => state.order);
  const summary = useSelector((state: RootState) => state.summary.data);
  const {
    data: transaction,
    loaded: transactionLoaded,
    error: transactionError,
  } = useSelector((state: RootState) => state.transaction);
  const slug = useSelector((state: RootState) => state.product.data?.slug);
  const { paymentData, privacyAccepted, termsAccepted, customer } = useSelector(
    (state: RootState) => state.checkout
  );
  const notifications = useNotifications();
  const [placeTransactionCounter, setPlaceTransactionCounter] = useState(0);

  const canCreateTransaction =
    !!paymentData?.cardNumber &&
    !!termsAccepted &&
    !!privacyAccepted &&
    !!summary?.baseAmount &&
    !!summary?.deliveryFee;

  const { transactionModalMessage } = useSelector(
    (state: RootState) => state.purchaseStageState
  );

  const retakeTransaction = useCallback(async () => {
    notifications.show("Retomando el pago", {
      severity: "info",
      autoHideDuration: 6000,
    });
    const body: TransactionCreateRequest = {
      orderId: order!.id,
      totalAmount: summary!.baseAmount + summary!.deliveryFee,
      payment: {
        cardHolder: customer?.fullname || "cardHolder",
        cardNumber: "1111111111111111",
        cvc: "000",
        expMonth: "12",
        expYear: new Date().getFullYear().toString().slice(-2),
        installments: 12,
        acceptanceToken: "termsToken",
        acceptPersonalAuth: "privacyToken",
      },
    };
    // 5 seconds while the intial transaction is created
    await new Promise((resolve) => setTimeout(resolve, 5000));
    dispatch(createTransaction(body));
  }, [customer?.fullname, dispatch, notifications, order, summary]);

  const placeTransaction = useCallback(async () => {
    // Transaction completed, no need to place again
    if (
      transactionError ||
      transactionModalMessage === "transaction-approved" ||
      transaction?.status === "APPROVED"
    ) {
      return;
    }

    // Transaction pending, polling status
    if (transaction?.status === "PENDING") {
      dispatch(pollTransaction(transaction?.transactionId));
      return;
    }

    // Order created, but no data for transaction, go to checkout
    if (
      !canCreateTransaction &&
      !transaction?.transactionId &&
      transactionModalMessage === "creating-order"
    ) {
      notifications.show("Confirme los datos de pago para continuar", {
        severity: "warning",
        autoHideDuration: 6000,
      });
      closeTransactionModal();
      openCheckoutModal();
    }

    setPlaceTransactionCounter((prevState) => prevState + 1);

    // Transaction created, retaking process
    if (
      !canCreateTransaction &&
      !transaction?.transactionId &&
      transactionModalMessage === "creating-transaction"
    ) {
      await retakeTransaction();
      return;
    }

    // Create Transaction
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
  }, [
    transactionError,
    transactionModalMessage,
    transaction?.status,
    transaction?.transactionId,
    canCreateTransaction,
    order,
    summary,
    paymentData,
    termsAccepted,
    privacyAccepted,
    dispatch,
    notifications,
    closeTransactionModal,
    openCheckoutModal,
    retakeTransaction,
  ]);

  useEffect(() => {
    if (!order?.id || transaction?.status || placeTransactionCounter) return;
    placeTransaction();
  }, [
    order?.id,
    placeTransaction,
    placeTransactionCounter,
    transaction?.status,
  ]);

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
    if (!slug) return;
    dispatch(fetchProduct(slug));
  }, [cancelProcess, dispatch, slug]);

  const handleRetry = useCallback(() => {
    dispatch(setTransactionModalMessage(""));
    dispatch(resetTransaction());
    dispatch(clearTermsAndPrivacy());
    closeTransactionModal();
    openCheckoutModal();
    if (!slug) return;
    dispatch(fetchProduct(slug));
  }, [closeTransactionModal, dispatch, openCheckoutModal, slug]);

  return {
    transactionModalMessage,
    transaction,
    handleFinish,
    handleRetry,
  };
};
