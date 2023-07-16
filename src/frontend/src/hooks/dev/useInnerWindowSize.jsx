import { useState, useLayoutEffect, useMemo } from 'react';

const useInnerWindowSize = () => {
  const [size, setSize] = useState({
    w: window.innerWidth, 
    h: window.innerHeight
  });
  useLayoutEffect(() => {
    const onResize = () => {
      const ns = {
        w: window.innerWidth,
        h: window.innerHeight
      };
      setSize(() => ns);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return useMemo(() => ({ size }), [size]);
};

export default useInnerWindowSize;