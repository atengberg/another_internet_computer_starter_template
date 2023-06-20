import { useRef, useLayoutEffect } from 'react';

// Passing in url location seem to trigger failure of asset canister to create worker.
const useWorker = (onMessageCallback) => {
  const workerRef = useRef(null);
    // Since we want the workerRef populated before the rest, useLayoutEffect is used. 
  useLayoutEffect(() => {
    let mounted = true;
    const w = new Worker(new URL("../worker/worker.js", import.meta.url), { type: 'module' });
    w.addEventListener('message', ({ data }) => {
      if (mounted && onMessageCallback) {
        onMessageCallback(data);
      }
    });
    workerRef.current = w;
    return () => {  
      mounted = false;
      workerRef.current?.terminate();
      workerRef.current = null;
    }
  }, [onMessageCallback]);
  const postMessage = (data = {}) => workerRef.current?.postMessage(data);
  return {
    postMessage
  }
};

export default useWorker;
