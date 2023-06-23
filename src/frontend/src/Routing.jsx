
import { Outlet, Routes, Route, useParams } from 'react-router-dom';

import NavMenu from './components/NavMenu';
import Home from './pages/Home';
import Landing from './pages/Landing';
import CountingDownToNavigation from './components/CountingDownToNavigation';

const AppRoutes = ({ isAuthenticated }) => {

  const protectedRoutes = (
    <Route path="/" element={<FilletOutletay />} >
      <Route index element={<Home />} />

      <Route path="chops" element={<FilletOutletay/>} >
        <Route index element={<div className="w-full h-full"/>} />
        <Route path="create" element={<ElementPlaceHolder title="create chops nyi" />} />  

        <Route path="c" element={<FilletOutletay />} >
          <Route 
            path="404" 
            element={<ElementPlaceHolder title="no chops for your principal can be found, create a new one?"/>}  
            />
          <Route 
            path=":principal"
            element={<ChopsDetailTest />} 
            />
        </Route>
      </Route>
     {/* If specific component for non-matching route for authenticated visitors, add path="*" Route here. */}
    </Route>
  );

  const publicRoutes = (
    <Route path="/" element={<FilletOutletay />}>
      <Route index element={<Landing />} />
      {/* If specific component for non-matching route for public visitors, add path="*" Route here. */}
    </Route>
  )

  return (
    <FullWidthHeightParent>
      <NavMenu />
      <Routes>
        {isAuthenticated ? protectedRoutes : publicRoutes }
        {/* Will be general not found */}
        <Route  path="*" element={<CountingDownToNavigation />} />
      </Routes>
    </FullWidthHeightParent>
  )
};


// NYI-TBD (figure out a good way of using a canister user data with useParams)
const ChopsDetailTest = () => {
  const { principal } = useParams();
  return (
    <ElementPlaceHolder title={"NYI"}>
      <span>{`the param was ${principal}`}</span>
    </ElementPlaceHolder>
  )
}

// Utility components for layout. (todo check that thing, uhh )

/****Full width height div wrapping children.**  */
const FullWidthHeightParent = ({ children }) => <div className="w-full h-full overflow-hidden">{children}</div>

/****fi-ˈlā-au̇t-ˌlet-ˌeɪ**   Full width height div wrapping an Outlet.  */
const FilletOutletay = () => <div className="w-full h-full"><Outlet /></div>

const ElementPlaceHolder = ({ title = null, titleStyles = "pt-10 pl-10", children }) => {
  return (
    <div className={`w-full h-full flex flex-col`}>
      {title 
        ? <span className={`w-full text-7xl font-extrabold tracking-widest uppercase ${titleStyles}`}>{title}</span> 
        : null}
      {children}
    </div>
  )
};

export default AppRoutes;
export { FullWidthHeightParent, FilletOutletay, ElementPlaceHolder, CountingDownToNavigation };