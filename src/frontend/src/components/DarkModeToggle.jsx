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
      <div className={`absolute ${ttp} z-10 opacity-0  w-40 text-center transition duration-300 group-hover:opacity-100 group-hover:z-90`}>
        <span className="font-bold tracking-tight p-2 rounded-md">toggle {`${isDarkMode ? "light" : "dark"}`} mode</span>
      </div>
    </div>
  )
};

export default DarkModeToggle;