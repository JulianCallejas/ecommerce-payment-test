import  { type ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { RootState } from '../store';
import productReducer from '../features/product/productSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import summaryReducer from '../features/summary/summarySlice';
import orderReducer from '../features/order/orderSlice';
import transactionReducer from '../features/transaction/transactionSlice';
import purchaseStageReducer from '../features/purchase/purchaseStageSlice';

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export const setupStore = (preloadedState?: DeepPartial<RootState>) => {
  return configureStore({
    reducer: {
      product: productReducer,
      checkout: checkoutReducer,
      summary: summaryReducer,
      order: orderReducer,
      transaction: transactionReducer,
      purchaseStageState: purchaseStageReducer,
    },
    preloadedState: preloadedState as unknown, // Conversión temporal necesaria
  });
};

export const createWrapper = (preloadedState?: DeepPartial<RootState>) => {
  const store = setupStore(preloadedState);
  return ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
};