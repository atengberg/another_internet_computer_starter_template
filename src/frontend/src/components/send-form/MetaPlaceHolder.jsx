import { useMemo } from "react";
import clsx from "clsx";

const MetaPlaceholder = ({
  idName,
  descriptionText, 
  isError = false,
  hasFocus = false,
  hasInput = false,
}) => {
  const spanTextClz = clsx(
    { 'text-e8-razzmatazz': isError },
    { 'text-e8-meteorite/80 dark:text-u-snow/80': !isError },
  );
  const showMetaText = hasFocus && hasInput;
  return useMemo(() => (
    <div className="input-placeholder">
      {showMetaText 
        ? <span id={idName} name={idName} className={spanTextClz}>{descriptionText}</span> 
        : null
      }
    </div>
  ), [
    idName, 
    descriptionText, 
    spanTextClz, 
    showMetaText
  ]);
};

export default MetaPlaceholder;