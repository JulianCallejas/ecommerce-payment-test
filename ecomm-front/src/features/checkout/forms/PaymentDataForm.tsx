import React from "react";
import { TextField, MenuItem, Grid, Typography, Box } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { type PaymentData } from "../../../types";
import { detectCardType } from "../../../utils";
import VisaSvg from "../../../components/VisaSvg";
import MasterSvg from "../../../components/MasterSvg";
import CreditCardSvg from "../../../components/CreditCardSvg";

const installmentOptions = [
  { value: 1, label: "1 Cuota" },
  { value: 3, label: "3 Cuotas" },
  { value: 6, label: "6 Cuotas" },
  { value: 12, label: "12 Cuotas" },
  { value: 18, label: "18 Cuotas" },
  { value: 24, label: "24 Cuotas" },
  { value: 36, label: "36 Cuotas" },
];

const PaymentDataForm = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useFormContext<PaymentData>();

  const cardNumber = watch("cardNumber");
  const cardType = React.useMemo(
    () => detectCardType(cardNumber),
    [cardNumber]
  );

  // Format card number with spaces
  //   const formatCardNumber = (value: string) => {
  //     const sanitized = value.replace(/\s+/g, '');
  //     const chunks = [];

  //     for (let i = 0; i < sanitized.length; i += 4) {
  //       chunks.push(sanitized.substring(i, i + 4));
  //     }

  //     return chunks.join(' ');
  //   };

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-6">
      <Typography variant="h6" className="mb-4">
        Tarjeta de crédito
      </Typography>

      <Grid container spacing={3} sx={{ overflow: "auto" }}>
        <Grid size={{ xs: 12 }}>
          <Box className="relative mt-2">
            <TextField
              autoFocus
              label="Número de tarjeta"
              {...register("cardNumber")}
              error={touchedFields.cardNumber && !!errors.cardNumber}
              helperText={
                touchedFields.cardNumber && errors.cardNumber?.message
              }
              fullWidth
              required
              inputProps={{ maxLength: 19 }}
            />

            <Box className="absolute right-3 top-[4px] transform  w-8 ">
              {cardType === "visa" && <VisaSvg />}
              {cardType === "mastercard" && <MasterSvg />}
              {cardType !== "visa" && cardType !== "mastercard" && (
                <CreditCardSvg  />
              )}
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="CVC"
            {...register("cvc")}
            error={touchedFields.cvc && !!errors.cvc}
            helperText={touchedFields.cvc && errors.cvc?.message}
            fullWidth
            required
            inputProps={{ maxLength: 4 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Exp. Mes (MM)"
            {...register("expMonth")}
            placeholder="MM"
            error={touchedFields.expMonth && !!errors.expMonth}
            helperText={touchedFields.expMonth && errors.expMonth?.message}
            fullWidth
            required
            inputProps={{ maxLength: 2 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Exp. Año (YY)"
            {...register("expYear")}
            placeholder="YY"
            error={touchedFields.expYear && !!errors.expYear}
            helperText={touchedFields.expYear && errors.expYear?.message}
            fullWidth
            required
            inputProps={{ maxLength: 4 }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Nombre en la tarjeta"
            {...register("cardHolder")}
            error={touchedFields.cardHolder && !!errors.cardHolder}
            helperText={touchedFields.cardHolder && errors.cardHolder?.message}
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="installments"
            control={control}
            rules={{ required: "Debe seleccionar el número de cuotas" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                label="Cuotas"
                error={!!error}
                helperText={error?.message}
                fullWidth
                required
              >
                {installmentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default PaymentDataForm;
