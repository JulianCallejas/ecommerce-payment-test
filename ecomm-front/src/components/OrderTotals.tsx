import { Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { currencyFormatter } from "../utils";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { selectTotalAmount } from "../features/summary/summarySlice";

const OrderTotals = () => {
    const summary = useSelector((state: RootState) => state.summary.data);
    const totalAmount = useSelector(selectTotalAmount);

    if (!summary) return null;

  return (
    <List disablePadding className="md:space-y-1" >
      <ListItem disablePadding >
        <ListItemText primary="Cantidad" />
        <Typography>{summary!.quantity}</Typography>
      </ListItem>
      <ListItem disablePadding className="">
        <ListItemText primary="Precio por unidad" />
        <Typography>{currencyFormatter(summary.unitPrice)}</Typography>
      </ListItem>
      <Divider
        className="my-2 "
        variant="fullWidth"
        sx={{ borderColor: "#172B3C" }}
      />
      <ListItem disablePadding className="">
        <ListItemText primary="Subtotal" />
        <Typography>{currencyFormatter(summary.baseAmount)}</Typography>
      </ListItem>
      <ListItem disablePadding className="">
        <ListItemText primary="Gastos de envío" />
        <Typography>{currencyFormatter(summary.deliveryFee)}</Typography>
      </ListItem>
      <Divider
        className="my-2 "
        variant="fullWidth"
        sx={{ borderColor: "#172B3C" }}
      />
      <ListItem disablePadding className="">
        <ListItemText primary="Total" />
        <Typography>
          {currencyFormatter(totalAmount)}
        </Typography>
      </ListItem>
    </List>
  );
};

export default OrderTotals;
