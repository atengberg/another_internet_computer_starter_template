import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import RiBugLine from '~icons/ri/bug-line'
import RiBugFill from '~icons/ri/bug-fill'
import clsx from "clsx";

const DebugMenu = ({ position = "top-0 left-0"}) => {
  const [debug, showDebug] = useState(true);
  const wrapperClz = clsx('z-[55] absolute bottom-0 left-[1em] w-full flex items-center gap-2', position)
  const debugToggleClz = 'px-2 py-2 bg-zinc-800 text-white text-[2.5em] rounded-full cursor-pointer'
  const bugLinkClz = 'px-2 py-1 border-2 border-black rounded-lg bg-zinc-800 text-white  text-[1.5em] cursor-pointer';
  return (
    <div className={wrapperClz}>
      {debug ? <RiBugLine className={debugToggleClz} onClick={()=>showDebug(()=>false)}/> : <RiBugFill  className={debugToggleClz} onClick={()=>showDebug(()=>true)}/>}
      {debug ? <>
        <Link className={bugLinkClz} to="/">{`to="/"`}</Link>
        <Link className={bugLinkClz} to="/payments/">{`2>/payments/`}</Link>
        <Link className={bugLinkClz} to="/payments/create/">{`2>/ps/c/`}</Link>
        <Link className={bugLinkClz} to="/payments/create/404a">{`2>/ps/c/404a`}</Link>
        <Link className={bugLinkClz} to="/payments/p/">{`2>/ps/p/`}</Link>
        <Link className={bugLinkClz} to="/payments/p/0">{`2>/ps/p/0`}</Link>
        <Link className={bugLinkClz} to="/payments/p/404a">{`2>/ps/p/404a`}</Link>
      </> : null}
    </div>
  )
};

export default DebugMenu;