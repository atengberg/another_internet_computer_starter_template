import { useRef, useLayoutEffect } from 'react';

const useWorker = (sourceFilePath, onMessageCallback) => {
  const workerRef = useRef(null);
    // Since we want the workerRef populated before the rest, useLayoutEffect is used. 
  useLayoutEffect(() => {
    let mounted = true;
    const w = new Worker(new URL(sourceFilePath, import.meta.url), { type: 'module' });
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
  }, [sourceFilePath, onMessageCallback]);
  const postMessage = (data = {}) => workerRef.current?.postMessage(data);
  return {
    postMessage
  }
};

export default useWorker;
