import { useState } from "react";
import { useLocation } from "react-router-dom";
import useCanister from "../hooks/useCanister";
import { useNavigate } from "react-router-dom";
import SendPaymentForm from "../components/send-form/SendPaymentForm";

import { actionTypes, stateKeys } from "../utils/enums";

import { prepareSendPaymentArgs } from "../utils/utils";


const addressTEST = "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae-dfxgiyy.102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20";

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
