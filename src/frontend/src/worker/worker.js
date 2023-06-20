import { idlFactory } from "../../../declarations/backend/backend.did.js";
import createWorkerActor from "./createWorkerActor.js";

// Note to self: be sure when deploying between local and mainnet, the deploy was run to 
// actually update the .env accordingly. 
async function getActor() {
  return await createWorkerActor(import.meta.env.CANISTER_ID_BACKEND, idlFactory);
} 

async function ping() {
  console.log(`ping`)
  const backend = await getActor();
  if (backend) {
    const pingCount = await backend.ping();
    const payload = `${pingCount}`;
    self.postMessage({ type: "SET_VALUE", payload, key: "pingCount" });
  }
};

async function queryPing() {
  const backend = await getActor();
  if (backend) {
    const pingCount = `${await backend.getPingCount()}`;
    self.postMessage({ type: "SET_VALUE", payload: pingCount, key: "pingCount" });
  }
}

function onMessage ({ data }) {
  console.info(`WebWorker::self.onmessage() data ${JSON.stringify(data)}`)
  const { type, payload } = data;
  switch (type) {
    case "PING":
      ping();
      return;
    case "QUERY_PING":
      queryPing();
      return;
    default:
      console.info('WebWorker::self.onmessage() with no data action type.')
  };
}

self.addEventListener("message", onMessage);

self.addEventListener("error", e => {
  //const { lineno, filename, message } = e;
  console.error(`webworker error ${JSON.stringify(e)}`)
  throw e;
})
