import { Outlet, useNavigate, Routes, Route, NavLink, Link, useParams } from 'react-router-dom';
import { useState, useEffect, } from 'react';

import useCanister from './hooks/useCanister';
import LoginLogoutButton from './components/LoginLogoutButton';


const FullWidthHeightParent = ({ children }) => <div className="w-full h-full">{children}</div>

const FilletOutletay = () => <div className="w-full h-full"><Outlet /></div>

const ElementPlaceHolder = ({ title = `default placeholder`, children }) => {
  return (
    <div className={`w-full h-full flex flex-col`}>
      <span className={`text-7xl font-extrabold tracking-widest uppercase text-start ml-12 my-12`}>{title}</span>
      {children}
    </div>
  )
};

// 404 / error component will redirect to path after so many seconds. 
// todo add arg options to instantly, set displayed text, etc.
const CountingDownToNavigation = ({ toPath = "/" }) => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    (count === 0) ? navigate(toPath, { replace: true }) : null;
  }, [toPath, navigate, count])
  useEffect(() => {
    const countDown = () => setTimeout(() => {
      setCount(() => (count - 1))
    }, 1000);
    (count > 0) ? countDown() : null;
    return () => clearTimeout(countDown);
  }, [count]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-4xl tracking-widest">
      <span className="my-auto mt-32">Nothing to see here, redirecting in... <span className="font-extrabold">{ count }</span></span>
    </div>
  )
}


const ChopsDetailTest = () => {
  const { principal } = useParams();

  return (
    <ElementPlaceHolder title={"NYI"}>
      <span>{`the param was ${principal}`}</span>
    </ElementPlaceHolder>
  )
}

const useCanisterInitializer = () => {
  const { isAuthenticated, pingCount, taskWorker } = useCanister();
  useEffect(() => {
    if (isAuthenticated && !pingCount) {
      taskWorker({ type: "QUERY_PING" });
    }
  }, [isAuthenticated, taskWorker, pingCount])
  return {
    pingCount,
    pingIt: () => taskWorker({ type: "PING" })
  }
};

const Home = () => {

  const { pingCount, pingIt } = useCanisterInitializer();

  if (!pingCount) {
    return <div className="w-1/2 text-center text-xl">loading...</div>
  }

  const getWordage = () => (
    pingCount == 0 ? "not even once yet" 
      : pingCount == 1 ? "once" 
        : pingCount == 2 ? "twice" 
          : pingCount > 2 ? `${pingCount} times` 
            : "");

  return (
    <ElementPlaceHolder title="home">
      <div className="text-center">
        <span className="text-3xl tracking-wider leading-8">
          The backend canister has been pinged by an authenticated user
          <span className="font-extrabold">{` ${getWordage()}`}</span>.
        </span>
        <div className="mt-8 flex flex-col h-1/3">
          <span className="text-3xl">Would you like to ping {`${pingCount > 0 ? "it again" : "the backend canister"}?`}</span>
          <button className={`
            mt-16 mx-auto p-4 rounded-full uppercase text-8xl tracking-widest transition w-fit
            hover:scale-105 hover:bg-[#000000] hover:text-white hover:px-10 active:font-extrabold  active:scale-110 focus:scale-125`} 
            onClick={pingIt}
              >
              ping it
          </button>
        </div>
      </div>
    </ElementPlaceHolder>
  )
}

const AppRoutes = () => {

  const { isAuthenticated = false } = useCanister();
  const principal = "principalNYI";

  const navigate = useNavigate();
  const authChangeCallback = () => {
    navigate("/");
  }

  const nav = (
    <div className="w-full h-20 flex items-center">
      <div className="ml-8 w-auto px-4 py-2 flex items-center">Name - Logo</div>
      <div className="flex-1">{` `}</div>
      {isAuthenticated ? 
        <div className="h-full flex items-center gap-4">
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
      {(import.meta.env.DEV) &&
        <div className="w-auto h-full mx-8 flex items-center gap-4">
         <Link to="/test">{`to: "/test"`}</Link>
         <Link to="/test/test">{`to: "/test/test"`}</Link>
         <Link to="/chops/c/404">{`to: "/chops/c/404"`}</Link>
         <Link to="/chops/c/abcde-12345-abcde-54321">{`to: "/chops/c/abcde-12345-abcde-54321"`}</Link>
        </div>
      }
      <LoginLogoutButton changeCallback={authChangeCallback} />
    </div>
  )

  const protectedRoutes = (
    <Route path="/" element={<FilletOutletay />} >
      <Route index element={<Home />} />

      <Route path="chops" element={<FilletOutletay/>} >
        <Route index element={<div className="w-full h-full"/>} />
        <Route path="create" element={<ElementPlaceHolder title="create chops" />} />  

        <Route path="c" element={<FilletOutletay />} >
          <Route 
            path="404" 
            element={<ElementPlaceHolder title="no chops for your principal can be found, create a new one?"/>}  
            />
          <Route 
            path=":principal"
            element={<ChopsDetailTest />} 
            />
        </Route>
      </Route>
     {/* If specific component for non-matching route for authenticated visitors, add path="*" Route here. */}
    </Route>
  );

  const publicRoutes = (
    <Route path="/" element={<FilletOutletay />}>
      <Route index element={<ElementPlaceHolder title="landing welcome page"/>} />
      {/* If specific component for non-matching route for public visitors, add path="*" Route here. */}
    </Route>
  )

  return (
    <FullWidthHeightParent>
      {nav}
      <Routes>
        {isAuthenticated ? protectedRoutes : publicRoutes }
        {/* Will be general not found */}
        <Route  path="*" element={<CountingDownToNavigation />} />
      </Routes>
    </FullWidthHeightParent>
  )
}

export default AppRoutes;
export { FullWidthHeightParent, FilletOutletay, ElementPlaceHolder, CountingDownToNavigation };