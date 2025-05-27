import { FormControlLabel, Checkbox, Typography, Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export interface TermsFormData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
}


const TermsAndPrivacyForm = () => {
  const { register, handleSubmit } = useFormContext<TermsFormData>();

  return (
    <form onSubmit={handleSubmit(()=>{})} className="space-y-6">
      <Typography variant="h6" className="mb-4">
        Confirmación
      </Typography>
      
      <Box className="bg-gray-50 p-4 rounded-md mb-6">
        <Typography variant="body2" className="text-gray-600 mb-4">
          Por favor, revise los términos y condiciones y nuestra política de privacidad, Debe aceptarlas para continuar con el pago.
        </Typography>
        
        <div className="space-y-4">
          <FormControlLabel
            control={
              <Checkbox
                {...register('termsAccepted')}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Acepto <a href="https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf" target="_blank" rel="noreferrer" className="text-[#8B5CF6]">Términos y condiciones</a>
              </Typography>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                {...register('privacyAccepted')}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Acepto <a href="https://wompi.com/assets/downloadble/autorizacion-administracion-datos-personales.pdf" target="_blank" rel="noreferrer" className="text-[#8B5CF6]">Política de uso de datos personales</a>
              </Typography>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={true}
                disabled
                color="primary"
              />
            }
            label={
              <Typography variant="body2" className="text-gray-600">
                Al continuar doy mi consentimiento para el procesamiento de mis datos de pago para esta transacción
              </Typography>
            }
          />
        </div>
      </Box>
      
      <Typography variant="body2" className="text-gray-500">
        Al hacer clic en "Confirmar", accederá a nuestra página de pago seguro. Los datos de su tarjeta están encriptados y se procesan de forma segura.
      </Typography>
    </form>
  );
};

export default TermsAndPrivacyForm;