import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCanister from "../feature/canister-provider/useCanister";
import PaymentDetailsContent from "../feature/payments/details/PaymentDetailsContent";

const PaymentDetails = () => {
  const [payment, setPayment] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const { 
    getPaymentById, 
    canisterMetadata: { 
      decimals = null, 
      symbol = null 
    } = {} 
  } = useCanister();

  useEffect(() => {
    const p = getPaymentById(id);
    p ? setPayment(() => p) : navigate('/');
  }, [getPaymentById, id, navigate]);

  if (!payment || !decimals) {
    return null;
  };

  return (
    <div className="scrollable">
      <PaymentDetailsContent payment={payment} tokenSymbol={symbol} decimals={decimals} />
    </div>
  )
};

export default PaymentDetails;
 
