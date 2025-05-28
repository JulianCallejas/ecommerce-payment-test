import { Box, Button, Typography } from "@mui/material";
import { AlertCircle } from "lucide-react";

interface Props {
  handleFinish: () => void;
}

const OrderErrorMessage = ({ handleFinish }: Props) => {
  return (
    <Box className="text-center space-y-4">
      <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />

      <Typography variant="h5" id="transaction-status-modal-title">
        Orden rechazada
      </Typography>

      <Typography variant="body1" className="text-gray-800">
        Tu orden no pudo ser procesada, por favor intenta nuevamente.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleFinish}
        className="mt-4"
      >
        Regresar
      </Button>
    </Box>
  );
};

export default OrderErrorMessage;
