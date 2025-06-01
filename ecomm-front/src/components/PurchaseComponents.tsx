import { useSelector } from "react-redux";
import CheckoutModal from "../features/checkout/CheckoutModal";
import SummaryBackdrop from "../features/summary/SummaryBackdrop";
import TransactionStatusModal from "../features/transaction/TransactionStatusModal";
import type { RootState } from "../store";

const PurchaseComponents = () => {
  const { stage } = useSelector((state: RootState) => state.purchaseStageState);
  
  console.log({stage});

  if (!stage) return null;
  return (
    <>
      { stage === "checkout" && <CheckoutModal /> }
      { stage === "summary" && <SummaryBackdrop /> }
      { stage && stage !== "checkout" && stage !== "summary" && <TransactionStatusModal /> }
    </>
  );
};

export default PurchaseComponents;
