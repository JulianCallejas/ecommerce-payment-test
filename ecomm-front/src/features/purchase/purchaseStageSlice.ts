import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type PurchaseStageOptions =
  | "checkout"
  | "summary"
  | "order-placed"
  | "transaction-created"
  | "";

export interface PurchaseStageState {
  stage: PurchaseStageOptions;
  isCheckoutModalOpen: boolean;
  isSummaryOpen: boolean;
  isTransactionStatusModalOpen: boolean;
}

const initialState: PurchaseStageState = {
  stage: "",
  isCheckoutModalOpen: false,
  isSummaryOpen: false,
  isTransactionStatusModalOpen: false,
};

// PurchaseStageState slice
const purchaseStageSlice = createSlice({
  name: "purchaseStageState",
  initialState,
  reducers: {
    resetPurchaseStage: () => initialState,

    setPurchaseStage: (state, action: PayloadAction<PurchaseStageOptions>) => {
      state.stage = action.payload;
    },

    setIsCheckoutModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCheckoutModalOpen = action.payload;
    },

    setIsSummaryOpen: (state, action: PayloadAction<boolean>) => {
      state.isSummaryOpen = action.payload;
    },

    setIsTransactionStatusModalOpen: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isTransactionStatusModalOpen = action.payload;
    },
  },
});

export const {
  resetPurchaseStage,
  setPurchaseStage,
  setIsCheckoutModalOpen,
  setIsSummaryOpen,
  setIsTransactionStatusModalOpen,
} = purchaseStageSlice.actions;
export default purchaseStageSlice.reducer;
