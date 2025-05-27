import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  type PersistConfig,
} from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import productReducer, {
  type ProductState,
} from "../features/product/productSlice";
import checkoutReducer, { type CheckoutState } from '../features/checkout/checkoutSlice';
import type { PersistPartial } from "redux-persist/es/persistReducer";

const storageKey =
  import.meta.env.VITE_ENCRYPTSTORAGE_KEY || "41346ECD5EA232385355CDEF8B925";

// Create a persisted storage with encryption
export interface RootState {
  product: ProductState;
  checkout: CheckoutState & PersistPartial;
}

const encryptConfig = {
  secretKey: storageKey,
  onError: (error: unknown) => {
    console.error("Encryption error:", error);
  },
};

const storage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(localStorage.getItem(key) || null);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem: (key: string): Promise<void> => {
    return Promise.resolve(localStorage.removeItem(key));
  },
};

// Setup Redux persist for reducers
const rootPersistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  transforms: [encryptTransform(encryptConfig)],
  whitelist: ["product"],
};

const checkoutPersistConfig = {
  key: 'checkout',
  storage,
  transforms: [encryptTransform(encryptConfig)],
  whitelist: ['customer', 'address', 'termsAccepted', 'privacyAccepted', 'termsAccepted', 'privacyAccepted','isModalOpen', 'quantity'], // Exclude paymentData
};

const rootReducer = combineReducers({
  product: productReducer,

  checkout: persistReducer(checkoutPersistConfig, checkoutReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
