import clsx from 'clsx';
import RiMoonLine from '~icons/ri/moon-line'
import RiMoonFill from '~icons/ri/moon-fill'
import RiSunLine from '~icons/ri/sun-line'
import RiSunFill from '~icons/ri/sun-fill'
import useTheme from '../../hooks/useTheme';

const DarkModeToggle = ({
  clz = "text-[2em]"
  //Todo generify by adding props as onUI, offUI, isToggled, toggleCB and dropping unnecessary styles. 
}) => {
  const { darkMode, toggleDarkMode } = useTheme();
  // Transitions on the icons' containers (to move in relative to each other):
  const shiftLeft = 'transition duration-200 ease-linear group-active/muon:-translate-x-3';
  const shiftRight = 'transition duration-200 ease-linear group-active/muon:translate-x-3';
  const sunIconsContainerClz = clsx({'order-first': !darkMode}, {[`${shiftLeft}`]: darkMode}, {[`${shiftRight}`]: !darkMode});
  const moonIconContainerClz = clsx({'order-first': darkMode}, {[`${shiftRight}`]: darkMode}, {[`${shiftLeft}`]: !darkMode});
  // Transitions on the icons' themselves:
  const transition = 'transition duration-300 ease-[cubic-bezier(.53,1.43,.85,.76)]';
  const clockwise = 'group-active/muon:rotate-[65deg] group-active/muon:opacity-25 group-active/muon:scale-95';
  const cwclockwise = 'group-active/muon:-rotate-[85deg] group-active/muon:opacity-25 group-active/muon:scale-95';
  const sunFillClz = clsx('opacity-100', transition, clockwise);
  const sunLineClz = clsx('opacity-50', transition, cwclockwise, 'hover:scale-105', 'hover:opacity-65');
  const moonFillClz = clsx('opacity-100', transition, clockwise);
  const moonLineClz = clsx('opacity-50', transition, cwclockwise, 'hover:scale-105', 'hover:opacity-65');
  const buttonClz = clsx(
    'z-10 p-2 w-full flex flex-nowrap items-center gap-3  group/muon hover-alt-fill hover-fill',  
    { 'alt': !darkMode },
  );
  return (
    <div className={clsx('z-30 relative flex', clz)}>
      <button 
        aria-pressed={darkMode}
        title="Toggle Dark Mode"
        aria-labelledby='darkmode-toggle-button-label'
        role="switch"
        className={buttonClz} onClick={() => toggleDarkMode()} 
      >
        <div className={sunIconsContainerClz} aria-hidden={true}>
          {darkMode ? <RiSunLine className={sunLineClz}/> : <RiSunFill className={sunFillClz}/>}
        </div>
        <div className={moonIconContainerClz} aria-hidden={true}>
          {darkMode ? <RiMoonFill className={moonFillClz}/> : <RiMoonLine className={moonLineClz}/>}
        </div>
        <label className="sr-only" id="darkmode-toggle-button-label" name="darkmode-toggle-button-label">toggle dark mode</label>
      </button>
    </div>
  )
};

export default DarkModeToggle;