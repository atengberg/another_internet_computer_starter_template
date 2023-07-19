import { useMemo, createContext, useReducer, useCallback, useEffect } from 'react';
import useInternetIdentity from '../../hooks/useInternetIdentity';
import useDedicatedWorker from '../../hooks/useDedicatedWorker';
import Spinner from '../../components/Spinner';
import reducer, { initReducerState } from "./canister-provider-reducer";
import { stateKeys, actionTypes } from '../../utils/enums';

import path from 'path';




const CanisterContext = createContext({});

const CanisterProvider = ({ children, workerFilePath }) => {
  // Init the reducer:
  const [state, dispatch] = useReducer(
    reducer,
    initReducerState
  );  
  // Init the webworker handler, passing it the worker's path and reducer's dispatch:
  const { postMessage } = useDedicatedWorker(workerFilePath, dispatch);
  // Init the Internet Identity hook:
  const {
    // Dev is ad-hoc auth bypass for testing. Better solution?
    dev,
    isAuthenticated,
    login,
    logout,
  } = useInternetIdentity({
    onUserLoggedOut: () => window.location.reload()
  });

  // Cleanup when unmounted:
  useEffect(() => { return () => dispatch({ type: actionTypes.RESET });}, []);
  
  // Called by SendPayment when sending a payment is confirmed: the UI is updated 
  // with the view model of the pending payment until the call to the backend canister 
  // completes via the webworker, which then updates the UI accordingly.
  const onDispatchSendPayment = useCallback((args, payment) => {
    // Update the UI with the pending client created payment viewmodel:
    dispatch({ 
      type: actionTypes.UPDATE, 
      key: stateKeys.payment, 
      payload: { 
        payment, 
        fromClient: true 
      } 
    });
    // Post the send_payment call to the canister:
    postMessage({ 
      type: actionTypes.UPDATE, 
      key: stateKeys.payment, 
      args
    });
  }, [postMessage])

  const getPaymentById = useCallback((id) => state?.payments?.find(p => p.id === id), [state]);

  //If more functionality needed, these could be generally used to:
  // 1) Dispatch events to the reducer/UI:
  //const taskUi = useCallback((data) => dispatch(data), []);
  // 2) Dispatch events to the webworker:
  //const taskWorker = useCallback((data) => postMessage(data), [postMessage]);
  // Just make them available in the memoization below:

  // Memoize for performance, also prevents 
  const memeod = useMemo(() => ({
    ...state,
    isAuthenticated,
    dev,
    login,
    logout,
    onDispatchSendPayment,
    getPaymentById,
  }), [
    state,
    isAuthenticated,
    dev,
    login,
    logout,
    onDispatchSendPayment,
    getPaymentById,
  ]);

  // Initializes canister metadata:
  useEffect(() => {
    if (!state.initialized.canisterMetadata) {
      if (!state.canisterMetadata) {
        const key = stateKeys.canisterMetadata;
        dispatch({ type: actionTypes.INITIALIZED, key, payload: true });
        postMessage({ type: actionTypes.QUERY, key });
      }
    }
  }, [state, postMessage]);

  // Initializes account state sync / backend polling:
  useEffect(() => {
    if (isAuthenticated) {
      if (!state.initialized.accountStateSync) {
        if (!state.payments) {
          const key = stateKeys.accountStateSync;
          dispatch({ type: actionTypes.INITIALIZED, key, payload: true });
          postMessage({ type: actionTypes.QUERY, key });
        }
      }
    }
  }, [isAuthenticated, state, postMessage]);

  // Show loading spinner while these are still being set, if authenticated:
  if (isAuthenticated) {
    if ((!(state?.canisterMetadata?.decimals)) || (!(state?.payments)) || (!(state?.accountAddress))){
      return <Spinner />;
    }; 
  };

  return (
    <CanisterContext.Provider value={memeod}>
      {children}
    </CanisterContext.Provider>
  );
};

export default CanisterProvider;
export { CanisterContext as canisterContextBinding };


