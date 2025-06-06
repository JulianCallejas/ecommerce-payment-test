import { useSelector } from "react-redux";
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
  CircularProgress,
} from "@mui/material";
import { X } from "lucide-react";
import { type RootState } from "../../store";
import CustomerInfoForm from "./forms/CustomerInfoForm";
import { FormProvider } from "react-hook-form";
import { useCheckout } from "../../hooks";
import PaymentDataForm from "./forms/PaymentDataForm";
import ShippingAddressForm from "./forms/ShippingAddressForm";
import TermsAndPrivacyForm from "./forms/TermsAndPrivacyForm";

const CheckoutModal: React.FC = () => {
  const {
    isProcessingSummary,
    activeStep,
    termsFormContext,
    areTermsAccepted,
    hasAcceptTokens,
    customerFormContext,
    paymentFormContext,
    shippingFormContext,
    steps,
    handleCloseModal,
    handleNext,
    handleBack,
  } = useCheckout();

  const isOpen = useSelector(
    (state: RootState) => state.purchaseStageState.isCheckoutModalOpen
  );

  return (
    <Modal open={isOpen} aria-labelledby="checkout-modal-title" data-testid="checkout-modal" >
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Box className="p-6 h-full ">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h5" component="h2" id="checkout-modal-title">
              Checkout
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
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
              onClick={activeStep === 0 ? handleCloseModal : handleBack}
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={
                activeStep === steps.length - 1 &&
                (!areTermsAccepted || isProcessingSummary || !hasAcceptTokens)
              }
            >
              {activeStep === steps.length - 1 ? "Confirm" : "Next"}
              {isProcessingSummary && (
                <CircularProgress size={24} className="ml-2" color="inherit" />
              )}
            </Button>
          </Box>
        </Box>
      </Card>
    </Modal>
  );
};

export default CheckoutModal;
