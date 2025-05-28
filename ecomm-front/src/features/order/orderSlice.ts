import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { OrderCreateRequest, OrderResponse } from '../../types';
import { type RootState } from '../../store';

export interface OrderState {
  data: OrderResponse | null;
  loaded: boolean;
  error: string | null;
}

const initialState: OrderState = {
  data: null,
  loaded: false,
  error: null,
};

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (request: OrderCreateRequest, { rejectWithValue }) => {
    try {
      return await api.createOrder(request);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<OrderResponse>) => {
      state.data = action.payload;
    },
    resetOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loaded = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loaded = true;
        state.data = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loaded = true;
        state.data = null;
        state.error = action.payload as string;
      });
  },
});

export const { setOrder, resetOrder } = orderSlice.actions;

// Selector to get order ID
export const selectOrderId = (state: RootState) => state.order.data?.id;

export default orderSlice.reducer;