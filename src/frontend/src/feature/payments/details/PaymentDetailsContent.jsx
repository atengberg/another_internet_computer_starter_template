import clsx from "clsx";

import DataTitle from "./DataTitle";
import { 
  getStatusColor, 
  convertExponetialIntoStringWithAllPlaceholderZeros, 
  fromBaseUnits, 
  isNonTrivialString, 
  getStatusMessage,
  getDisplayDateStrings
} from "../../../utils/utils";

import { 
  RiAlertFill, 
  RiShieldCheckFill, 
  RiTimeFill, 
  RiFingerprint2Fill, 
  RiFileEditFill, 
  RiScales2Fill, 
  RiCoinFill, 
  RiWallet3Fill, 
  RiLoopRightFill, 
  RiClipboardFill
} from '../../../components/Icons';

import { statusEnum } from "../../../utils/enums.js";

const PaymentDetailsContent = ({ payment, decimals, tokenSymbol }) => {
  const {
    id, 
    creationTimestamp,
    amountBaseUnits, 
    status, 
    description, 
    recipientAddress 
  } = payment;

  const { dayMonthYear, hourMinute } = getDisplayDateStrings(creationTimestamp);

  const normalUnits = convertExponetialIntoStringWithAllPlaceholderZeros(fromBaseUnits(amountBaseUnits, decimals));

  const hasDescription = isNonTrivialString(description);
  const statusColor = getStatusColor(status.type, true);
  const statusMessage = getStatusMessage(status);
  const statusIcon = getStatusIcon(status, statusColor);

  return (
    <div className="rounded-opaque text-2xl">
      <dl className="flex flex-col">
        <DataTitle 
          ariaId="dt-label-idcount" 
          titleText="Payment Id"  
          icon={<RiFingerprint2Fill className="stylish-label-icon-size" />} 
        />
        <dd >{`${id}`}</dd>
   
        <DataTitle 
          ariaId="dt-label-createdtime" 
          titleText="Created On"  
          icon={<RiTimeFill className="stylish-label-icon-size"  />} 
        />
        <dd >{`${hourMinute} ${dayMonthYear}`}</dd>
      
        <DataTitle 
          ariaId="dt-label-status" 
          titleText="Status" 
          icon={statusIcon} 
        />
        <dd ><span className={statusColor}>{statusMessage}</span></dd>
       
        {hasDescription 
          ? <>
            <DataTitle 
              ariaId="dt-label-desc" 
              titleText="Description" 
              icon={<RiFileEditFill className="stylish-label-icon-size" />} 
            />
            <dd>{description}</dd>
            </>
          : null
        }
  
        <DataTitle 
          ariaId="dt-label-address" 
          titleText="Recipient Address" 
          icon={<RiWallet3Fill className="stylish-label-icon-size"  />} 
        />
        <div className="relative">
          <dd className="break-all pr-8 font-mono">{recipientAddress}</dd>
          <button className="payment-description-copy-address-button"
            aria-labelledby="copy-address-label" title="Copy recipient address to clipboard" 
            onClick={() => navigator.clipboard.writeText(recipientAddress)}
          >
            <label className="sr-only" name="copy-address-label" id="copy-address-label">
              copy the recipient address to the clipboard
            </label>
            <RiClipboardFill className="sr-hidden stylish-label-icon-size"/>
          </button>
        </div>

        <DataTitle 
          ariaId="dt-label-amount" 
          titleText="Amount"   
          icon={<RiScales2Fill className="stylish-label-icon-size" />} 
        />
        <dd >{`${normalUnits} (or ${amountBaseUnits} base units)`}</dd>
       
        <DataTitle 
          ariaId="dt-label-token" 
          titleText="Token"  
          icon={<RiCoinFill className="stylish-label-icon-size"  />} 
        />
        <dd className="uppercase">{tokenSymbol}</dd>
   
      </dl>
    </div>
  )
};

function getStatusIcon(status, statusColor) {
  switch (status.type) {
    case statusEnum.CONFIRMED:
      return <RiShieldCheckFill className={clsx("stylish-label-icon-size", statusColor)} />;
    case statusEnum.FAILED_INTERCANISTER_CALL:
    case statusEnum.FAILED_INVALID_ADDRESS:
    case statusEnum.FAILED_TRANSFER_ERR:
      return  <RiAlertFill className={clsx("stylish-label-icon-size", statusColor)} />;
    case statusEnum.PENDING:
      return (
        <div className="animate-spin">
          <RiLoopRightFill className={clsx("stylish-label-icon-size", statusColor)} />
        </div>
      );
    default:
      throw new Error("Tried to get status icon without a status!");
  }
}

export default PaymentDetailsContent;