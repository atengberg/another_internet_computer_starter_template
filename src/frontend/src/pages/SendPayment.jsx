import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SendPaymentForm from "../feature/send-payment-form/SendPaymentForm";
import useCanister from "../feature/canister-provider/useCanister";
import { actionTypes, stateKeys } from "../utils/enums";
import { prepareSendPaymentArgs } from "../utils/utils";

const SendPayment = () => {

  const { 
    canisterMetadata: {
      decimals,
      symbol,
    },
    sourceAddress, 
    createdCount, 
    taskWorker, 
    taskUi 
  } = useCanister();

  const navigate = useNavigate();

  const onSendPaymentConfirmed = (inputs) => {
    const {
      payment,
      args
    } = prepareSendPaymentArgs({
      inputs,
      decimals,
      sourceAddress,
      createdCount
    })
    // Update the UI with the pending client created payment viewmodel.
    taskUi({ 
      type: actionTypes.UPDATE, 
      key: stateKeys.payment, 
      payload: { 
        payment, 
        fromClient: true 
      } 
    });
    // Post the send_payment call event.
    taskWorker({ 
      type: actionTypes.UPDATE, 
      key: stateKeys.payment, 
      args
    });
    // Make sure the navigation is enqueued after.
    setTimeout(() => {
      navigate('/payments', { replace: true });
    }, 11);
  };

  const { state } = useLocation();
  const { copy } = state ?? { amount: '', description: '', recipientAddress: '' };

  const [disabled, setDisabled] = useState(false);

  return ( 
    <div className="scrollable">
      <SendPaymentForm 
        initialValues={{...copy}}
        disabled={disabled}
        setDisabled={setDisabled}
        onSendPaymentConfirmed={onSendPaymentConfirmed}
        decimals={decimals}
        tokenSymbol={symbol}
      />
    </div>
  );
};

export default SendPayment;
