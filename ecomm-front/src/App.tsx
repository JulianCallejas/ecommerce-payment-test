import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import ProductPage from "./features/product/ProductPage";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
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
