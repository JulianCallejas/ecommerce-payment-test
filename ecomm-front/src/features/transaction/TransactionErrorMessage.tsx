import { Box, Button, Typography } from "@mui/material";
import { AlertCircle } from "lucide-react";

interface Props {
  handleFinish: () => void;
  handleRetry: () => void;
}

const TransactionErrorMessage = ({ handleFinish, handleRetry }: Props) => {
  return (
    <Box className="text-center space-y-4">
      <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />

      <Typography variant="h5" id="transaction-status-modal-title">
        Pago rechazado
      </Typography>

      <Typography variant="body1" className="text-gray-800">
        Tu orden no pudo ser procesada, por favor intenta nuevamente.
      </Typography>

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

export default TransactionErrorMessage;
