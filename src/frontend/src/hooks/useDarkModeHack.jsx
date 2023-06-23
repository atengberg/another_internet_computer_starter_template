import { useState, useLayoutEffect, useCallback, useMemo } from 'react';

// To create dynamic contrast/dark mode can use:
// function invertHex(hex) { return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase() }
// followed by
// const contrastColor = c=>["#000","#fff"][~~([.299,.587,.114].reduce((r,v,i)=>parseInt(c.substr(i*2+1,2),16)*v+r,0)<128)];
// to get color and evaluating properly contrasting text color, then apply as:
// document.documentElement.getElementsByTagName("*").map(e => e.name)
// (or use tailwind theme dark class modifier once defined).

// Note this will fail for images, video (since the filter with invert, need to deselect). 
const useDarkModeHack = ({
  darkBackgroundColor = `#000`
}) => {
  const [toggle,setToggle] = useState((
    localStorage.themeMode === 'dark' 
    || (!('themeMode' in localStorage) 
    && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ));

  useLayoutEffect(() => {
    document.body.style.filter = toggle ? `invert(100%)` : null;
    document.body.style.backgroundColor = toggle ? darkBackgroundColor : 'inherit';
    /* If dark variant has definitions in theme or all over:
      document.documentElement.classList[toggle ? 'add' : 'remove']('dark'); */
  }, [darkBackgroundColor, toggle])

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

export default useDarkModeHack;

