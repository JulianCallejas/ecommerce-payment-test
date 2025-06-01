import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type OrderConfirmationResponse } from '../../types';
import { type RootState } from '../../store';

export interface SummaryState {
  data: OrderConfirmationResponse | null;
}

const initialState: SummaryState = {
  data: null,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummary: (state, action: PayloadAction<OrderConfirmationResponse>) => {
      state.data = action.payload;
    },
    resetSummary: () => initialState,
  },
});

export const { setSummary, resetSummary } = summarySlice.actions;

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