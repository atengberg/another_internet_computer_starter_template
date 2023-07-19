import { useNavigate } from "react-router-dom";
import AutoEllipsizingTextSpan from "../../../components/AutoEllipsizingTextSpan";
import { RiSendPlaneFill } from "../../../components/Icons";
import { 
  getTextStatusColor, 
  fromBaseUnits, 
  convertExponetialIntoStringWithAllPlaceholderZeros, 
  isNonTrivialString,
  getDisplayDateStrings
} from "../../../utils/utils";
import clsx from "clsx";

const PaymentListItem = (props) => {
  const { 
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
  const statusColor = getTextStatusColor(status.type);
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
    </>
  )
};

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
  tokenSymbol = 'icrc1 tkn',
}) => {
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



export default PaymentListItem;