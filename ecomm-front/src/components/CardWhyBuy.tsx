import { Card, CardContent, Typography } from "@mui/material";
import { CreditCard, ShieldCheck, TruckIcon } from "lucide-react";

const CardWhyBuy = () => {
  return (
    <Card variant="outlined" className="bg-gray-50">
      <CardContent>
        <Typography variant="h6" className="text-center">
          ¿Por qué comprar aquí?
        </Typography>
        <div className="space-y-3 mt-3">
          <div className="flex items-center">
            <ShieldCheck className="text-green-600 h-5 w-5 mr-2" />
            <Typography variant="body2">Proeso de pago seguro</Typography>
          </div>
          <div className="flex items-center">
            <TruckIcon className="text-blue-600 h-5 w-5 mr-2" />
            <Typography variant="body2">
              Opciones de evío express
            </Typography>
          </div>
          <div className="flex items-center">
            <CreditCard className="text-purple-600 h-5 w-5 mr-2" />
            <Typography variant="body2">
              Diferentes medios de pago
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardWhyBuy;
