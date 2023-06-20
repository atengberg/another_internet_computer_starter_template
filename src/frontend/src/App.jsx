import { useEffect, useState } from "react";

import LoginLogoutButton from "./components/LoginLogoutButton";
import useCanister from "./hooks/useCanister";

const App = () => {

  const { 
    isAuthenticated,
    pingCount,
    taskWorker
  } = useCanister();

  useCanisterInitializer();

  return (
    <div className="relative w-full h-screen">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {isAuthenticated 
          ? 
          <PingDisplay 
            pingCount={pingCount} 
            pingIt={() => taskWorker({ type: "PING" })} 
            isAuthenticated={isAuthenticated}
            />
          :
          <span className="text-4xl">
            You are not authenticated and cannot interact with the backend canister until you do so.
          </span>
        }
      </div>
      <div className="absolute top-3 right-3 w-auto h-auto">
        <LoginLogoutButton />
      </div>
      <div className="absolute top-3 left-3 w-auto h-auto">
        <DebugInfo />
      </div>
    </div>
  )
};

// todo make this generic
const useCanisterInitializer = () => {
  const { isAuthenticated, pingCount, taskWorker } = useCanister();
  useEffect(() => {
    if (isAuthenticated && !pingCount) {
      taskWorker({ type: "QUERY_PING" });
    }
  }, [isAuthenticated, taskWorker, pingCount])
};


const PingDisplay = ({ pingCount, pingIt }) => {  

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
  )
};

const DebugInfo = ({ vals, initShow = false }) => {
  const vvals = vals ?? {
    // Note using "import-dot-meta-dot-env" can cause Vite to bug out during build. 
    ["import meta env"]: import.meta.env,

  };
  const [show, setShow] = useState(null);
  useEffect(() => { setShow(() => initShow)}, [initShow]);
  return (
    <div className="fixed w-1/2">
      <button 
        onClick={() => setShow(show => !show)} 
        className="font-extrabold text-4xl p-4 rounded-full shadow-lg"
          >{show ? "X" : "DEBUG"}
      </button>
      {show && 
      <div className="bg-black text-white mt-2 rounded-lg px-4 py-8">
        <ul className="w-full flex flex-col break-words gap-4">
            {[...Object.entries(vvals)].map(([key, value]) => (
              <li key={`${key}${value}`}>
                <span className="text-4xl font-extrabold">{`${key} `}</span>
                <span>{`${`${value}`==='[object Object]' ? JSON.stringify(value) : value }`}</span>
              </li>
            ))}
        </ul> 
      </div>}
    </div>
  )
};


export default App;