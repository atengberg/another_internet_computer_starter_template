import { useState, useLayoutEffect, useCallback, useMemo } from 'react';

const useTheme = () => {
  const [toggle,setToggle] = useState((
    localStorage.themeMode === 'dark' 
    || (!('themeMode' in localStorage) 
    && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ));

  useLayoutEffect(() => {
      document.documentElement.classList[toggle ? 'add' : 'remove']('dark'); 
  }, [toggle]);

  const toggleDarkMode = useCallback(() => { 
    toggle ? localStorage.removeItem("themeMode") : localStorage.setItem("themeMode", "dark");
    setToggle(() => !toggle);
  }, [toggle, setToggle]);

  return useMemo(() => ({ 
    darkMode: toggle, 
    toggleDarkMode 
  }), [ 
    toggle, 
    toggleDarkMode 
  ]);
};













export default useTheme;

/*
// Unrelated to the above hook, but related to theming...
// see https://stackoverflow.com/questions/28157125/why-does-transform-break-position-fixed/28157774#28157774 
// function invertHex(hex) { return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase() }
// const contrastColor = c=>["#000","#fff"][~~([.299,.587,.114].reduce((r,v,i)=>parseInt(c.substr(i*2+1,2),16)*v+r,0)<128)];
*/
