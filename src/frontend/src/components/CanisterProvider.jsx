import { useMemo, createContext, useReducer, useCallback } from 'react';
import useInternetIdentity from '../hooks/useInternetIdentity';
import useWorker from '../hooks/useWorker';

const CanisterContext = createContext({});

const initReducerState = {
  pingCount: null
}

const reducer = (state, { type, payload, key }) => {
  console.log(`CanisterProvider reducer dispatch called with ${JSON.stringify({ state, type, payload, key})}`)
  switch (type) {
    case "SET_VALUE": {
      return {
        ...state,
        [key]: payload
      };
    }
    case "RESET": {
      return initReducerState;
    }
    default:
      throw new Error(`CanisterProvider's reducer was dispatched an event with no action type!`);
  }
}

const CanisterProvider = ({ children }) => {

  const [state, dispatch] = useReducer(
    reducer,
    initReducerState
  );  
  
  const { postMessage } = useWorker('../worker/worker.js', dispatch);
  const {
    isAuthenticated,
    login,
    logout,
  } = useInternetIdentity({
    onUserLoggedOut: () => dispatch({ type: "RESET" })
  });

  const taskUi = useCallback((data) => dispatch(data), []);
  const taskWorker = useCallback((data) => postMessage(data), [postMessage]);

  const memeod = useMemo(() => ({
    ...state,
    isAuthenticated,
    login,
    logout,
    taskWorker,
    taskUi
  }), [
    state,
    isAuthenticated,
    login,
    logout,
    taskWorker,
    taskUi
  ]);

  return (
    <CanisterContext.Provider value={memeod}>
      {children}
    </CanisterContext.Provider>
  );
};

export default CanisterProvider;
export { CanisterContext };