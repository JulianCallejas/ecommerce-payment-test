import { TextField, MenuItem, Grid, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { type Customer } from '../../../types';

const idTypes = [
  { value: 'CC', label: 'Cédula' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
];

const CustomerInfoForm = () => {
  const { control, register, handleSubmit, formState: { errors, touchedFields } } = useFormContext<Customer>();

  return (
    <form onSubmit={handleSubmit(()=>{})} className="space-y-6">
      <Typography variant="h6" className="mb-4">
        Información Personal
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }} > 
          <TextField
            label="Full Name"
            {...register('fullname')}
            error={touchedFields.fullname && !!errors.fullname}
            helperText={touchedFields.fullname && errors.fullname?.message}
            fullWidth
            required
          />
        </Grid>
        
        <Grid size={{ xs: 12 }} > 
          <TextField
            label="Email Address"
            type="email"
            {...register('email')}
            error={touchedFields.email && !!errors.email}
            helperText={touchedFields.email && errors.email?.message}
            fullWidth
            required
          />
        </Grid>
        
        <Grid size={{ xs: 12,  sm: 6 }} >
          <Controller
          name="personalIdType"
          control={control}
          rules={{ required: 'Debe seleccionar un tipo de identificación' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              select
              label="ID Type"
              error={!!error}
              helperText={error?.message}
              fullWidth
              required
            >
              {idTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        </Grid>
        
        <Grid size={{ xs: 12,  sm: 6 }} >
          <TextField
            label="ID Number"
            {...register('personalIdNumber')}
            error={touchedFields.personalIdNumber && !!errors.personalIdNumber}
            helperText={touchedFields.personalIdNumber && errors.personalIdNumber?.message}
            fullWidth
            required
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CustomerInfoForm;