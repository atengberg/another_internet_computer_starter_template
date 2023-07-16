import { useMemo } from 'react';
import { RiAlertFill, RiCheckDoubleFill, RiErrorWarningFill } from '../Icons';
import FormLabel from "./FormLabel";

const ReviewConfirmInput = ({
  amount,
  description,
  address,
  tokenSymbol = "ckbtc",
  onSendingPaymentConfirmed,
  error,
  disabled,
}) => {

  const formIcon = useMemo(() => (error
    ? <RiErrorWarningFill className="stylish-label-icon-size text-e8-razzmatazz" />
    : <RiCheckDoubleFill  className="stylish-label-icon-size text-u-green-success" />
  ), [error]);

  return useMemo(() => (
    <div className="shadow-form-field-dark dark:shadow-form-field-light flex h-full flex-col">
      <FormLabel 
        htmlFor="confirm-send-payment-button"  
        labelText="review and confirm" 
        icon={formIcon || <RiAlertFill  className="stylish-label-icon-size text-e8-sea-buckthorn" />} 
      />
      <div className="input-content">
      {error 
        ? <FormErrorStatus error={error} />
        : <FormReviewSubmission 
            amount={amount} 
            address={address} 
            tokenSymbol={tokenSymbol} 
            description={description} 
            disabled={disabled} 
            onSendingPaymentConfirmed={onSendingPaymentConfirmed} 
          />
      }
      </div>
    </div>
  ), [
    address,
    amount,
    description,
    disabled,
    formIcon,
    error,
    onSendingPaymentConfirmed,
    tokenSymbol
  ]);
};

const FormErrorStatus = ({ error }) => {
  return useMemo(() => (
    <>
    { error 
      ? <div aria-live="assertive" role="status" aria-atomic={true} className="error-status-layout-container">
          <span>Cannot process payment due to error:</span>
          <span className="font-semibold">{error}</span>
        </div>
      : null
    }
    </>
  ), [error]);
};

const FormReviewSubmission = ({ amount, address, description, tokenSymbol, disabled, onSendingPaymentConfirmed }) => {
  return useMemo(() => (
    <div> 
      <InputsReview
        amount={amount}
        address={address}
        description={description}
        tokenSymbol={tokenSymbol}
      />
      <ConfirmToSend
        disabled={disabled}
        onSendingPaymentConfirmed={onSendingPaymentConfirmed} 
      />
    </div>
  ), [
    amount, 
    address, 
    description, 
    tokenSymbol, 
    disabled, 
    onSendingPaymentConfirmed
  ]);
};

const InputsReview = ({
  amount,
  description,
  address,
  tokenSymbol
}) => {
  return useMemo(() => {
    const hasNonZeroAmount = amount && parseFloat(amount) > 0;
    const hasAddress = address && address?.length > 0;
    const hasNonEmptyDescription = description && description?.length > 0;
    return (
      <div className="flex flex-col gap-2 pt-2">  
        <span className="ml-2 font-extrabold tracking-[.1rem]">User is sending</span>
        <div className="review-indent">
          {hasNonZeroAmount 
            ? <div className="flex items-end">
                <span className="mr-1 tracking-[.1em]">{amount}</span>
                <span className="">{`base units of ${tokenSymbol}`}</span>
              </div>
            : <span className="input-unspecified-font">unspecified</span>
          }
        </div>
        <span className="ml-2 font-extrabold tracking-[.1rem]" >to the address</span>
        <div className="review-indent">
          {hasAddress 
              ? <div className="flex items-end break-all">
                  <span className="font-mono tracking-[.1rem]">{address}</span>
                </div>
              : <span className="input-unspecified-font">unspecified</span>
          }
        </div>
        <span className="ml-2 font-extrabold tracking-[.1rem]" >saved with the description</span>
        <div className="review-indent">
          {hasNonEmptyDescription 
            ? <div className="flex items-end break-all">
                <span className="mr-2 tracking-[.1rem]">{description}</span>
              </div>
            : <span className="input-unspecified-font" >
                {`(no description for this payment given)`}
              </span>
          }
        </div>
      </div>
    );}, 
    [address, amount, description, tokenSymbol]);
};

const ConfirmToSend = ({ 
  disabled, 
  onSendingPaymentConfirmed
}) => {
  // Todo move into nav ("action") bar.
  return useMemo(() => (
    <div className="mt-4 flex flex-col items-center justify-center gap-4">
      <span className="confirm-sumbit-button-label">
        {`Confirm this is correct to send payment and proceed to send payment by pressing 'Send Payment' below:`}
      </span>
      <button 
        type="submit"
        id="confirm-send-payment-button" name="confirm-send-payment-button"
        disabled={disabled}
        onClick={onSendingPaymentConfirmed}
        className="stylish-button confirm-submit-button">
          <span>Send Payment</span>
      </button>
    </div>
  ), [disabled, onSendingPaymentConfirmed]);
};

export default ReviewConfirmInput;