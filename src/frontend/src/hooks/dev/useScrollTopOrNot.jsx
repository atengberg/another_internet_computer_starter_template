import { useState, useCallback, useMemo  } from "react";

const useScrollTopOrNot = () => {
  const [top, setTop] = useState(true);
  const onScroll = useCallback((e) => {
    const { target: { scrollTop }} = e;
    setTop(() => scrollTop === 0)
  }, []);
  return useMemo(() => {
    return {
      top, 
      onScroll
    }
  }, [top, onScroll]);
};

export default useScrollTopOrNot;