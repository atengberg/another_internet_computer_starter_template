import { useState, useCallback, useEffect, useMemo } from "react";
import { decodeIcrcAccount } from "@dfinity/ledger";
import inputTypes from "./input-types";

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

export default useErrorChecker;