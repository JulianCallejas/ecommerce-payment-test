import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types';
import api from '../../services/api';


export interface ProductState {
  data: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  data: null,
  loading: false,
  error: null,
};

// fetching product data
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await api.getProduct(slug);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch product');
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProduct: () => initialState,
    updateStock: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.stock = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetProduct, updateStock } = productSlice.actions;
export default productSlice.reducer;