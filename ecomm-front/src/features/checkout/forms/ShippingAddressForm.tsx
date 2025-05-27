import { TextField, Grid, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { type Address } from "../../../types";

const ShippingAddressForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useFormContext<Address>();

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-6">
      <Typography variant="h6" className="mb-4">
        Datos de envío
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            autoFocus
            label="Dirección"
            {...register("addressLine1")}
            error={touchedFields.addressLine1 && !!errors.addressLine1}
            helperText={
              touchedFields.addressLine1 && errors.addressLine1?.message
            }
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Dirección complementaria (Optional)"
            {...register("addressLine2")}
            error={touchedFields.addressLine2 && !!errors.addressLine2}
            helperText={
              touchedFields.addressLine2 && errors.addressLine2?.message
            }
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Número de teléfono"
            placeholder="3201111111"
            {...register("phoneNumber")}
            error={touchedFields.phoneNumber && !!errors.phoneNumber}
            helperText={
              touchedFields.phoneNumber && errors.phoneNumber?.message
            }
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Departamento"
            {...register("region")}
            error={touchedFields.region && !!errors.region}
            helperText={touchedFields.region && errors.region?.message}
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Ciudad"
            {...register("city")}
            error={touchedFields.city && !!errors.city}
            helperText={touchedFields.city && errors.city?.message}
            fullWidth
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Nombre de contacto (recibe el envío)"
            {...register("contactName")}
            error={touchedFields.contactName && !!errors.contactName}
            helperText={
              touchedFields.contactName && errors.contactName?.message
            }
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Código Postal"
            {...register("postalCode")}
            error={touchedFields.postalCode && !!errors.postalCode}
            helperText={touchedFields.postalCode && errors.postalCode?.message}
            fullWidth
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default ShippingAddressForm;
