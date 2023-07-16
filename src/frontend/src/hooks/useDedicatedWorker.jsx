import { useRef, useLayoutEffect } from 'react';

// Passing in url location seem to trigger failure of asset canister to create worker,
// so instead hardcorded (can only )

const useDedicatedWorker = (onMessageCallback) => {
  const workerRef = useRef(null);
    // Since we want the workerRef populated before the rest, useLayoutEffect is used. 
  useLayoutEffect(() => {
    const w = new Worker(new URL("../worker/worker.js", import.meta.url), { type: 'module' });
    w.addEventListener('message', ({ data }) => {
      onMessageCallback ? onMessageCallback(data) : console.log(`worker ui onMessage ${JSON.stringify(data)}`);
    });
    workerRef.current = w;
    return () => {  
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [onMessageCallback]);
  const postMessage = (data = {}) => workerRef.current?.postMessage(data);
  return {
    postMessage
  };
};

export default useDedicatedWorker;
