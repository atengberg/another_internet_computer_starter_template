import { useState, useRef, useCallback, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const useInternetIdentity = (callbacks = {}) => {
  const {
    onUserLoggedIn = () => console.log("onUserLoggedIn"),
    onUserLoggedOut = () => console.log("onUserLoggedOut"),
    onIdle = () => console.log("onUserIdle")
  } = callbacks;

  const authClientRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuth = async (client) => {
    if (!client) throw new Error("Cannot update auth state without an auth client!!!");
    const authenticated = await client.isAuthenticated();
    authClientRef.current = client;
    setIsAuthenticated(authenticated);
  };

  const createSetAuthClient = useCallback(() => {
    // Use onIdle callback to redirect route, etc.
    AuthClient.create({ idleOptions: { onIdle }}).then(updateAuth);
  }, [onIdle]);

  useEffect(() => {
    // Initialize an authClient.
    createSetAuthClient();
  }, [createSetAuthClient]);

  const login = useCallback(() => {
    authClientRef.current?.login({
      identityProvider:
        import.meta.env.DFX_NETWORK === 'ic'
          ? 'https://identity.ic0.app/#authorize'
          : `http://localhost:4943?canisterId=${import.meta.env.CANISTER_ID_INTERNET_IDENTITY}#authorize`,
      onSuccess: async () => {
        await updateAuth(authClientRef.current)
        onUserLoggedIn();
      }
    });
  }, [onUserLoggedIn]);

  const logout = useCallback(async () => {
    await authClientRef.current?.logout();
    // Let the previous authClient be garbage collected so when web worker pulls identity, it'll be fresh.
    createSetAuthClient();
    onUserLoggedOut();
  }, [
    createSetAuthClient, 
    onUserLoggedOut
  ]);

  return {
    isAuthenticated,
    login,
    logout,
  };
};

export default useInternetIdentity;