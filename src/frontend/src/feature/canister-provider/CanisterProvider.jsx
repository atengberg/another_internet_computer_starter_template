import { useMemo, createContext, useReducer, useCallback, useEffect } from 'react';
import useInternetIdentity from '../../hooks/useInternetIdentity';
import useDedicatedWorker from '../../hooks/useDedicatedWorker';
import Spinner from '../../components/Spinner';
import reducer, { initReducerState } from "./canister-provider-reducer";
import { stateKeys, actionTypes } from '../../utils/enums';

const CanisterContext = createContext({});

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
export { CanisterContext as canisterContextBinding };


