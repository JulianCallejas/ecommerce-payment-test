import { Box, Button, Typography } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { currencyFormatter, getShortId } from "../../utils";
import type { TransactionResponse } from "../../types";

interface Props {
  transaction: TransactionResponse | null;
  handleFinish: () => void;
}

const TransactionApprovedMessage = ({ transaction, handleFinish }: Props) => {
  return (
    <Box className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />

      <Typography variant="h5" id="transaction-status-modal-title">
        ¡Pago exitoso!
      </Typography>

      <Typography variant="body1" className="text-gray-800 mb-4">
        Estamos preparando tu compra para el envío, pronto recibirás un correo
        con todos los detalles.
      </Typography>

      {transaction && (
        <>
          <Typography variant="body1" component="p" className="text-gray-700">
            Orden de compra: <strong>{getShortId(transaction.orderId)}</strong>
          </Typography>

          <Typography variant="body1" component="p" className="text-gray-700">
            Transacción: <strong>{getShortId(transaction.transactionId)}</strong>
          </Typography>

          <Typography variant="body1" component="p" className="text-gray-700">
            Valor: <strong>{currencyFormatter(transaction.amount)}</strong>
          </Typography>

          <Typography variant="body1" component="p" className="text-green-600">
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
        onClick={handleFinish}
        className="mt-4"
      >
        Regresar a la tienda
      </Button>
    </Box>
  );
};

export default TransactionApprovedMessage;
