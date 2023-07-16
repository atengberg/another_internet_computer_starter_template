
import {  useEffect, useState, useCallback, useMemo } from "react";

import RecipientAddressInput from "./inputs/RecipientAddressInput";
import DescriptionInput from "./inputs/DescriptionInput";
import AmountInput from "./inputs/AmountInput";
import ReviewConfirmSubmit from "./review-confirm-submit/ReviewConfirmSubmit";

import useFocused from "../../hooks/useFocused";
import useErrorChecker from "./useErrorChecker";

import { decodePayment } from "@dfinity/ledger";
import { toBaseUnits } from "../../utils/utils";

import inputTypes from "./input-types";

const SendPaymentForm = ({
  initialValues,
  onSendPaymentConfirmed,
  disabled = false,
  setDisabled,
  decimals,
  tokenSymbol,
}) => {
  const {
    amount = '',
    description = '',
    recipientAddress = '',
  } = initialValues;

  const [descriptionInput, setDescriptionInput] = useState(''  || description);
  const [amountInput, setAmountInput] = useState(''  || `${amount}`);
  const [recipientAddressInput, setRecipientInput] = useState(''  || recipientAddress);

  const { focused: addressFocused, elementRef: addressRef } = useFocused("address-input");
  const { focused: amountFocused, elementRef: amountRef } = useFocused("amount-input");
  const { focused: descriptionFocused } = useFocused("description-input");

  const { 
    validate, 
    inputError, 
    errorKind, 
    setError,
  } = useErrorChecker({ 
    amountInput, 
    recipientAddressInput,
    addressRef,
    amountRef
  });

  const onQrCodeScanned = useCallback((result) => {
    try {
      const decoded = decodePayment(result);
      if (decoded?.token) {
        if (tokenSymbol && tokenSymbol !== decoded.token) {
          setError("Scanned QR code does not correspond to the ICRC1 token canister this is currently making payments too.", 
          'recipientAddressInput'
          );
        }
      }
      if (decoded?.identifier) {
        setRecipientInput(() => decoded.identifier);
      }
      if (decoded?.amount) {
        setAmountInput(() => toBaseUnits(decoded.amount, decimals));
      }
      if (!decoded) {
        throw new Error("Nullish decoded, falling back to raw qr input result");
      }
    } catch (e) {
      if (result?.length > 0) {
        setRecipientInput(() => result);
      } else {
        setError("Could not resolve recipient address from QR code scanned", inputTypes.recipientAddressInput);
      }
    }
  }, [
    setError, 
    tokenSymbol, 
    decimals
  ]);

  const onSendingPaymentConfirmed = useCallback((e) => {
    e.preventDefault();
    if (validate()) {
      setDisabled(() => true);
      onSendPaymentConfirmed({ 
        descriptionInput, 
        amountInput, 
        recipientAddressInput 
      });
    }
  }, [
    amountInput,
    descriptionInput,
    recipientAddressInput,
    onSendPaymentConfirmed,
    setDisabled,
    validate
  ]);

  useEffect(() => {
    const useQrButton = document.getElementById("use-scan-qr-code-button");
    const submitButton = document.getElementById("confirm-send-payment-button");
    const enterKeyHandler = (event) => {
      const { target, keyCode } = event;
      // Prevents QR code scanner from openning if 'SCAN QR CODE' doesn't have focus and enter is pressed.
      if (keyCode === 13) {
        if (target !== (useQrButton || submitButton)) {
          event.preventDefault();
        }
      }
    };
    document.addEventListener('keydown', enterKeyHandler);
    return () => document.removeEventListener('keydown', enterKeyHandler);
  }, []);

  return useMemo(() => (
    <form 
      disabled={disabled}
      noValidate
      className="rounded-opaque snap-y snap-proximity"
      aria-labelledby="payment-form-title"
      >      
      <RecipientAddressInput 
        focused={addressFocused}
        hasError={inputError ? errorKind === inputTypes.recipientAddressInput : null}
        disabled={disabled}
        inputValue={recipientAddressInput}
        onInputValueChanged={setRecipientInput}
        onQrCodeScanned={onQrCodeScanned}
      />
      <AmountInput 
        focused={amountFocused}
        hasError={inputError ? errorKind === inputTypes.amountInput : null}
        inputValue={amountInput}
        onInputValueChanged={setAmountInput}
        disabled={disabled}
      />
      <DescriptionInput 
        focused={descriptionFocused}
        inputValue={descriptionInput}
        onInputValueChanged={setDescriptionInput}
        disabled={disabled}
      />
      <ReviewConfirmSubmit
        amount={amountInput} 
        description={descriptionInput}
        address={recipientAddressInput}
        tokenSymbol={tokenSymbol}
        error={inputError}
        onSendingPaymentConfirmed={onSendingPaymentConfirmed}
        disabled={disabled}
      />
    </form>
  ), [
    addressFocused,
    amountFocused,
    descriptionFocused,
    amountInput,
    descriptionInput,
    recipientAddressInput,
    disabled,
    errorKind,
    inputError,
    onQrCodeScanned,
    onSendingPaymentConfirmed,
    tokenSymbol
  ]);
};


export default SendPaymentForm;
