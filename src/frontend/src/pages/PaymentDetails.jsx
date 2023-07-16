import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCanister from "../hooks/useCanister";
import Spinner from "../components/Spinner";
import PaymentDetailsContent from "../components/PaymentDetailsContent";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getPaymentById, canisterMetadata: { decimals = null, symbol = null } = {} } = useCanister();
  const [payment, setPayment] = useState(null);
  useEffect(() => {
    const p = getPaymentById(id);
    p ? setPayment(() => p) : navigate('/');
  }, [getPaymentById, id, navigate])
  if (!payment || !decimals) {
    return null;
  }
  return (
    <div className="scrollable">
      <PaymentDetailsContent payment={payment} tokenSymbol={symbol} decimals={decimals} />
    </div>
  )
};

export default PaymentDetails;
 
