import { useNavigate } from "react-router-dom";
import AutoEllipsizingTextSpan from "./AutoEllipsizingTextSpan";
import clsx from "clsx";
import { getDisplayDateStrings } from "../utils/utils";
import { RiSendPlaneFill } from "./Icons";
import { 
  getStatusColor, 
  convertExponetialIntoStringWithAllPlaceholderZeros, 
  fromBaseUnits, 
  isNonTrivialString 
} from "../utils/utils";


// Todo: add status icon (instead of just color) if pending or error.
// Todo: display current balance if empty ("Need to add funds? etc")

const PaymentsList = ({ 
  labelbyId,
  payments,
  tokenSymbol,
  decimals
}) => {
  if (!payments || !decimals || !tokenSymbol) {
    return null;
  } else if (payments.length === 0) {
    return <ZeroPaymentsPlaceholder />;
  }
  return (
    <div className="scrollable h-full min-w-[18rem]">
      <ul aria-labelledby={labelbyId} className="rounded-opaque flex flex-col">
        {payments.map((p, i) => (
          <PaymentListItem 
            {...p} 
            key={p.id} 
            even={(i%2 === 0)}
            tokenSymbol={tokenSymbol}
            decimals={decimals}
          />
        ))}
      </ul>
    </div>
  )
};


const PaymentListItem = (props) => {
  const { 
    even,
    id, 
    creationTimestamp,
    amountBaseUnits, 
    tokenSymbol, 
    status,
    decimals, 
    description, 
    recipientAddress 
  } = props;
  const navigate = useNavigate();
  const statusColor = getStatusColor(status.type);
  const normalUnits = convertExponetialIntoStringWithAllPlaceholderZeros(fromBaseUnits(amountBaseUnits, decimals));
  return (   
    <>
    <li className={clsx("payment-list-element-li", 'snap-start', statusColor)} onClick={() => navigate(`/payments/p/${id}`)}>
      <div className="relative h-full">
        <div className={clsx("flex h-full flex-col  xl:flex-row xl:items-center xl:justify-start")}>

          <CreationDate timestamp={creationTimestamp} /> 
          <div className="flex-1"></div>
          <div className="payment-list-description-address-container">
            <Description  description={description} />
            <Address address={recipientAddress}  />
          </div>
        </div>
        <div className={clsx("payment-list-amount-layout-container", statusColor )} >
          <Amount amount={normalUnits} tokenSymbol={tokenSymbol} />
        </div>
      </div>
    </li>
    {even ? <div className="odd:stylish-hr-r"></div> : <div className="odd:stylish-hr-l"></div>}
    </>
  )
}

const Description = ({ description }) => {
  if (!isNonTrivialString(description)) return null;
  return (
    <div className="payment-list-description-containter">
      <span className="payment-list-description-text">{description}</span>
    </div>
  )
}

const Address = ({ address }) => {
  return (
    <div className="flex w-full items-center" >
      <RiSendPlaneFill className="payment-list-address-icon"/>
      <div className="w-[.5rem]"></div>
      <AutoEllipsizingTextSpan originalText={address} textClz="payment-list-address-font" />
    </div>
  )
};

const Amount = ({ 
  amount, 
  tokenSymbol = 'token',
}) => {
  // in case token styles messed up here's line:     'mt-0 m-s:-mt-2 m-m:-mt-2 m-l:-mt-2.5 m-xl:-mt-3',
  return (
    <div className="min:flex-col m-s:flex-col flex items-end 2xl:justify-center">
      <span className="payment-list-amount-text">{amount}</span>
      <span className="payment-list-token-text">{tokenSymbol}</span>
    </div>
  )
}

const CreationDate = ({ timestamp }) => {
  const { dayMonthYear, hourMinute } = getDisplayDateStrings(timestamp);
  return (
    <div className="payment-list-creation-date">
      <span className="flex-1 text-start xl:text-center">{dayMonthYear}</span>
      <span className="flex-1 text-start xl:text-center" >{hourMinute}</span>
    </div>
  )
};


const ZeroPaymentsPlaceholder = () => {
  return (
    <div className="m-m:gap-2 themed-font-color flex min-h-[20rem] w-full flex-col items-center sm:gap-4 lg:gap-8">
      <div className="flex-[2]"></div>
      <span className="m-m:text-2xl text-xl font-medium sm:text-4xl">No payments to list...</span>
      <span className="m-m:text-xl text-lg sm:text-3xl">Send a payment to get started!</span>
      <div className="flex-[7]"></div>
    </div>
  )
};

export default PaymentsList;