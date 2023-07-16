import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Reloads the current route if the browser is refreshed. */
const useRoutePathReloader = () => {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    performance.getEntriesByType('navigation').filter(({ type }) => {
      if (type === 'reload') {
        if (state) {
          navigate(pathname, { state })
        } else {
          navigate(pathname)
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, navigate])
};

export default useRoutePathReloader;
