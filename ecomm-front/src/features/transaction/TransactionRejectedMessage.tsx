import { Box, Button, Typography } from "@mui/material";
import { Ban } from "lucide-react";
import { currencyFormatter, getShortId } from "../../utils";
import type { TransactionResponse } from "../../types";

interface Props {
  transaction: TransactionResponse | null;
  handleRetry: () => void;
  handleFinish: () => void;
}

const TransactionRejectedMessage = ({
  transaction,
  handleFinish,
  handleRetry,
}: Props) => {
  return (
    <Box className="text-center space-y-4">
      <Ban className="h-16 w-16 text-red-600 mx-auto" />

      <Typography variant="h5" id="transaction-status-modal-title">
        Pago rechazado
      </Typography>

      {transaction && (
        <>
          <Typography variant="body2" className="text-gray-700">
            Con esta orden de compra puedes intentar realizar el pago de
            nuevamente, solo debes confirmar los datos de pago.
          </Typography>

          <Typography variant="body1" component="p" className="text-gray-700">
            Orden de compra: <strong>{getShortId(transaction.orderId)}</strong>
          </Typography>

          <Typography variant="body1" component="p" className="text-gray-700">
            Transacción:{" "}
            <strong>{getShortId(transaction.transactionId)}</strong>
          </Typography>

          <Typography variant="body1" component="p" className="text-gray-700">
            Valor: <strong>{currencyFormatter(transaction.amount)}</strong>
          </Typography>

          <Typography variant="body1" component="p" className="text-red-600">
            Estado: <strong>{transaction.status}</strong>
          </Typography>

          <Typography variant="body1" component="p" className="text-gray-700">
            {transaction &&
              new Date(transaction.createdAt).toLocaleDateString()}
          </Typography>
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleRetry}
        className="mt-4"
      >
        Intentar de nuevo
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleFinish}
        className="mt-4"
      >
        Cancelar
      </Button>
    </Box>
  );
};

export default TransactionRejectedMessage;
