import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import ProductPage from "./features/product/ProductPage";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import StartingServer from "./components/StartingServer";
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationsProvider
            slotProps={{
              snackbar: {
                anchorOrigin: { vertical: "top", horizontal: "center" },
              },
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route
                    index
                    element={
                      <StartingServer />
                    }
                  />
                  <Route path="/:slug" element={<ProductPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
