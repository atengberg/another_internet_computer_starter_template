import { useEffect } from "react";
import useCanister from "../hooks/useCanister";
import { ElementPlaceHolder } from "../Routing";

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
    <div className="text-center w-full h-full flex flex-col justify-center">
      <div className="pb-[12%]">
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
    </div>
  )
}

export default Home;