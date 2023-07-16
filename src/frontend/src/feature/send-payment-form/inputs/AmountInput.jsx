
import { useCallback, useMemo } from 'react';
import FormLabel from "../FormLabel";
import InfoPlaceholder from '../InfoPlaceholder';
import { RiScales2Fill } from '../../../components/Icons';

const AmountInput = ({
//  inputMode = 'numeric', // TBDNYI 'decimal' -> to automatically convert to base units.  
  inputValue,
  onInputValueChanged, 
  disabled = false,
  hasError = false,
  focused = false,
}) => {

  // NYI: Let user use non-base units.
  const placeHolderHint = `Enter the number of the token's base units to send...`; 
  /*
  switch (inputMode) {
    case 'numeric':
      placeHolderHint = `Enter the number of the token's base units to send...`; 
      matchMode = new RegExp(/^([0-9]+)$/, 'g');
      break;
    case 'decimal': 
      placeHolderHint = 'Enter the amount of token (can include decimal) to send (not base units)...';
      matchMode = new RegExp(/^([0-9]+)((\.|,)([0-9]+)?)?$/, 'g');
      break;
    default: throw new Error("Send payment amount input mode must be numeric or decimal!");
  }*/
  const delimitInput = useCallback((e) => {
    const matchMode = new RegExp(/^([0-9]+)$/, 'g');
    const { currentTarget: { value: v } } = e;
    const delimit = () => {
      let result = inputValue;
      if (v.length === 0) {
        result = "0";
      } else {
        if (matchMode.test(v)) {
          if (v.length === 1) {
            // Substitute "0." for ".".
            result = (v === '.') ? "0." : v;
          } else {
            // Replace any leading 0's.
            result = v.replace(/^0+/, ''); 
          }
        } 
      }
      return result;
    };
    onInputValueChanged(() => delimit());
  }, [onInputValueChanged, inputValue]);

  return useMemo(() => (
    <div className="form-input-wrapper">
      <FormLabel 
        htmlFor="amount-input" 
        labelText="amount to send" 
        icon={<RiScales2Fill className="stylish-label-icon-size"/>} 
      />
      
      <div className="input-content">
        <InfoPlaceholder 
          idName="amount-input-hint" 
          descriptionText={placeHolderHint} 
          hasFocus={focused}
          hasInput={inputValue && `${inputValue}`.length > 0}
          isError={false}
          />
        <input
          className="p-1 disabled:opacity-30"
          id="amount-input" name="amount-input"
          type="text"
          inputMode="numeric"
          autoComplete="transaction-amount"
          aria-describedby="amount-input-hint"
          placeholder="Enter an amount to send..."
          enterKeyHint="Next"
          onChange={delimitInput}
          value={inputValue}
          disabled={disabled} 
          required
          />
      </div>
    </div>
  ), [
    delimitInput, 
    inputValue, 
    disabled, 
    focused, 
    placeHolderHint
  ]);
};

export default AmountInput;