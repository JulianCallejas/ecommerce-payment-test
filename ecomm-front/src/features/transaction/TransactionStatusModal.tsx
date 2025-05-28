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
import { useNotifications } from "@toolpad/core/useNotifications";
import TransactionPendingMessage from "./TransactionPendingMessage";
import TransactionApprovedMessage from "./TransactionApprovedMessage";
import TransactionRejectedMessage from "./TransactionRejectedMessage";
import OrderErrorMessage from "./OrderErrorMessage";
import TransactionErrorMessage from "./TransactionErrorMessage";

// Polling interval in milliseconds
// const POLLING_INTERVAL = 1000;

interface Props {
  isOpen: boolean;
}

const TransactionStatusModal: React.FC<Props> = ({ isOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useNotifications();

  const {data: transaction, error: transactionError} = useSelector((state: RootState) => state.transaction);
  const polling = useSelector((state: RootState) => state.transaction.polling);
  const { data: order, error: orderError } = useSelector(
    (state: RootState) => state.order
  );
  const product = useSelector((state: RootState) => state.product.data);

  //   const isOpen = !!transaction;

  //   // Poll transaction status if needed
  //   useEffect(() => {
  //     let intervalId: number;

  //     if (transaction && polling && transaction.status === 'PENDING') {
  //       intervalId = window.setInterval(() => {
  //         dispatch(pollTransaction(transaction.id));
  //       }, POLLING_INTERVAL);
  //     }

  //     return () => {
  //       if (intervalId) {
  //         clearInterval(intervalId);
  //       }
  //     };
  //   }, [dispatch, transaction, polling]);

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

  console.log(transaction?.status);
  console.log(transaction?.status);


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
          {!transaction && orderError  && (
            <OrderErrorMessage handleFinish={handleFinish} />
          )}
          {
            transactionError && <TransactionErrorMessage handleFinish={handleFinish} handleRetry={handleRetry} />
          }
        </Paper>
      </Fade>
    </Modal>
  );
};

export default TransactionStatusModal;
