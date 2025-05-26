import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  type PersistConfig,
} from "redux-persist";
import { EncryptStorage } from "encrypt-storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import productReducer, {
  type ProductState,
} from "../features/product/productSlice";

const storageKey =
  import.meta.env.VITE_ENCRYPTSTORAGE_KEY || "41346ECD5EA232385355CDEF8B925";

// Create a persisted storage with encryption
const encryptStorage = new EncryptStorage(storageKey, {
  storageType: "localStorage",
});

export interface RootState {
  product: ProductState;
}

const encryptConfig = {
  secretKey: storageKey,
  onError: (error: unknown) => {
    console.error("Encryption error:", error);
  },
};

const storage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(encryptStorage.getItem(key) || null);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return Promise.resolve(encryptStorage.setItem(key, value));
  },
  removeItem: (key: string): Promise<void> => {
    return Promise.resolve(encryptStorage.removeItem(key));
  },
};

// Setup Redux persist for reducers
const rootPersistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  transforms: [encryptTransform(encryptConfig)],
  whitelist: ["product"],
};

const rootReducer = combineReducers({
  product: productReducer,
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
