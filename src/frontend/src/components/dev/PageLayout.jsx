import clsx from "clsx";
import AnimateHeight from "react-animate-height";

import { useMemo, useLayoutEffect, useState, useCallback } from 'react';


const PageLayout = ({
  children
}) => {
  return (
    <div className="">
      {children}
    </div>
  )
}



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
}

const PageLayouta = ({ 
  title,
  children,
  additionalHeaderElements = null
}) => {

  const { top, onScroll } = useScrollTopOrNot();

    // all this is unnecessary, maybe a better solution is present though?
    /*
  const [theAnswer, setTheAnswer] = useState(false);
  useLayoutEffect(() => {    
    const ele = document.getElementById("nestedscrollwrapper");
    const scrollHeight = ele.scrollHeight;
    const scrollcontainer = document.getElementById("scrollcontainer");
    const { clientHeight } = scrollcontainer;
    const diff = scrollHeight - clientHeight;
    const showScrollBar = diff > 0;
    if (theAnswer !== showScrollBar) {
      setTheAnswer(() => showScrollBar);
    }
  },[children, theAnswer])
  */

  const scrollableContainerClz = clsx(
    'w-full h-auto ',
//    'border-t-[8rem] border-b-transparent',
//    'border-b-[8rem] border-b-transparent',
    'mb-10',

  );


  const sectionHeaderClz = clsx(
    'w-full h-auto'
  );

  const accessibleTitleId = `${title}-section`
  return (
    <section className={"h-full w-full relative overflow-hidden"} aria-labelledby={accessibleTitleId}>
      <div className="h-full lg:container lg:mx-auto flex flex-col">
        <div className={sectionHeaderClz}>
          <PageHeader title={title} accessibleTitleId={accessibleTitleId}/>
        </div>
        <div 
          onScroll={onScroll}
          className={scrollableContainerClz} 
          id="scrollcontainer" >
          <div className="opaque-container w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};



const PageHeader = ({
  title, 
  accessibleTitleId, 
}) => {

  const headerTitleClz = clsx(
    'w-full pb-2',
    'text-e8-meteorite dark:text-e8-picton-blue',
    'uppercase font-extrabold tracking-wider',
    'whitespace-nowrap',
    'text-6xl text-shadow-inset-sm text-center',
    'shadow-e8-black/30 dark:shadow-u-snow/30',
    'md:text-6xl md:text-shadow-inset',
    'lg:text-5xl lg:text-shadow-inset-lg',
    'lg:text-start',
    'xl:text-4xl',
  );
  
  return (
    <header className="w-full py-2">
      <h1 id={accessibleTitleId} name={accessibleTitleId}  className={headerTitleClz}>{title}</h1>
    </header>
  )
}


export default PageLayout;


