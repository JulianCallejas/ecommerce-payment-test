import { Box, Button, Typography } from "@mui/material";
import { CheckCircle } from "lucide-react";
import type { TransactionResponse } from "../../types";
import { currencyFormatter } from "../../utils";

interface Props {
  transaction: TransactionResponse;
  handleFinish: () => void;
}

const TransactionApprovedMessage = ({ transaction, handleFinish }: Props) => {
  return (
    <Box className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />

      <Typography variant="h5" id="transaction-status-modal-title">
        ¡Pago exitoso!
      </Typography>

      <Typography variant="body1" className="text-gray-800">
        Tu orden ya está en proceso, pronto recibirás un correo de confirmación.
      </Typography>

      <Typography variant="body2" className="text-gray-700">
        Orden de compra: {transaction.orderId}
      </Typography>

      <Typography variant="body2" className="text-gray-700">
        Transaction ID: {transaction.id}
      </Typography>

      <Typography variant="body2" className="text-gray-700">
        Valor: {currencyFormatter(transaction.totalAmount)}
      </Typography>

      <Typography variant="body2" className="text-green-600">
        Estado: {transaction.status}
      </Typography>

      <Typography variant="body2" className="text-gray-700">
        {new Date(transaction.createdAt).toLocaleDateString()}
      </Typography>

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
