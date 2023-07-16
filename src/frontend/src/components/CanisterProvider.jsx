import { useMemo, createContext, useReducer, useCallback, useEffect, useRef } from 'react';

import { stateKeys, actionTypes } from '../utils/enums';

import useInternetIdentity from '../hooks/useInternetIdentity';
import useDedicatedWorker from '../hooks/useDedicatedWorker';
import getMockPayments from '../utils/mock';
import Spinner from './Spinner';

const CanisterContext = createContext({});

const initReducerState = {
  initialized: { 
    canisterMetadata: false, 
    accountStateSync: false,
    // Since using backround polling don't need the others. 
  },
  canisterMetadata: null,
  accountAddress: null,
  currentBalanceBaseUnits: null,
  createdCount: null,
  payments: null,
}

const reducer = (state, { type, key, payload }) => {
  console.log(`CanisterProvider reducer dispatch called with ${JSON.stringify({ type, payload, key})}`);
  switch (type) {
    case actionTypes.INITIALIZED: {
      const { initialized } = state;
      initialized[key] = payload;
      return {
        ...state,
        initialized
      };
    }
    case actionTypes.VALUE: {
      return {
        ...state,
        ...payload
      };
    }
    case actionTypes.UPDATE: {
      const { payment } = payload;
      let { payments = [] } = state;
      if (payload?.fromClient) {
        payments.unshift(payment);
      } else {
        payments = payments.map(p => (payment.clientPaymentId === p.clientPaymentId) ? payment : p);
      }
      return {
        ...state,
        payments
      };
    }
    case actionTypes.ERROR: {
      // Todo 
      return {
        ...state,
      };
    }
    case actionTypes.RESET: {
      return initReducerState;
    }
    default:
      throw new Error(`CanisterProvider's reducer was dispatched an event with no action type!`);
  }
};








const CanisterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    initReducerState
  );  
  const { postMessage } = useDedicatedWorker(dispatch);
/*
  const onLogout = useCallback(() => {
    dispatch({ 
      type: actionTypes.VALUE, 
      payload: { 
        payments: null,
        createdCount: null,
        accountAddress: null,
        currentBalanceBaseUnits: null
      }    
    })
    dispatch({ 
      type: actionTypes.INITIALIZED,
      key: stateKeys.accountStateSync,
      payload: false
    })
    postMessage({ type: actionTypes.RESET });
    window.location.reload();
  }, [postMessage])
*/
  const {
    dev,
    isAuthenticated,
    login,
    logout,
  } = useInternetIdentity({
    onUserLoggedOut: () => window.location.reload()
  });

  useEffect(() => { return () => dispatch({ type: actionTypes.RESET });}, []);
  
  // Note: better to declare specifics methods than expose either of these in the context. 
  const taskUi = useCallback((data) => dispatch(data), []);
  const taskWorker = useCallback((data) => postMessage(data), [postMessage]);
  const getPaymentById = useCallback((id) => state?.payments?.find(p => p.id === id), [state]);

  const memeod = useMemo(() => ({
    ...state,
    isAuthenticated,
    dev,
    login,
    logout,
    taskWorker,
    taskUi,
    getPaymentById,
  }), [
    state,
    isAuthenticated,
    dev,
    login,
    logout,
    taskWorker,
    taskUi,
    getPaymentById,
  ]);

  useEffect(() => {
    if (!state.initialized.canisterMetadata) {
      if (!state.canisterMetadata) {
        const key = stateKeys.canisterMetadata;
        taskUi({ type: actionTypes.INITIALIZED, key, payload: true });
        taskWorker({ type: actionTypes.QUERY, key });
      }
    }
  }, [state, taskUi, taskWorker]);

  useEffect(() => {
    if (isAuthenticated) {
      if (!state.initialized.accountStateSync) {
        if (!state.payments) {
          const key = stateKeys.accountStateSync;
          taskUi({ type: actionTypes.INITIALIZED, key, payload: true });
          taskWorker({ type: actionTypes.QUERY, key });
        }
      }
    }
  }, [isAuthenticated, state, taskUi, taskWorker]);

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

export { CanisterContext as useCanisterCanisterBinding };


