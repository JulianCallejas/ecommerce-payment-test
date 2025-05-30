//const SummaryBackdrop = () => {

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { ShoppingBag, CreditCard, CircleX } from "lucide-react";
import { type AppDispatch, type RootState } from "../../store";
import { closeSummary, resetSummary, selectTotalAmount } from "./summarySlice";
import OrderTotals from "../../components/OrderTotals";
import type { OrderCreateRequest, OrderResponse } from "../../types";
import { createOrder, setOrder, setOrderError } from "../order/orderSlice";
import { createTransaction, setPolling, setTransaction, setTransactionError } from "../transaction/transactionSlice";
import { useNotifications } from "@toolpad/core/useNotifications";
import TransactionStatusModal from "../transaction/TransactionStatusModal";
import apiService from "../../services/api";
import { openCheckoutModal } from "../checkout/checkoutSlice";
import { AxiosError } from "axios";

const SummaryBackdrop: React.FC = () => {
 
  const dispatch = useDispatch<AppDispatch>();

  const { loaded: orderLoaded, data: order, error: orderError } = useSelector(
    (state: RootState) => state.order
  );
  const {data: transaction, error: transactionError, loading, loaded: transactionLoaded, polling } = useSelector((state: RootState) => state.transaction);
  const summary = useSelector((state: RootState) => state.summary.data);
  const open = useSelector((state: RootState) => state.summary.open);
  const title = useSelector((state: RootState) => state.product.data?.name);
  const { customer, paymentData, termsAccepted, privacyAccepted } = useSelector(
    (state: RootState) => state.checkout
  );
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const notifications = useNotifications();

  const totalAmount = useSelector(selectTotalAmount);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  //Block if missed data
  const openBackdrop = !!open && !!paymentData && !!termsAccepted && !!privacyAccepted;
  
  
  // trigger transaction
  // useEffect(() => {
  //   if (orderError) {
  //       console.log(orderError);
  //       notifications.show("order error", {severity: "error"});
  //   }
    
  //   if (!order || !termsAccepted || !privacyAccepted || transaction || !paymentData) return;

  //   setStatusModalOpen(true);
  //   const transactionBody = {
  //     orderId: order.id,
  //     totalAmount: totalAmount,
  //     payment: {
  //       ...paymentData,
  //       acceptanceToken: termsAccepted,
  //       acceptPersonalAuth: privacyAccepted,
  //     },
  //   };

  //   dispatch(createTransaction(transactionBody));
  //   console.log(transactionBody);
  // }, [orderLoaded, order, paymentData, privacyAccepted, termsAccepted, totalAmount]);

  const handleCloseBackdrop = () => {
    if (paymentProcessing) return;
    dispatch(closeSummary());
  };

  const handleCancel = () => {
    dispatch(resetSummary());
    handleCloseBackdrop();
  };


  const pollingTransaction = async () => {
    if (!transaction || !polling) return;
    if (transaction.status !== "PENDING") {
      dispatch(setPolling(false));
      return 
    };

    try {
      const newTransaction = await apiService.getTransaction(transaction.id);
      if (newTransaction.status === "PENDING") {
        await pollingTransaction();
      }
      dispatch(setTransaction(newTransaction));
      dispatch(setPolling(false));
    } catch (error) {
      console.log("polling", error);
      if (error instanceof Error) {
        console.log(error.message);
      }
    }

  }

  const paymentProcess = async (newOrder?: OrderResponse ) =>{
    if (!order && !newOrder) return;
    setStatusModalOpen(true);
    if ( transaction?.id ) {
      await pollingTransaction();
      return;
    }
    if ( !paymentData || !termsAccepted || !privacyAccepted) {
      setStatusModalOpen(false);
      dispatch(closeSummary());
      dispatch(openCheckoutModal());
      notifications.show("Verifica nuevamenete los datos", {severity: "warning"});
      return;
    };
    const transactionBody = {
      orderId: order?.id || newOrder?.id || "",
      totalAmount: totalAmount,
      payment: {
        ...paymentData,
        acceptanceToken: termsAccepted,
        acceptPersonalAuth: privacyAccepted,
      },
    };
    try {
      const newTransaction = await apiService.createTransaction(transactionBody);
      dispatch(setTransaction(newTransaction));
    } catch (error) {
      console.log("new Transa", error);
      if (error instanceof AxiosError ) {
       console.log(error.message);
       if (error.response?.data.message.includes("Payment rejected")){
         dispatch(setTransactionError(error.message));
         return;
       }
       if (error.response?.data.message.includes("already paid")){
         const transactionId = error.response?.data.message.split(" ")[5];
         const newTransaction = await apiService.getTransaction(transactionId);
         dispatch(setTransaction(newTransaction));
         return;
       }
      }
      dispatch(setOrderError("No Transaction try again"))
    }

  }

  const handlePay = async () => {
    if (!summary || !paymentData) return;
    setPaymentProcessing(true);
    setStatusModalOpen(true);
    if (order) {
      await paymentProcess();
      return;
    };
    const orderBody: OrderCreateRequest = {
      productId: summary.product.id,
      quantity: summary.quantity,
      customer: {
        fullname: summary.customer.fullname,
        email: summary.customer.email,
        customerId: `${customer?.personalIdType}${customer?.personalIdNumber}`,
      },
      address: {
        ...summary.address,
        postalCode: summary.address.postalCode
          ? summary.address.postalCode
          : "000000",
        addressLine2: summary.address.addressLine2
          ? summary.address.addressLine2
          : "",
      },
      baseAmount: summary.baseAmount,
      deliveryFee: summary.deliveryFee,
    };
    //dispatch(createOrder(orderBody));

    try {
      const newOrder = await apiService.createOrder(orderBody);
      dispatch(setOrder(newOrder));
      await paymentProcess(newOrder);
    } catch (error) {
      console.log("crea orden",error);
      if (error instanceof Error) {
        console.log(error.message);
      }
      dispatch(setOrderError("No order try again"))
      
    }

    //TODO PAYMENT PROCESS
  };

  if (!summary || !paymentData) {
    handleCancel();
    return null;
  }

  const PaymentButtons = () => {
    return (
      <>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CreditCard />}
          fullWidth
          size="large"
          onClick={handlePay}
          disabled={paymentProcessing}
        >
          Pay Now
        </Button>

        <Button
          variant="outlined"
          startIcon={<ShoppingBag />}
          fullWidth
          onClick={handleCancel}
          disabled={paymentProcessing}
        >
          Cancel Order
        </Button>
      </>
    );
  };

  return (
    <Backdrop open={openBackdrop} sx={{ zIndex: 100 }}>
      <Paper className="max-w-5xl w-full mx-auto max-h-[95vh] overflow-auto">
        <Box className="w-full flex justify-between items-start mt-11 md:mt-0">
          <Typography variant="h5" component="h1" className="mb-6 px-3 pt-6">
            Resumen de la orden
          </Typography>
          <IconButton onClick={handleCancel} size="small">
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

                <Box className="flex justify-between items-center gap-4 pb-8 md:hidden ">
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
