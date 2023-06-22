import { useRef, useLayoutEffect } from 'react';

const ToolTip = ({ 
  text = "I'm a tooltip!", 
  textStyles = `font-bold tracking-tight p-2 rounded-md`,
  toolTipPlacement 
}) => {
  const tipRef = useRef(null);
  //const spanRef = useRef(null);
  useLayoutEffect(() => {
    if (tipRef.current) {
      if (!(window.getComputedStyle(tipRef.current.parentNode).getPropertyValue('position') === 'relative')) {
        throw new Error("Tooltip uses absolute positioning so parent must (should) have position relative!");
      }
      if (!(tipRef.current.parentNode.classList.contains("group"))) {
        throw new Error("ToolTip uses group:hover so parent must have 'group' included as a className!")
      }
    }
  }, []);
  // ~Probably neeed a break or switch to something more meaningful, 
  // anyways pass in style or 1 2 3 4 to place tooltip is why all "this":
  let ttp = toolTipPlacement ?? 2;
  if (!isNaN(parseInt(ttp))) {
    switch (`${ttp}`) {
      case "1": ttp = "-top-6 left-3";      break;
      case "2": ttp = "-bottom-6 left-3";   break;
      case "3": ttp = "-bottom-6 right-3";  break;
      case "4": ttp = "-top-6 right-3";     break;
      default:  ttp = "-top-6 -left-3";     break;
    }
  } else {
    ttp = toolTipPlacement;
  };
  return (
    <div 
      ref={tipRef}
      className={`absolute ${ttp} z-10 opacity-0  text-center transition duration-300 group-hover:opacity-100 group-hover:z-90`}>
      <span className={`whitespace-nowrap ${textStyles}`}>{text}</span>
    </div>
  )
};

export default ToolTip;