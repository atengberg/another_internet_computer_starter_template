import { useCallback, useMemo } from 'react';
import MetaPlaceholder from './MetaPlaceHolder';
import FormLabel from "./FormLabel";

import { RiFileEditFill } from '../Icons';

const DescriptionInput = ({ 
  inputValue = "",
  onInputValueChanged, 
  disabled = false,
  focused = false
}) => {
  const onInputChanged = useCallback((e) => {
    onInputValueChanged(e.currentTarget.value.trim());
  }, [onInputValueChanged]);
  return useMemo(() => (
    <div className="form-input-wrapper">
      <FormLabel 
        htmlFor="description-input" 
        labelText="description" 
        icon={<RiFileEditFill className="stylish-label-icon-size" />} 
      />
      <div className="input-content">
        <MetaPlaceholder 
          idName="description-input-hint" 
          descriptionText={`An optional description up to 256 characters...`}
          hasInput={inputValue && inputValue.length > 0}
          hasFocus={focused}
          isError={false}
          />
        <input
          className="text-e8-black dark:text-u-snow w-full p-1 disabled:opacity-30"
          id="description-input" name="description-input"
          type="text"
          inputMode="text"
          autoComplete="on"
          minLength="0"
          maxLength="256"
          aria-describedby="description-input-hint"
          placeholder="Enter an optional description..."
          enterKeyHint="Next"
          disabled={disabled} 
          onChange={onInputChanged}
          value={inputValue || ""}
          />
      </div>
    </div>
  ), [
    disabled, 
    focused, 
    inputValue, 
    onInputChanged
  ]);
};

export default DescriptionInput;