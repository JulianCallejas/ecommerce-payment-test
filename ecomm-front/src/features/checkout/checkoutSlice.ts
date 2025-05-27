import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Customer, type PaymentData, type Address } from '../../types';

export interface CheckoutState {
  customer: Customer | null;
  paymentData: PaymentData | null;
  address: Address | null;
  termsAccepted: string | null;
  privacyAccepted: string | null;
  isModalOpen: boolean;
}

const initialState: CheckoutState = {
  customer: null,
  paymentData: null,
  address: null,
  termsAccepted: null,
  privacyAccepted: null,
  isModalOpen: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCustomer: (state, action: PayloadAction<Customer>) => {
      state.customer = action.payload;
    },
    setPaymentData: (state, action: PayloadAction<PaymentData>) => {
      state.paymentData = action.payload;
    },
    setAddress: (state, action: PayloadAction<Address>) => {
      state.address = action.payload;
    },
    setTermsAccepted: (state, action: PayloadAction<string>) => {
      state.termsAccepted = action.payload;
    },
    setPrivacyAccepted: (state, action: PayloadAction<string>) => {
      state.privacyAccepted = action.payload;
    },
    openCheckoutModal: (state) => {
      state.isModalOpen = true;
    },
    closeCheckoutModal: (state) => {
      state.isModalOpen = false;
    },
    resetCheckout: () => initialState,
    // Special reducer to clear only payment data (sensitive info)
    clearPaymentData: (state) => {
      state.paymentData = null;
    },
    // Set checkout
    setCheckoutData: (
      state,
      action: PayloadAction<{
        customer: Customer;
        paymentData: PaymentData;
        address: Address;
        termsAccepted: string;
        privacyAccepted: string;
      }>
    ) => {
      const { customer, paymentData, address, termsAccepted, privacyAccepted } = action.payload;
      state.customer = customer;
      state.paymentData = paymentData;
      state.address = address;
      state.termsAccepted = termsAccepted;
      state.privacyAccepted = privacyAccepted;
    },
  },
});

export const {
  setCustomer,
  setPaymentData,
  setAddress,
  setTermsAccepted,
  setPrivacyAccepted,
  openCheckoutModal,
  closeCheckoutModal,
  resetCheckout,
  clearPaymentData,
  setCheckoutData,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;