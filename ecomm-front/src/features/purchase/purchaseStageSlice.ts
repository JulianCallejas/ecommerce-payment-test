import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createOrder } from "../order/orderSlice";
import {
  createTransaction,
  pollTransaction,
} from "../transaction/transactionSlice";

export type PurchaseStageOptions =
  | "checkout"
  | "summary"
  | "order-created"
  | "transaction-created"
  | "";

export type TransactionModalMessageOptions =
  | "creating-order"
  | "creating-transaction"
  | "transaction-pending"
  | "order-error"
  | "transaction-error"
  | "transaction-approved"
  | "transaction-rejected"
  | "";

export interface PurchaseStageState {
  stage: PurchaseStageOptions;
  isCheckoutModalOpen: boolean;
  isSummaryOpen: boolean;
  transactionModalMessage: TransactionModalMessageOptions;
}

const initialState: PurchaseStageState = {
  stage: "",
  isCheckoutModalOpen: false,
  isSummaryOpen: false,
  transactionModalMessage: "",
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

    setTransactionModalMessage: (
      state,
      action: PayloadAction<TransactionModalMessageOptions>
    ) => {
      state.transactionModalMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        // Update stage when order is created
        state.transactionModalMessage = "creating-order";
      })
      .addCase(createOrder.fulfilled, (state) => {
        // Update stage when order is created
        state.stage = "order-created";
      })
      .addCase(createOrder.rejected, (state) => {
        // Update stage when order is created
        state.transactionModalMessage = "order-error";
      })

      .addCase(createTransaction.pending, (state) => {
        // Update stage when order is created
        state.transactionModalMessage = "creating-transaction";
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        // Update stage when order is created
        state.stage = "transaction-created";
        switch (action.payload.status) {
          case "PENDING":
            state.transactionModalMessage = "transaction-pending";
            break;
          case "APPROVED":
            state.transactionModalMessage = "transaction-approved";
            break;
          default:
            state.transactionModalMessage = "transaction-rejected";
            break;
        }
      })
      .addCase(createTransaction.rejected, (state) => {
        // Update stage when order is created
        state.transactionModalMessage = "transaction-rejected";
      })
      .addCase(pollTransaction.fulfilled, (state, action) => {
        switch (action.payload.status) {
          case "PENDING":
            state.transactionModalMessage = "transaction-pending";
            break;
          case "APPROVED":
            state.transactionModalMessage = "transaction-approved";
            break;
          default:
            state.transactionModalMessage = "transaction-rejected";
            break;
        }
      })
      .addCase(pollTransaction.rejected, (state, action) => {
        // Update stage when order is created
        if ((action.payload as string).includes("rejected")){
          state.transactionModalMessage = "transaction-rejected";
          return;
        }
        state.transactionModalMessage = "transaction-error";
      })
  },
});

export const {
  resetPurchaseStage,
  setPurchaseStage,
  setIsCheckoutModalOpen,
  setIsSummaryOpen,
  setTransactionModalMessage,
} = purchaseStageSlice.actions;
export default purchaseStageSlice.reducer;
