import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Typography,
  Paper,
  CircularProgress,
  Backdrop,
  Fade,
} from "@mui/material";

import type { AppDispatch, RootState } from "../../store";
import { pollTransaction, resetTransaction } from "./transactionSlice";
import { resetOrder } from "../order/orderSlice";
import { closeSummary, resetSummary } from "../summary/summarySlice";
import {
  openCheckoutModal,
  setPrivacyAccepted,
  setTermsAccepted,
} from "../checkout/checkoutSlice";
import { fetchProduct } from "../product/productSlice";
import TransactionPendingMessage from "./TransactionPendingMessage";
import TransactionApprovedMessage from "./TransactionApprovedMessage";
import TransactionRejectedMessage from "./TransactionRejectedMessage";
import OrderErrorMessage from "./OrderErrorMessage";
import TransactionErrorMessage from "./TransactionErrorMessage";



interface Props {
  isOpen: boolean;
}

const TransactionStatusModal: React.FC<Props> = ({ isOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  

  const { data: transaction, error: transactionError, polling, loaded: transactionLoaded } = useSelector(
    (state: RootState) => state.transaction
  );
  
  const { data: order, error: orderError } = useSelector(
    (state: RootState) => state.order
  );
  const product = useSelector((state: RootState) => state.product.data);

  // Poll transaction status if needed
  // useEffect(() => {
  //   if (!transaction || (transaction?.status !== "PENDING" && !polling)) return;
  //   if (transactionLoaded && polling && !transactionError){
  //     console.log("polling");
  //     dispatch(pollTransaction(transaction!.id));
  //   }
    
  // }, [dispatch, transaction, polling, transactionLoaded, transactionError]);

  // Update product stock when transaction completes
  useEffect(() => {
    if (transaction && transaction.status === "APPROVED" && order && product) {
      dispatch(fetchProduct(product.slug));
    }
  }, [dispatch, transaction, order, product]);

  const handleRetry = () => {
    dispatch(resetTransaction());
    dispatch(setTermsAccepted(""));
    dispatch(setPrivacyAccepted(""));
    dispatch(closeSummary());
    dispatch(openCheckoutModal());
  };

  const handleFinish = () => {
    // Reset all state
    dispatch(resetTransaction());
    dispatch(resetOrder());
    dispatch(resetSummary());
    dispatch(closeSummary());

    // Navigate back to product page
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      aria-labelledby="transaction-status-modal-title"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Paper className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-lg">
          {/* Pending state */}
          {transaction?.status === "PENDING" && (
            <TransactionPendingMessage transaction={transaction} />
          )}

          {/* Approved state */}
          {transaction?.status === "APPROVED" && (
            <TransactionApprovedMessage
              transaction={transaction}
              handleFinish={handleFinish}
            />
          )}

          {/* Rejected state */}
          {transaction?.status === "REJECTED" && (
            <TransactionRejectedMessage
              transaction={transaction}
              handleRetry={handleRetry}
              handleFinish={handleFinish}
            />
          )}
          {!transaction && !orderError && !transactionError && (
            <div className="w-full h-full flex justify-center items-center flex-col">
              <CircularProgress size={60} className="text-[#172B3C]" />
              <Typography variant="h5" id="transaction-status-modal-title">
                Procesando el pago.
              </Typography>
            </div>
          )}
          {!transaction && orderError && (
            <OrderErrorMessage handleFinish={handleFinish} />
          )}
          {transactionError && (
            <TransactionErrorMessage
              handleFinish={handleFinish}
              handleRetry={handleRetry}
            />
          )}
        </Paper>
      </Fade>
    </Modal>
  );
};

export default TransactionStatusModal;
