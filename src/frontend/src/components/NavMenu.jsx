import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useCanister from "../hooks/useCanister";
import LoginLogoutButton from "./LoginLogoutButton";
import useDarkModeHack from "../hooks/useDarkModeHack";
import DarkModeToggle from "./DarkModeToggle";
import IconoirDeveloper from '~icons/iconoir/developer'
import PixelarticonsDebugOff from '~icons/pixelarticons/debug-off'
import PixelarticonsDebug from '~icons/pixelarticons/debug'

// Todo let orientation be prop style (horizontal, vertical, etc).
const NavMenu = () => {
  const { darkMode, toggleDarkMode } = useDarkModeHack({});
  const { isAuthenticated } = useCanister();
  const principal = "principalNYI";
  const navigate = useNavigate();

  const [showDebugOptions, setShowDebugOptions] = useState(false);

  return (
    <div className="w-full px-4 h-20 flex items-center select-none">
      <div className="w-auto h-full flex items-center z-10 group">
        <Link to="/" className="px-2 py-4 flex gap-2 text-2xl transition duration-300 hover:-translate-y-1 active:scale-105">
        <IconoirDeveloper className="mt-1"/>
          <span className="font-extralight tracking-widest text-3xl">AICST</span>
        </Link> 
      </div>
      <div className="flex-1">{` `}</div>
      {isAuthenticated ? 
        <div className="h-full flex items-center gap-4 text-2xl">
          <NavLink 
            /* How to highlight navlink in react router v6. */
            className={({ isActive }) => isActive ? "font-extrabold underline" : null} 
            to={`/`}
              >
              Home
          </NavLink>
          <NavLink 
            /* How to highlight navlink in react router v6. */
            className={({ isActive }) => isActive ? "font-extrabold underline" : null} 
            to={`/chops/c/${principal || "dne"}`}
              >
              My Profile
          </NavLink>
          <Link to="/chops/create">create chops</Link>
        </div>
      : null}
      {(import.meta.env.DEV && showDebugOptions) 
        ? <div className="h-full mx-2 flex items-center gap-4">
            <Link to="/test">{`to: "/test"`}</Link>
            <Link to="/test/test">{`to: "/test/test"`}</Link>
            <Link to="/chops/c/404">{`to: "/chops/c/404"`}</Link>
            <Link to="/chops/c/abcde-12345-abcde-54321">{`to: "/chops/c/abcde-12345-abcde-54321"`}</Link>
            <button className="text-3xl p-2 z-10" onClick={() => setShowDebugOptions(false)}><PixelarticonsDebugOff /></button>
          </div>
        : <button className="mx-2 p-2 text-3xl z-10" onClick={() => setShowDebugOptions(true)}><PixelarticonsDebug /></button> }
      <DarkModeToggle isDarkMode={darkMode} toggleDarkModeFunction={toggleDarkMode} toolTipPlacement={3}/>
      <LoginLogoutButton changeCallback={() => navigate("/")} />
    </div>
  )
};

export default NavMenu;


