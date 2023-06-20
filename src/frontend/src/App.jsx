import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Outlet, Link, useNavigate, Navigate, Routes, Route, useParams } from 'react-router-dom';

import LoginLogoutButton from "./components/LoginLogoutButton";
import useCanister from "./hooks/useCanister";

const FullWidthHeightParent = ({ children }) => <div className="w-full h-full">{children}</div>
const FilletOutlet = () => <div className="w-full h-full"><Outlet /></div>

const ElementPlaceholder = ({ title = `default placeholder`, children }) => {
  return (
    <div className={`w-full h-full flex flex-col items-center ${children ? "my-auto" : "justify-center"}`}>
      <span className="text-7xl font-extrabold tracking-widest uppercase">{title}</span>
      {children}
    </div>
  )
};

const Home = () => <ElementPlaceholder title="home"/>
const MakePayment = () =>  <ElementPlaceholder title="make payment"/>
const Landing = () =>  <ElementPlaceholder title="landing"/>

const PaymentDetails = ({ validId }) => {
  const checkId = useCallback((id) => validId ? validId(id) : false, [validId]);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    checkId(id) ? null : navigate("/payments/details/notfound", { replace: true });
  }, [id, navigate, checkId])
  return (
    <ElementPlaceholder title={`PaymentId is ${id}`} />
  )
}

const ErrorNotFound = ({ toPath = "/" }) => {
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
      <span>Nothing to see here, redirecting in... <span className="font-extrabold">{ count }</span></span>
    </div>
  )
}

const LoginoutButton = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const click = () => {
    setAuth(() => !auth);
    navigate("/", { replace: true })
  }
  return (
    <button onClick={click} className="h-full w-64 text-center py-2 border-black border-2">{ auth ? "logout" : "login"}</button>
  )
}


const App = () => {

  const [auth, setAuth] = useState(false);

  const ids = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ].map(id => `${id}`);

  const validId = (id) => ids.includes(id);

  const protectedRoutes = (
    <Route path="/" element={<FilletOutlet />}>
      <Route index element={<Home />} />
      <Route path="payments" element={<FilletOutlet />}>
        <Route path="new" element={<FilletOutlet />}>
          <Route index element={<MakePayment />} />
          {/* Now any route path on /payments/new/* just redirects to .../new/ */}
          <Route path="*" element={<Navigate to="/payments/new" replace={true} />} />
        </Route>
        <Route path="details" element={<FilletOutlet/>}>
          {/* Exact url path equal to /payments/details/ will redirect to home (which has list of payments). */}
          <Route exact index element={<Navigate to="/" replace={true} />}/>
          <Route path="notfound" element={<ElementPlaceholder title="no payment for that id can be found"/>} />
          <Route path=":id" element={<PaymentDetails validId={validId} />}/>
        </Route>
      </Route>
    </Route>
  )

  const publicRoutes = (
    <Route path="/" element={<FilletOutlet />}>
      <Route index element={<Landing />} />
     {/* <Route path="signup" element={<Signup />} /> */}
    </Route>
  )

  const nav = (
    <div className="w-full h-20 flex  items-center">
      <div className="h-full w-auto flex items-center">ICPAY</div>
      <div className="flex-1">{` `}</div>
      {auth ? 
        <div className="h-full flex items-center">
          <Link to="/payments/new">Make Payment</Link>
        </div>
      : null}
      {(import.meta.env.MODE === 'development') &&
        <div className="w-auto h-full mx-16 flex items-center gap-4">
         <Link to="/payments/details/1">{`/payments/details/1`}</Link>
         <Link to="/payments/details/dneiderrortest">{`/payments/details/dneiderrortest`}</Link>
         <Link to="/payments/details/nested/test">{`/payments/details/nested/test`}</Link>
         <Link to="/payments/details/">{`/payments/details/`}</Link>
         <Link to="/payments/new/extrapathoffnewtest">{`/payments/new/extrapathoffnewtest`}</Link>
         <Link to="/dnepathtest">{`/dnepathtest`}</Link>
         <Link to="/signup">{`/signup`}</Link>
        </div>
      }
      <LoginoutButton auth={auth} setAuth={setAuth} />
    </div>
  )

  return (
    <BrowserRouter>
      <FullWidthHeightParent>
        {nav}
        <Routes>
          {auth ? protectedRoutes : publicRoutes}
          <Route  path="*" element={<ErrorNotFound />} />
        </Routes>
      </FullWidthHeightParent>
    </BrowserRouter>
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




export default App;