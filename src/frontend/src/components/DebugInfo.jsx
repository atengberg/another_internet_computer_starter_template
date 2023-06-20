import { useEffect, useState } from "react";

// Early attempt on just verifying certain initial setup was working, 
// though can be used otherwise. Here just in case. 
const DebugInfo = ({ vals, initShow = false }) => {
  const vvals = vals ?? {
    // Note using "import-dot-meta-dot-env" can cause Vite to bug out during build. 
    ["import meta env"]: import.meta.env,

  };
  const [show, setShow] = useState(null);
  useEffect(() => { setShow(() => initShow)}, [initShow]);
  return (
    <div className="fixed w-1/2">
      <button 
        onClick={() => setShow(show => !show)} 
        className="font-extrabold text-4xl p-4 rounded-full shadow-lg"
          >{show ? "X" : "DEBUG"}
      </button>
      {show && 
      <div className="bg-black text-white mt-2 rounded-lg px-4 py-8">
        <ul className="w-full flex flex-col break-words gap-4">
            {[...Object.entries(vvals)].map(([key, value]) => (
              <li key={`${key}${value}`}>
                <span className="text-4xl font-extrabold">{`${key} `}</span>
                <span>{`${`${value}`==='[object Object]' ? JSON.stringify(value) : value }`}</span>
              </li>
            ))}
        </ul> 
      </div>}
    </div>
  )
};

export default DebugInfo;