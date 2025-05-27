import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  IconButton,
  Card,
} from "@mui/material";
import { X } from "lucide-react";
import { type AppDispatch, type RootState } from "../../store";
import {
  closeCheckoutModal,
  setAddress,
  setCustomer,
  setPaymentData,
} from "./checkoutSlice";
import CustomerInfoForm from "./forms/CustomerInfoForm";
import { FormProvider } from "react-hook-form";
import { useCheckoutContextForms, useToast, type ITermsFormData } from "../../hooks";
import type { Address, Customer, OrderConfirmRequest, PaymentData } from "../../types";
import PaymentDataForm from "./forms/PaymentDataForm";
import ShippingAddressForm from "./forms/ShippingAddressForm";
import TermsAndPrivacyForm from "./forms/TermsAndPrivacyForm";
import apiService from "../../services/api";

const steps = [
  "Informacón Personal",
  "Tarjeta de Crédito",
  "Datos de Envío",
  "Confirmación",
];

const checkoutFormDataMap: Record<number, string> = {
  0: "customer",
  1: "paymentData",
  2: "address",
};

const CheckoutModal: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const { Toast, showToast } = useToast();

  const isOpen = useSelector((state: RootState) => state.checkout.isModalOpen);
  const { customer, paymentData, address, quantity, productId } = useSelector(
    (state: RootState) => state.checkout
  );
 
  const [activeStep, setActiveStep] = useState(0);
  
  const {
    formContextMap,
    customerFormContext,
    paymentFormContext,
    shippingFormContext,
    termsFormContext,
  } = useCheckoutContextForms({
    customer,
    paymentData,
    address,
  });

  const [termsAccepted, privacyAccepted] = termsFormContext.watch([
    "termsAccepted",
    "privacyAccepted",
  ]);
  const areTermsAccepted = termsAccepted && privacyAccepted;

  const handleClose = () => {
    dispatch(closeCheckoutModal());
    setActiveStep(0);
  };

  const handleNext = async () => {
    if (!(await formContextMap[activeStep].trigger())) return;
    updateFormSection(checkoutFormDataMap[activeStep]);

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {

    if (!productId || !customer || !address || !paymentData || !quantity ) return;
    
    const orderConfirmRequest: OrderConfirmRequest = {
      productId,
      quantity,
      customer : {
        fullname: customer.fullname,
        email: customer.email,
        customerId: `${customer.personalIdType}${customer.personalIdNumber}`,
      },
      address: {
        ...address,
        postalCode: address.postalCode ? address.postalCode : undefined,
        addressLine2: address.addressLine2 ? address.addressLine2 : undefined,
        
      },
    };


    try {
      const orderConfirmationResponse = await apiService.confirmOrder(orderConfirmRequest);
      showToast("Datos recibidos", "success");
      console.log(orderConfirmationResponse);
    } catch (error) {
      console.error(error);
      showToast("Verifique los datos ingresados e intente nuevamente", "error");
    }




    
    // Confirm order
    // Close modal and navigate to summary page

    // dispatch(closeCheckoutModal());
    //navigate("/summary");
  };

  const updateGlobalState = (
    section: string,
    data: Customer | PaymentData | Address | ITermsFormData
  ) => {
    switch (section) {
      case "customer":
        dispatch(setCustomer(data as Customer));
        break;
      case "paymentData":
        dispatch(setPaymentData(data as PaymentData));
        break;
      case "address":
        dispatch(setAddress(data as Address));
        break;
      default:
        break;
    }
  };

  const updateFormSection = async (section: string) => {
    const data = await formContextMap[activeStep].getValues();
    updateGlobalState(section, data);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="checkout-modal-title"
    >
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Box className="p-6 h-full ">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h5" component="h2" id="checkout-modal-title">
              Checkout
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <X className="h-5 w-5" />
            </IconButton>
          </Box>

          <Stepper
            activeStep={activeStep}
            className="mb-8 max-w-full overflow-x-auto !items-start md:!items-center"
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel className="text-center flex flex-col items-center gap-1 md:flex-row md:gap-0 ">
                  <span className="text-xs text-center">{label}</span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper className="p-4 mb-6 max-h-[calc(80vh-200px)] overflow-y-auto">
            {activeStep === 0 && (
              <FormProvider {...customerFormContext}>
                <CustomerInfoForm />
              </FormProvider>
            )}
            {activeStep === 1 && (
              <FormProvider {...paymentFormContext}>
                <PaymentDataForm />
              </FormProvider>
            )}
            {activeStep === 2 && (
              <FormProvider {...shippingFormContext}>
                <ShippingAddressForm />
              </FormProvider>
            )}
            {activeStep === 3 && (
              <FormProvider {...termsFormContext}>
                <TermsAndPrivacyForm />
              </FormProvider>
            )}
          </Paper>

          <Box className="flex justify-between">
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? handleClose : handleBack}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1 && !areTermsAccepted}
            >
              {activeStep === steps.length - 1 ? "Confirm" : "Next"}
            </Button>
          </Box>
        </Box>
      <Toast />
      </Card>
    </Modal>
  );
};

export default CheckoutModal;

