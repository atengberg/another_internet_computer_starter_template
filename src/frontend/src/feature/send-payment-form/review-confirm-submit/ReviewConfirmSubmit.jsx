import { useMemo } from 'react';
import { RiAlertFill, RiCheckDoubleFill, RiErrorWarningFill } from '../../../components/Icons';
import FormLabel from "../FormLabel";
import InputsReview from './InputsReview';
import SubmitConfirmation from './SubmitConfirmation';

const ReviewConfirmSubmit = ({
  amount,
  description,
  address,
  tokenSymbol = "icrc1 token",
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
      <div className="input-content" aria-live="assertive" role="status" aria-atomic={true}>
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
  return useMemo(() => {
    if (!error) {
      return null;
    } else {
      <div  className="error-status-layout-container">
        <span>Cannot process payment due to error:</span>
        <span className="font-semibold">{error}</span>
      </div>
    }
  }, [error]);
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
      <SubmitConfirmation
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


export default ReviewConfirmSubmit;