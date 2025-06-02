import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { TransactionCreateRequest, TransactionResponse } from '../../types';
import { AxiosError } from 'axios';

export interface TransactionState {
  data: TransactionResponse | null;
  loading: boolean;
  polling: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: TransactionState = {
  data: null,
  loading: false,
  polling: false,
  error: null,
  loaded: false,
};

// Async thunk for creating a transaction
export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (request: TransactionCreateRequest, { rejectWithValue }) => {
    try {
      return await api.createTransaction(request);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create transaction');
    }
  }
);

// Async thunk for polling transaction status
export const pollTransaction = createAsyncThunk(
  'transaction/pollTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      return await api.getTransaction(id);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to get transaction status');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransaction: (state, action: PayloadAction<TransactionResponse>) => {
      state.data = action.payload;
    },
    setPolling: (state, action: PayloadAction<boolean>) => {
      state.polling = action.payload;
    },
    setTransactionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetTransaction: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create transaction cases
      .addCase(createTransaction.pending, (state) => {
        state.loaded = false;
        state.polling = false;
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.data = action.payload;
        state.error = null;
        // Start polling if status is PENDING
        state.polling = action.payload.status === 'PENDING';
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.polling = false;
        if (state.data?.status ) return
        state.error = action.payload as string;
        console.log(action.payload);
      })

      // Poll transaction cases
      .addCase(pollTransaction.pending, (state) => {
        state.loaded = false;
        state.error = null;
        if (state.polling) return;
        state.polling = true;
      })
      .addCase(pollTransaction.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loaded = true;
        // Continue polling only if still PENDING
        state.polling = action.payload.status === 'PENDING';
      })
      .addCase(pollTransaction.rejected, (state, action) => {
        state.error = action.payload as string;
        console.log(action.payload as string);
        state.loaded = true;
        state.polling = false;
        if ((action.payload as string).includes("rejected")){
          state.data!.status = "REJECTED";
        }
      });
  },
});

export const { setTransaction, setPolling, resetTransaction, setTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;