import {
  Modal,
  Typography,
  Paper,
  CircularProgress,
  Fade,
} from "@mui/material";
import OrderErrorMessage from "./OrderErrorMessage";
import { useTransaction } from "../../hooks";
import TransactionErrorMessage from "./TransactionErrorMessage";
import TransactionPendingMessage from "./TransactionPendingMessage";
import TransactionApprovedMessage from "./TransactionApprovedMessage";
import TransactionRejectedMessage from "./TransactionRejectedMessage";

const TransactionStatusModal = () => {

  const { transactionModalMessage, handleFinish, handleRetry } = useTransaction();
   

  if (!transactionModalMessage) {
    return null;
  }

  console.log({transactionModalMessage});

  return (
    <Modal
      open={!!transactionModalMessage}
      aria-labelledby="transaction-status-modal-title"
      closeAfterTransition
    >
      <Fade in={!!transactionModalMessage}>
        <Paper className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-lg">
          {transactionModalMessage === "creating-order" && (
            <div className="w-full h-full flex justify-center items-center flex-col">
              <CircularProgress size={60} className="text-[#172B3C]" />
              <Typography variant="h5" id="transaction-status-modal-title">
                Procesando la Orden.
              </Typography>

              <button onClick={handleRetry} >Cancelar</button>
            </div>
          )}

          {transactionModalMessage === "order-error" && (
            <OrderErrorMessage handleFinish={handleFinish} />
          )}

          {transactionModalMessage === "creating-transaction" && (
            <div className="w-full h-full flex justify-center items-center flex-col">
              <CircularProgress size={60} className="text-[#172B3C]" />
              <Typography variant="h5" id="transaction-status-modal-title">
                Procesando el pago.
              </Typography>
            </div>
          )}

          {transactionModalMessage === "transaction-error" && (
            <TransactionErrorMessage
              handleFinish={handleFinish}
              handleRetry={handleRetry}
            />
          )}

          {transactionModalMessage === "transaction-pending" && (
            <TransactionPendingMessage />
          )}

          {transactionModalMessage === "transaction-approved" && (
            <TransactionApprovedMessage handleFinish={handleFinish} />
          )}

          {transactionModalMessage === "transaction-rejected" && (
            <TransactionRejectedMessage
              handleRetry={handleRetry}
              handleFinish={handleFinish}
            />
          )}
        </Paper>
      </Fade>
    </Modal>
  );
};

export default TransactionStatusModal;
