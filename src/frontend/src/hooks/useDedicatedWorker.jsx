import { useRef, useLayoutEffect, useCallback } from 'react';

const useDedicatedWorker = (workerModulePath, onMessageCallback) => {
  const workerRef = useRef(null);
    // Since we want the workerRef populated before the rest, useLayoutEffect is used. 
  useLayoutEffect(() => {
    const w = new Worker(new URL(workerModulePath, import.meta.url), { type: 'module' });
    w.addEventListener('message', ({ data }) => {
      onMessageCallback ? onMessageCallback(data) : console.info(`worker ui onMessage ${JSON.stringify(data)}`);
    });
    workerRef.current = w;
    return () => {  
      workerRef.current?.terminate();
      
      workerRef.current = null;
    };
  }, [workerModulePath, onMessageCallback]);
  const postMessage = useCallback((data = {}) => workerRef.current?.postMessage(data), []);
  return {
    postMessage
  };
};

export default useDedicatedWorker;
