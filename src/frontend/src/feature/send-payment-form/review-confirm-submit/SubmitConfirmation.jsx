import { useMemo } from "react";

const SubmitConfirmation = ({ 
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

export default SubmitConfirmation;