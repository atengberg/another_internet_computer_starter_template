import { useEffect, useState, useRef, useLayoutEffect, useMemo } from "react"

import { LoremIpsum } from "lorem-ipsum";
import clsx from "clsx";
import useWindowScrollY from "../../hooks/useWindowScrollY";
import useInnerWindowSize from "../../hooks/useInnerWindowSize";
import AnimateHeight from 'react-animate-height';
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";

const lorem = new LoremIpsum();
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getList = (count) => {
  const list = [];
  const l = count ?? 10;
  for (let a = 0; a < l; ++a) {
  
    const id = `${a}`;
    const words = lorem.generateWords(random(1, 5));
    const sentences = lorem.generateSentences(random(1, 5));
    const paragraphs = lorem.generateParagraphs(random(1, 3));
    const e = { id, words, sentences, paragraphs };
    list[a] = e;
  };
  return list;  
}






const Test = () => {


  return (
    <div className="relative h-screen overflow-hidden">
      <BrowserRouter>
        <MiniNav />
        <div className="h-24"/>
        <AltRoutes />

       
      </BrowserRouter>
    </div>

  )
}


const MiniNav = () => {
  const { top } = useWindowScrollY();
  const clz = clsx(
    'fixed z-[99] h-20  w-full outline',
    'flex items-center',
    'trasition duration-500 ease-in-out',
    { 'backdrop-blur-lg': !top },
    { 'py-8': top },
    { 'py-2': !top }
  );

  return (
    <div id="navigation" className={clz}>
      <div className="h-18 flex items-center justify-evenly outline  xl:container xl:mx-auto">
        <Link to="/pageone" className="navigation-link"  element={<PageOne />}>PageOne</Link>
        <Link to="/pagetwo" className="navigation-link" element={<PageTwo />}>PageTwo</Link>
        <Link to="/pagethree" className="navigation-link" element={<PageThree />}>PageThree</Link>
        <Link to="/pagefour" className="navigation-link"  element={<PageFour />}>PageFour</Link>
        </div>
    </div>
  )
};

const AltRoutes = () => {
  return (
    <Routes >
      <Route path="/" exact element={<PageOne />} />
      <Route path="/pageone" exact element={<PageOne />} />
      <Route path="/pagetwo" exact element={<PageTwo />} />
      <Route path="/pagethree" exact element={<PageThree />} />
      <Route path="/pagefour" exact element={<PageFour />} />
    </Routes>
  )
}



/*
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

*/




const PageLayout = ({ 
  title ="the title",
  sectionHeader,
  children 
}) => {
// <div className="text-4xl font-extrabold h-[10%]">{title}</div>s


  const { top } = useWindowScrollY();

  const { size } = useInnerWindowSize();
  const [isOpen, setIsOpen] = useState(false);

  const [sectionContentContainerHeight, setSectionContentContainerHeight] = useState("100%");
  useLayoutEffect(() => {
    // Queue it after any changes take effect.
    setTimeout(() => {
      // Get the viewport available height:
      const { offsetHeight: bodyHeight } = document.body;
      // Get the heights of elements taking up the available height:
      const { offsetHeight: navHeight } = document.getElementById("navigation");
      const { offsetHeight: sectionHeaderHeight } = document.getElementById("section-header");
      // Calculate section content height (leaving any needed space):
      const perfectFactor = 95;
      const diff =  Math.floor(((bodyHeight - (navHeight + sectionHeaderHeight)) / bodyHeight ) * perfectFactor);
      // Update for use by the style (Tailwind utility classes didn't seem to work doing this).
      setSectionContentContainerHeight(() => `${diff}%`);
    }, 1);
  }, [isOpen, children, sectionHeader, title, size]);



  return (
    <div className="h-full xl:container xl:mx-auto">
    
      <div className="flex flex-col" id="section-header">
        <div className="text-xl">{sectionContentContainerHeight}</div>
    
        <details className="text-2xl "  open={isOpen}>
        <summary onClick={() => setIsOpen(() => !isOpen)}>Summary</summary>
          <div className="text-xl">{size.w}</div>
          <div className="text-xl">{size.h}</div>
    
          {sectionHeader ? sectionHeader : null } 
        </details>

      </div>
      <div style={{ height: sectionContentContainerHeight }}>
        <div className='h-full snap-y snap-proximity overflow-y-auto'>
          {children}
        </div>
      </div>
    </div>


  )
}


const PageOne = () => {
  const elements = getList(20);
  const sectionHeaderChildren = (
    <div className="flex flex-col text-4xl">
    <div className="">item one</div>
    <div className="">item two</div>
    <div className="">item three</div>
    <div className="">item four</div>
  </div>
  );
  return (
    <PageLayout sectionHeader={sectionHeaderChildren}>
      <LongList elements={elements}/>
    </PageLayout>
  )
}

const PageTwo = () => {
  const elements = getList(25);
  return (
    <PageLayout >
      <LongList elements={elements}/>
    </PageLayout>
  )
}

const PageThree = () => {
  const elements = getList(8);
  const [show, setShow] = useState(false);
  return (
    <PageLayout>
      <div className="flex flex-col">
      <LongList elements={elements}/>
        <button className="w-full text-center font-extrabold" onClick={() => setShow(() => !show)}>toggle</button>
        { show ? <LongList elements={elements} />: null}
      </div>
    </PageLayout>
  )
}

const PageFour = () => {
  const elements = getList(0);
  return (
    <PageLayout>
      <LongList elements={elements}/>
    </PageLayout>
  )
}

const LongList = ({ elements }) => {
  const liClz = clsx(
    'min-h-[7rem] w-full',
    'border-b-4 border-white',
    'flex items-center gap-5',
    'snap-start'
  )
  return (
    <ul className="opaque-container flex snap-y flex-col">
      {elements.map((e, i) => (
        <li key={e.id} className={clsx(liClz)}>
          <span className="text-6xl font-extrabold">{i}</span>
          <span className={`text-3xl`}>{e.words}</span>
          <span className="">{e.color}</span>
        </li>
      ))}
    </ul>
  )
}

export default Test;