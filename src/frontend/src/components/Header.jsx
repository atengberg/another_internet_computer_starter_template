import { Link, useLocation, useNavigate } from "react-router-dom";

import useCanister from "../hooks/useCanister";
import useTheme from "../hooks/useTheme";

import clsx from "clsx";

import {
  RiLogoutCircleRFill, 
  RiLoginCircleLine,
  RiFileCopyFill, 
  RiDeleteBin7Fill, 
  RiAddCircleFill, 
  RiHomeFill,
  RiMenuFill,
  GameIconsTakeMyMoney,
  IonListCircle,
  RiSunLine,
  RiMoonLine,
  RiBug2Fill,
  RiBug2Line
} from "./Icons";
import { statusEnum, pagesEnum } from "../utils/enums";
import { useEffect, useState } from "react";

const Header = () => {

  const { isAuthenticated, dev } = useCanister();
  const { pathname } = useLocation();

  const [currentPage, setCurrentPage] = useState(pagesEnum.LANDING);

  useEffect(() => {
    if (isAuthenticated) {
      if (pathname === '/payments') {
        setCurrentPage(() => pagesEnum.PAYMENTS);
      } else if (pathname === "/payments/create") {
        setCurrentPage(() => pagesEnum.SEND);
      } else if (/^(\/payments\/p\/)(?:(?!.*--)(?!.*-$)[A-Za-z0-9-]){1,}$/.test(pathname)) {
        setCurrentPage(() => pagesEnum.DETAILS);
      } else {
        setCurrentPage(() => pagesEnum.HOME);
      }
    } else {
      setCurrentPage(() => pagesEnum.LANDING)
    }
  }, [isAuthenticated, pathname])

  switch (currentPage) {
    case pagesEnum.HOME:
      document.title = "Home - ICRC1 Payment Client Demo";
      break;
    case pagesEnum.PAYMENTS:
      document.title =  "Payments List - ICRC1 Payment Client Demo";
      break;
    case pagesEnum.DETAILS:
      document.title =  "Payment Details - ICRC1 Payment Client Demo";
      break;
    case pagesEnum.SEND:
      document.title =  "Send Payment - ICRC1 Payment Client Demo";
      break;
    default:
    case pagesEnum.LANDING:
      document.title =  "ICRC1 Payment Client Demo";
      break;
  };

  function getPageControls(page) {
    switch (page) {
      case pagesEnum.LANDING:
        return null;
      case pagesEnum.HOME:
        return (
          <>
          <SendPaymentWidget />
          <PaymentsListWidget />
          </>
        );
      case pagesEnum.PAYMENTS:
        return (
          <>
          <SendPaymentWidget />
          <HomeWidget />
          </>
        );
      case pagesEnum.DETAILS: {
        const id = pathname.replace('/payments/p/', '');
        return (
          <>
          <CopyPaymentToSendWidget id={id} />
          <HomeWidget />
          </>
        );
      };
      case pagesEnum.SEND:
        return (
          <>
          <HomeWidget />
          </>
        );
    }
  };
  
  return (
    <div className="navigation-height flex items-center px-6 xl:container xl:mx-auto">
      <div className="m-s:gap-5 m-l:gap-6 m-xl:gap-7 flex h-full w-full items-center gap-4 sm:gap-8 md:gap-10 lg:gap-12">
        <BrandLogoWidget />
        <DevMode dev={dev} isAuthenticated={isAuthenticated} />
        <div className="flex-1"></div>
        {getPageControls(currentPage)}
        <ThemeModeWidget />
        <LoginoutWidget />
      </div>
    </div>
  );
};

const DevMode = ({ dev, isAuthenticated }) => {
  if (!dev.isTesting) {
    return null;
  } else {
    return (
      <div className="themed-font-color z-[99]">
          {isAuthenticated 
          ? <RiBug2Fill className="h-12 w-12" onClick={() => dev.logout()}/>
          : <RiBug2Line className="h-12 w-12" onClick={() =>  dev.login()}/>
          }
      </div>
    );
  }
};

