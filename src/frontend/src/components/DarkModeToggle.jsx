import { useLayoutEffect, useRef } from 'react';
import ToolTip from './ToolTip';
import BiMoon from '~icons/bi/moon' // outlined
import BiMoonFill from '~icons/bi/moon-fill'
import BiSun from '~icons/bi/sun'
import BiSunFill from '~icons/bi/sun-fill'

const DarkModeToggle = (args = {}) => {
  const {
    isDarkMode = false, 
    toggleDarkModeFunction = () => 0, 
    size = 2, 
    toolTipPlacement // Cartesian coords (+x+y 1, +x-y 2, -x-y 3, -x+y 4).
  } = args;
  // Moon is slightly larger by default.
  const adjustMoonSize = (size * .8) + 0.0;
  const sunSizeStyle = { width: `${size}em`, height: `${size}em` };
  const moonSizeStyle = { width: `${adjustMoonSize}em`, height: `${adjustMoonSize}em` };
  return (
    <div className="relative group" >
      <button className={`z-50 flex gap-3 flex-nowrap items-center px-4 py-2 group z-70`} onClick={() => toggleDarkModeFunction()} >
        <div className={`transition duration-300 
                          ${isDarkMode ? "opacity-50 group-active:-translate-x-2" : "order-first group-active:translate-x-2"}`}>
          {isDarkMode 
            ? <BiSun className="transition duration-300 group-active:rotate-45 z-40" style={sunSizeStyle}/> 
            : <BiSunFill className="transition duration-300 group-active:-rotate-45 group-active:z-20" style={sunSizeStyle}/>}
        </div>
        <div className={`transition duration-300 
                          ${isDarkMode ? "order-first group-active:translate-x-2" : "opacity-50 group-active:-translate-x-2"}`}>
          {isDarkMode 
            ? <BiMoonFill className="transition duration-300 group-active:rotate-90 group-active:z-20" style={moonSizeStyle}/> 
            : <BiMoon className="transition duration-300 group-active:-rotate-90  z-40"  style={moonSizeStyle}/>}
        </div>
      </button>
      <ToolTip 

        text={`toggle ${isDarkMode ? "light" : "dark"} mode`} 
        toolTipPlacement={3}
        />
    </div>
  )
};

export default DarkModeToggle;