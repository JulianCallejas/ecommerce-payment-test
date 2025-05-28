import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Customer, type PaymentData, type Address } from '../../types';
import wompiService from '../../services/acceptToken';

export interface CheckoutState {
  customer: Customer | null;
  paymentData: PaymentData | null;
  address: Address | null;
  termsAccepted: string | null;
  privacyAccepted: string | null;
  isModalOpen: boolean;
  quantity: number | null;
  productId: string;
}

const initialState: CheckoutState = {
  customer: null,
  paymentData: null,
  address: null,
  termsAccepted: "yes",
  privacyAccepted: "yes",
  isModalOpen: false,
  quantity: 1,
  productId: ""
};

export const fetchAcceptTokens = createAsyncThunk(
  'acceptance/tokens',
  async () => {
    try {
      console.log("Fetching token");
      return await wompiService.getAcceptTokens();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        return ["", ""];
      }
      console.log(error);
      return ["", ""];
    }
  }
);


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
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setProductId: (state, action: PayloadAction<string>) => {
      state.productId = action.payload;
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
        quantity: number;
        productId: string;
      }>
    ) => {
      const { customer, paymentData, address, termsAccepted, privacyAccepted, quantity, productId } = action.payload;
      state.customer = customer;
      state.paymentData = paymentData;
      state.address = address;
      state.termsAccepted = termsAccepted;
      state.privacyAccepted = privacyAccepted;
      state.quantity = quantity;
      state.productId = productId;
    },
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchAcceptTokens.fulfilled, (state, action) => {
          state.termsAccepted = action.payload[0];
          state.privacyAccepted = action.payload[1];
        })
        .addCase(fetchAcceptTokens.rejected, (state) => {
          state.termsAccepted = null;
          state.privacyAccepted = null;
        });
    },
});

export const {
  setCustomer,
  setPaymentData,
  setAddress,
  setTermsAccepted,
  setPrivacyAccepted,
  setQuantity,
  setProductId,
  openCheckoutModal,
  closeCheckoutModal,
  resetCheckout,
  clearPaymentData,
  setCheckoutData,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;