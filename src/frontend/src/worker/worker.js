import { idlFactory } from "../../../declarations/backend/backend.did.js";
import createWorkerActor from "./createWorkerActor.js";

const getActor = () => createWorkerActor(import.meta.env.CANISTER_ID_BACKEND, idlFactory);

const ping = async () => {
  console.log(`ping`)
  const backend = await getActor();
  if (backend) {
    const pingCount = `${await backend.ping()}`;
    self.postMessage({ type: "SET_VALUE", payload: pingCount, key: "pingCount" });
  }
};

const queryPing = async () => {
  const backend = await getActor();
  if (backend) {
    const pingCount = `${await backend.getPingCount()}`;
    self.postMessage({ type: "SET_VALUE", payload: pingCount, key: "pingCount" });
  }
}

self.onmessage = ({ data }) => {
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
};

self.onerror = (e) => {
  const { lineno, filename, message } = e;
  console.error(`WebWorker::self.onerror(e) with error e ${JSON.stringify(e)}`);
  console.warn(`WebWorker::self.onerror(e) => e is also \n\t${JSON.stringify({ lineno: lineno || "undefined", filename: filename || "undefined", message: message || "undefined",})}`);
  throw e;
}