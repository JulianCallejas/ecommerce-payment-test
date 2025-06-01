import { IconButton, TextField } from "@mui/material";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { setQuantity } from "../features/checkout/checkoutSlice";

interface Props {
  stock: number;
}

const QuantityCounter = ({ stock }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const quantity = useSelector((state: RootState) => state.checkout.quantity);

  const handleQuantity = () => {
    if (quantity && quantity > stock) {
      dispatch(setQuantity(stock));
    }
  };
  
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    dispatch(setQuantity(value));
  };

  const handleOnIncrement = () => {
    if (quantity && quantity >= stock) return;
    const value = Number(quantity) + 1;
    dispatch(setQuantity(value));
  };

  const handleOnDecrement = () => {
    if (quantity === 1) return;
    const value = Number(quantity) - 1;
    dispatch(setQuantity(value));
  };

  return (
    <div className="flex items-center">
      <IconButton aria-label="disminuir cantidad" onClick={handleOnDecrement}>
        <CircleMinus />
      </IconButton>
      <TextField
        label="Comprar..."
        slotProps={{
          input: {
            type: "number",
            inputProps: { 
              style: { textAlign: "center" },
              max: stock,
              min: 1,
            },
          },
        }}
        value={quantity}
        variant="outlined"
        className="max-w-[85px]"
        sx={{ textAlign: "center", zIndex: 1 }}
        onChange={handleOnChange}
        onBlur={handleQuantity}
      />
      <IconButton aria-label="Aumentar cantidad" onClick={handleOnIncrement}>
        <CirclePlus />
      </IconButton>
      <span className="text-2xl ml-2 font-semibold">Unidades</span>
    </div>
  );
};

export default QuantityCounter;
