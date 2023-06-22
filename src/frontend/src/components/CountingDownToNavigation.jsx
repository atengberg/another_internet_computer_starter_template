import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 404 / error component will redirect to path after so many seconds. 
// todo add arg options to instantly, set displayed text, etc.
const CountingDownToNavigation = ({ 
  toPath = "/",
  countFrom = 5,
}) => {
  const [count, setCount] = useState(5);
  useEffect(() => {
    const from = parseInt(countFrom);
    if (!isNaN(from) && from >= 0) {
      setCount(from);
    } else {
      throw new Error("Can't count down from non natural counting number!");
    }
  }, [countFrom]);
  const navigate = useNavigate();
  useEffect(() => {
    (count === 0) ? navigate(toPath, { replace: true }) : null;
  }, [toPath, navigate, count]);
  useEffect(() => {
    const countDown = () => setTimeout(() => {
      setCount(() => (count - 1))
    }, 1000);
    (count > 0) ? countDown() : null;
    return () => clearTimeout(countDown);
  }, [count]);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-4xl tracking-widest">
      <span className="pb-[10%]">
        Nothing to see here, redirecting in... 
        <span className="font-extrabold">
          {count}
        </span>
      </span>
    </div>
  )
};

export default CountingDownToNavigation;