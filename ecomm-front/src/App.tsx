import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import ProductPage from "./features/product/ProductPage";
import { Provider, useDispatch } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
      // Opcional: puedes despachar acciones cuando la persistencia se complete
      const unsubscribe = persistor.subscribe(() => {
        const { bootstrapped } = persistor.getState();
        if (bootstrapped) {
          console.log('Persist has been rehydrated');
          // Aquí puedes realizar acciones adicionales si es necesario
        }
      });
  
      return () => unsubscribe();
    }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="freidora-de-aire-oster-6lts-digital-diamondforce" replace />} />
                <Route path="/:slug" element={<ProductPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
