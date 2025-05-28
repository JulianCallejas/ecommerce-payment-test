import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type OrderConfirmationResponse } from '../../types';
import { type RootState } from '../../store';

export interface SummaryState {
  data: OrderConfirmationResponse | null;
  loading: boolean;
  error: string | null;
  open: boolean;
}

const initialState: SummaryState = {
  data: null,
  loading: false,
  error: null,
  open: false,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummary: (state, action: PayloadAction<OrderConfirmationResponse>) => {
      state.data = action.payload;
    },
    resetSummary: () => initialState,
    openSummary: (state) => {
      state.open = true;
    },
    closeSummary: (state) => {
      state.open = false;
    },
  },
});

export const { setSummary, resetSummary, openSummary, closeSummary } = summarySlice.actions;

// Selector to calculate total amount
export const selectTotalAmount = (state: RootState) => {
  const summary = state.summary.data;
  if (!summary) return 0;

  return (
    summary.baseAmount +
    summary.deliveryFee
  );
};

export default summarySlice.reducer;