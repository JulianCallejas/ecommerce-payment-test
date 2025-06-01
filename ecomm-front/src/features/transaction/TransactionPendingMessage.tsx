import { Box, CircularProgress, Typography } from "@mui/material";
import { currencyFormatter } from "../../utils";
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
          <Typography variant="body2" className="text-gray-700">
            Orden de compra: {transaction.orderId}
          </Typography>

          <Typography variant="body2" className="text-gray-700">
            Transaction ID: {transaction.id}
          </Typography>

          <Typography variant="body2" className="text-gray-700">
            Valor: {currencyFormatter(transaction.totalAmount)}
          </Typography>

          <Typography variant="body2" className="text-gray-700">
            Estado: {transaction.status}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default TransactionPendingMessage;
