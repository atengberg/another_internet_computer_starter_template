import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

async function createWorkerActor(canisterId, idlFactory) {
  if (!canisterId || !idlFactory) {
    console.error("Tried to create an authenticated canister actor without specifying which idlFactory or canisterId to use.")
    return;
  }
  const authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true,
    }
  });
  const isAuthenticated = await authClient.isAuthenticated();
  const isProduction = import.meta.env.DFX_NETWORK === 'ic';
  if (!isAuthenticated) {
    // Use the AuthClient created by the frontend to check if idling logs user out, here
    // it just needs to be authenticated as it will be removed when the user does log out (idle or not).
    !isProduction ? console.info(`Webworker tried to create actor without user being authenticated!`) : null;
    return;
  };
  const identity = authClient.getIdentity();
  const host = isProduction ? `https://ic0.app` : `http://localhost:4943`;
  const agent = new HttpAgent({
    identity, 
    host
  });
  if (!isProduction) {
    await agent.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running!");
      console.error(err);
    });
  }
  const actor = Actor.createActor(
    idlFactory, {
      agent, 
      canisterId
    }
  );
  return actor;
};

export default createWorkerActor;