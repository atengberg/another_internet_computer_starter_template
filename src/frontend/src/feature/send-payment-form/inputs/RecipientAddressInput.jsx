import { useMemo, useCallback } from "react";
import FormLabel from "../FormLabel";
import QrCodeScanner from "../../qr-code-scanner/QrCodeScanner";
import InfoPlaceholder from "../InfoPlaceholder";
import { RiWallet3Fill } from "../../../components/Icons";

const RecipientAddressInput = ({ 
  inputValue = "",
  onInputValueChanged, 
  onQrCodeScanned,
  disabled = false,
  hasError = false,
  focused = false,
}) => {
 // const inputRef = useRef(null);

  const onInputChanged = useCallback((e) => {
    const newInput = e.currentTarget.value.trim();
    let isValid = true;
    if (newInput.length > 1) {
      // Prevent many invalid inputs:
      isValid = /^(?!.*--)(?!.*\.\.)(?!.*\.-)(?!.*-\.)(?!.*\.0)[0-9a-z-.]+$/.test(newInput);
    }
    onInputValueChanged(isValid ? newInput : inputValue);
  }, [inputValue, onInputValueChanged]);

  return useMemo(() => (
    <div className="form-input-wrapper">
      <FormLabel   
        htmlFor="address-input" 
        labelText="recipient address" 
        icon={<RiWallet3Fill className="stylish-label-icon-size" />} 
      />
      <QrCodeScanner 
        disabled={disabled}
        onQrCodeScanned={onQrCodeScanned}
      />
      <div className="input-content">
        <InfoPlaceholder 
          idName="address-input-hint" 
          descriptionText="Enter or scan the recipient's ICRC1 text address..."
          hasInput={inputValue && inputValue.length > 0}
          hasFocus={focused}
          isError={false}
        />
        <textarea 
          className="w-full resize-none disabled:opacity-30" 
          id="address-input" name="address-input"   
          inputMode="text"
          autoComplete="on"
          rows="3" 
          maxLength="512"
          enterKeyHint="Next"
          spellCheck={false}
          disabled={disabled}
          aria-describedby="address-input-hint"
          placeholder="Enter the recipient address..." 
          value={inputValue}
          onChange={onInputChanged}
        />
      </div>
    </div>
  ), [
    disabled, 
    focused, 
    inputValue, 
    onInputChanged, 
    onQrCodeScanned
  ]);
};

export default RecipientAddressInput;