import { useState } from "react"

const useTestHook = () => {

  const [val, setVal] = useState(0);
  const inc = () => {
    setVal(() => val + 1);
  };

  return {
    val,
    inc,
    testInc: inc
  }
}

export default useTestHook;