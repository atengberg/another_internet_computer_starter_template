
import {  useEffect, useState, useCallback, useMemo } from "react";
import { decodeIcrcAccount } from "@dfinity/ledger";
import { decodePayment } from "@dfinity/ledger";
import RecipientAddressInput from "./RecipientAddressInput";
import DescriptionInput from "./DescriptionInput";
import AmountInput from "./AmountInput";
import ReviewConfirmInput from "./ReviewConfirmInput";
import { toBaseUnits } from "../../utils/utils";

import useFocused from "../../hooks/useFocused";

const inputTypes = {};
inputTypes['amountInput'] = 'amountInput';
inputTypes['recipientAddressInput'] = 'recipientAddressInput';
inputTypes['descriptionInput'] = 'descriptionInput';
Object.freeze(inputTypes);

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


  return (
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
      <ReviewConfirmInput
        amount={amountInput} 
        description={descriptionInput}
        address={recipientAddressInput}
        error={inputError}
        onSendingPaymentConfirmed={onSendingPaymentConfirmed}
        disabled={disabled}
      />
    </form>
  );
};

const useErrorChecker = ({
  amountInput, 
  recipientAddressInput, 
  addressRef,
}) => {
  const [inputError, setInputError] = useState(false);
  const [errorKind, setErrorKind] = useState(null);

  const preValidate = useCallback(() => {
    const parsedAmount = parseFloat(amountInput);
    const hasAmount = !isNaN(parsedAmount);
    const hasNonZeroAmount = hasAmount && parsedAmount > 0;
    if (!hasNonZeroAmount) {
      return {
        kindResult: inputTypes.amountInput,
        errorResult: "A positive number must be specified as the amount to send."
      };
    };
    const hasAddress = recipientAddressInput && recipientAddressInput.length > 0;
    if (!hasAddress) {
      return {
        kindResult: inputTypes.recipientAddressInput,
        errorResult: "A recipient address must be specified to send a payment."
      };
    } else {
      if (recipientAddressInput?.length < 17) {
        return {
          kindResult: inputTypes.recipientAddressInput,
          errorResult: "Recipient address is not valid length."
        };
      }
    }
    return {
      kindResult: null,
      errorResult: null
    };
  }, [amountInput, recipientAddressInput]);

  useEffect(() => {
    const { kindResult, errorResult } = preValidate();
    if (kindResult !== errorKind && errorResult !== inputError) {
      setInputError(() => errorResult);
      setErrorKind(() => kindResult);
    }
  }, [
    preValidate, 
    amountInput, 
    recipientAddressInput, 
    errorKind, 
    inputError
  ]);

  const validate = useCallback(() => {
    try {
      decodeIcrcAccount(recipientAddressInput);
      return true;
    } catch (e) {
      setInputError(() => "Recipient address is not valid ICRC1 address account encoded text.");
      setErrorKind(() => inputTypes.recipientAddressInput);
      if (addressRef?.current) {
        addressRef.current.focus();
      }
      return false;
    }
  }, [recipientAddressInput, addressRef]);

  const setError = useCallback((error, type) => {
    setInputError(() => error);
    setErrorKind(() => type);
  }, []);

  return useMemo(() => ({
      validate,
      setError,
      inputError,
      errorKind
    }), 
    [
      validate, 
      inputError, 
      setError,
      errorKind, 
    ]
  );
};


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}


export default SendPaymentForm;
