import { Box, Button, Typography } from "@mui/material";
import type { TransactionResponse } from "../../types";
import { AlertCircle } from "lucide-react";
import { currencyFormatter } from "../../utils";

interface Props {
    transaction: TransactionResponse;
    handleRetry: () => void;
    handleFinish: () => void;
}

const TransactionRejectedMessage = ({ transaction, handleFinish, handleRetry }: Props) => {
    return (
        <Box className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />

            <Typography variant="h5" id="transaction-status-modal-title">
                Pago rechazado
            </Typography>

            <Typography variant="body2" className="text-gray-700">
                Con esta orden de compra puedes intentar realizar el pago de nuevamente,
                solo debes confirmar unos datos.
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

            <Typography variant="body2" className="text-red-600">
                Estado: {transaction.status}
            </Typography>

            <Typography variant="body2" className="text-gray-700">
                {new Date(transaction.createdAt).toLocaleDateString()}
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
    )
}

export default TransactionRejectedMessage