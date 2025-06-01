import { Box, CircularProgress, Typography } from "@mui/material";
import { currencyFormatter, getShortId } from "../../utils";
import type { TransactionResponse } from "../../types";

interface Props {
  transaction: TransactionResponse | null;
}
const TransactionPendingMessage = ({ transaction }: Props) => {
  return (
    <Box className="text-center space-y-4">
      <CircularProgress size={60} className="text-[#172B3C]" />

      <Typography variant="h5" id="transaction-status-modal-title">
        Procesando el pago.
      </Typography>

      <Typography variant="body1" className="text-gray-700">
        Por favor espere mientras se procesa su pago. Esto puede tardar unos
        minutos.
      </Typography>

      {transaction && (
        <>
          <Typography variant="body1" className="text-gray-700">
            Orden de compra: <strong>{getShortId(transaction.orderId)}</strong>
          </Typography>

          <Typography variant="body1" className="text-gray-700">
            Transacción: <strong>{getShortId(transaction.transactionId)}</strong>
          </Typography>

          <Typography variant="body1" className="text-gray-700">
            Valor: <strong>{currencyFormatter(transaction.amount)}</strong>
          </Typography>

          <Typography variant="body1" className="text-gray-700">
            Estado: <strong>{transaction.status}</strong>
          </Typography>
        </>
      )}
    </Box>
  );
};

export default TransactionPendingMessage;
