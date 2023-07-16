import { useLayoutEffect, useState, useMemo  } from "react";

const useWindowScrollY = () =>{
  const [state, setState] = useState({ top: true, scrollY: 0 });
  useLayoutEffect(() => {
    const onScroll = () => {
      const { scrollY } = window;
      setState((scrollY > 10) 
        ? { top: false, scrollY }
        : { top: true, scrollY }
      );
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [])
  return useMemo(() => {
    return {
      scrollY: state.scrollY,
      top: state.top
    }
  }, [state])
};

export default useWindowScrollY;
