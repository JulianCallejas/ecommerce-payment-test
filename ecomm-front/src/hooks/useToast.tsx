import { Alert, Snackbar, type AlertColor, type AlertPropsColorOverrides, type SnackbarCloseReason } from "@mui/material";
import type { OverridableStringUnion } from "@mui/types";
import { useState } from "react";

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(""); 
  const [severity, setSeverity] = useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>("info");  


  const showToast = (message: string, severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides> = "info") => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  };


  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const Toast = () => {
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    );
  };

  
  return {Toast, showToast};
};
