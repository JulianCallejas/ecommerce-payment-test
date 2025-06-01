//const SummaryBackdrop = () => {

import { useSelector } from "react-redux";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  Box,
  Backdrop,
  IconButton,
} from "@mui/material";
import {  CreditCard, CircleX, CaptionsOff } from "lucide-react";
import { type RootState } from "../../store";
import OrderTotals from "../../components/OrderTotals";
import { useNotifications } from "@toolpad/core/useNotifications";

import { useSummary } from "../../hooks";

const SummaryBackdrop: React.FC = () => {
   
   const { isSummaryOpen } = useSelector((state: RootState) => state.purchaseStageState);
   const { summary, title, hasPaymentData, isProcessingPayment, canStartpaymentProcess, openCheckoutModal, cancelSummary, startPaymentProcess } = useSummary();
   const notifications = useNotifications();

  const PaymentButtons = () => {
    return (
      <>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CreditCard />}
          fullWidth
          size="large"
          onClick={startPaymentProcess}
          disabled={!canStartpaymentProcess || isProcessingPayment}
        >
          Pay Now
        </Button>

        <Button
          variant="outlined"
          startIcon={<CaptionsOff />}
          fullWidth
          onClick={cancelSummary}
          disabled={isProcessingPayment}
        >
          Cancel Order
        </Button>
      </>
    );
  };

  if (!summary || !title || !hasPaymentData) {
    notifications.show("Verifica nuevamenete los datos", {severity: "warning", autoHideDuration: 6000});
    openCheckoutModal();
    return null;
  }

  return (
    <Backdrop open={isSummaryOpen} sx={{ zIndex: 100 }}>
      <Paper className="max-w-5xl w-full mx-auto max-h-[95vh] overflow-auto">
        <Box className="w-full flex justify-between items-start mt-11 md:mt-0">
          <Typography variant="h5" component="h1" className="mb-6 px-3 pt-6">
            Resumen de la orden
          </Typography>
          <IconButton onClick={cancelSummary} size="small" disabled={isProcessingPayment}>
            <CircleX />
          </IconButton>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <div className="flex items-start md:items-center mb-6">
                  <div className="w-16 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src={summary.product.images[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Divider
                    className="my-2 "
                    variant="fullWidth"
                    sx={{ borderColor: "#172B3C" }}
                  />
                  <div>
                    <Typography variant="h6">{title}</Typography>
                    <div className="md:hidden">
                      <OrderTotals />
                    </div>
                  </div>
                </div>

                <Box className="flex justify-between items-center gap-4 pb-8 md:hidden flex-row-reverse ">
                  <PaymentButtons />
                </Box>

                <Divider className="my-4" />
                <div className="space-y-4 mt-5">
                  <Paper variant="outlined" className="p-3">
                    <Typography className="mb-2" sx={{ fontWeight: 600 }}>
                      Información de Envío
                    </Typography>
                    <Grid container spacing={1} className="mt-5">
                      <Grid size={{ xs: 5, sm: 4 }}>
                        <Typography variant="body2">Dirección</Typography>
                      </Grid>
                      <Grid
                        size={{ xs: 7, sm: 8 }}
                        sx={{ display: "flex", flexDirection: "column" }}
                      >
                        <Typography variant="body2">
                          {summary.address.addressLine1}
                        </Typography>
                        <Typography variant="body2">
                          {summary.address.addressLine2}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 5, sm: 4 }}>
                        <Typography variant="body2">Teléfono</Typography>
                      </Grid>
                      <Grid size={{ xs: 7, sm: 8 }}>
                        <Typography variant="body2">
                          {summary.address.phoneNumber}
                        </Typography>
                      </Grid>

                      {summary.address.contactName && (
                        <>
                          <Grid size={{ xs: 5, sm: 4 }}>
                            <Typography variant="body2">Contacto</Typography>
                          </Grid>
                          <Grid size={{ xs: 7, sm: 8 }}>
                            <Typography variant="body2">
                              {summary.address.contactName}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      <Grid size={{ xs: 5, sm: 4 }}>
                        <Typography variant="body2">Ciudad</Typography>
                      </Grid>
                      <Grid size={{ xs: 7, sm: 8 }}>
                        <Typography variant="body2">
                          {summary.address.city}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 5, sm: 4 }}>
                        <Typography variant="body2">Departamento</Typography>
                      </Grid>
                      <Grid size={{ xs: 7, sm: 8 }}>
                        <Typography variant="body2">
                          {summary.address.region}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 5, sm: 4 }}>
                        <Typography variant="body2">Código Postal</Typography>
                      </Grid>
                      <Grid size={{ xs: 7, sm: 8 }}>
                        <Typography variant="body2">
                          {summary.address.postalCode}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} className="hidden md:block">
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Detalles de la orden
                </Typography>

                <OrderTotals />

                <Box className="mt-6 space-y-3">
                  <PaymentButtons />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      {/* <TransactionStatusModal isOpen={statusModalOpen && openBackdrop} /> */}
    </Backdrop>
  );
};

export default SummaryBackdrop;