const BrandLogoWidget = () => {
  return (
    <header title="Don't YOU want to pay btc for all your goods and services easily?">
      <a href="github" target="_blank" rel="noreferrer">
        <GameIconsTakeMyMoney className="stylish-menu-icon" />
      </a>
    </header>
  );
};

const CopyPaymentToSendWidget = ({ id }) => {
  const { getPaymentById } = useCanister();
  const navigate = useNavigate();
  const click = () => {
    const payment = getPaymentById(id);
    const { amountBaseUnits: a, description, recipientAddress: ra, status } = payment;
    let amount = a;
    let recipientAddress = ra;
    if (status.type === statusEnum.FAILED_INVALID_ADDRESS) {
      recipientAddress = "";
    } else if (status.type === statusEnum.FAILED_TRANSFER_ERR) {
      if (status.extra.toLowerCase().includes("insufficientfunds")) {
        amount = null;
      }
    };
    navigate("/payments/create", { state: { copy: { amount, description, recipientAddress }}});
  }
  return (
    <RiFileCopyFill aria-hidden={true} className="stylish-menu-icon" onClick={click} />
  );
};

const HomeWidget = () => {
  return (
    <MenuLink to="/" ariaText="navigate to user home page">
      <RiHomeFill className="stylish-menu-icon" />
    </MenuLink>
  );
};

const PaymentsListWidget = () => {
  return (
    <MenuLink to="/payments" ariaText="navigate to list of payments page">
      <IonListCircle aria-hidden={true} className="stylish-menu-icon" />
    </MenuLink>
  );
};

const SendPaymentWidget = () => {
  return (
    <MenuLink to="/payments/create" ariaText="navigate to send new payment page">
      <RiAddCircleFill aria-hidden={true} className="stylish-menu-icon" />
    </MenuLink>
  );
};

const MenuLink = ({ 
  to, 
  state = {},
  ariaText,
  children 
}) => {
  const ariaId = `${to.replace(`/`, '-')}-link-label`;
  return (
    <Link to={to} aria-labelledby={ariaId} className="z-[99]" state={state}>
      {children}
      <label className="sr-only" name={ariaId} id={ariaId}>
        {ariaText}
      </label>
    </Link>
  );
};

const ThemeModeWidget = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <button 
      className="z-[99]"
      aria-pressed={darkMode}
      title={`Toggle ${darkMode ? 'Light' : 'Dark'} Mode`}
      aria-labelledby='theme-switch-label'
      role="switch"
      onClick={() => toggleDarkMode()} 
    >
      {darkMode 
        ? <RiMoonLine aria-hidden={true} className="stylish-menu-icon" />
        : <RiSunLine aria-hidden={true} className="stylish-menu-icon" />
      }
      <label className="sr-only" id="theme-switch-label" name="theme-switch-label">
        {`toggle ${darkMode ? 'light' : 'dark'} mode`}
      </label>
    </button>
  );
};


const LoginoutWidget = () => {
  const { isAuthenticated, login, logout } = useCanister();
  return (
    <button 
      aria-pressed={isAuthenticated}
      title={`${isAuthenticated ? "Logout" : "Login"}`}
      aria-labelledby='toggle-authentication-label'
      role="switch"
      onClick={() => isAuthenticated ? logout() : login()} 
    >
      {isAuthenticated 
        ? <RiLogoutCircleRFill aria-hidden={true} className="stylish-menu-icon" />
        : <RiLoginCircleLine aria-hidden={true} className="stylish-menu-icon" />
      }
      <label className="sr-only" id="toggle-authentication-label" name="toggle-authentication-label"
      >
        {`${isAuthenticated ? "logout" : "login in a new browser window and it will return automatically after logging in"}`}
      </label>
    </button>
  );
};

export default Header;
