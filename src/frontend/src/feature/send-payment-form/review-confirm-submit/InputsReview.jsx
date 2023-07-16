import { useMemo } from "react";

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

export default InputsReview;