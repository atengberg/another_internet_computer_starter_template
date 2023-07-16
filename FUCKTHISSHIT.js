// Manually polyfill BigInt support since not using TS:
BigInt.prototype.toJSON = function () { return this.toString(); };

import { idlFactory } from "../../../declarations/backend/backend.did.js";
import createAuthenticatedWorkerActor, { createAnonymousActor, createDevActor } from "./createWorkerActor.js";
import { getActor as getActor_updated } from "./createWorkerActor.js";
// const backend = await getActor_updated({ anonymous: false, testing: false });

import { statusEnum, stateKeys, actionTypes } from "../utils/enums.js";
import {
  flip,
  randomNat,
  nsToJsDate,
  toBaseUnits,
  fromBaseUnits,
  containsDecimalPoint,
  parseSendPaymentResponse,
  parseAccountBalanceResponse,
  parseTokenCanisterMetadataResponse,
  parseAccountPaymentsResponse,
  parsePayment,
  parseStatus,
  prepareSendPaymentArgs,
  getPaymentFromSendPaymentResponse,
  getStatusMessage,
  getDisplayDateStrings
} from "../utils/utils.js";



let syncTimer;

// Note to self: be sure when deploying between local and mainnet, the deploy was run to 
// actually update the .env accordingly. 
async function getActor(isAnonymous = false, testing = false) {
  if (testing) {
    return await createDevActor(import.meta.env.CANISTER_ID_BACKEND, idlFactory);
  } else {
    if (isAnonymous) {
      return await createAnonymousActor(import.meta.env.CANISTER_ID_BACKEND, idlFactory);
    } else {
      return await createAuthenticatedWorkerActor(import.meta.env.CANISTER_ID_BACKEND, idlFactory);
    }
  }
} 

async function callCanister({ 
  anon = false,
  method,
  key,
  payload,
  testing = false,
  okActionKey = actionTypes.VALUE,
  responseHandler = (r) => r
}) {
  const backend = await getActor(anon, testing) 
  let response = await (payload ? backend[method]({...payload}) : backend[method]());
  response = responseHandler(response);
  if (response?.ok) {
    self.postMessage({ type: okActionKey, key, payload: { ...response.ok }});
  } else {
    self.postMessage({ type: "ERROR", key, payload: { ...response.err }});
  }
}

async function syncCall(testing) {
  callCanister({
    anon: false,
    method: 'get_account_balance',
    key: stateKeys.accountBalance,
    payload: null,
    testing: testing,
    okActionKey: actionTypes.VALUE,
    responseHandler: parseAccountBalanceResponse
  });
  callCanister({
    anon: false,
    method: 'get_account_payments',
    key: stateKeys.accountPayments,
    payload: null,
    testing: testing,
    okActionKey: actionTypes.VALUE,
    responseHandler: parseAccountPaymentsResponse
  });
};

function onMessage ({ data }) {
  const { type, key = null, args = null } = data;
//  console.info(`WebWorker::self.onmessage() data ${JSON.stringify({ data , key, args })}`)
  switch (type) {
    case actionTypes.QUERY: 
      switch (key) {
        case stateKeys.canisterMetadata:
          callCanister({
            anon: true,
            method: 'get_icrc1_token_canister_metadata',
            key,
            payload: null,
            okActionKey: actionTypes.VALUE,
            responseHandler: parseTokenCanisterMetadataResponse
          })
          return;
        case stateKeys.accountStateSync: 
          syncCall(args?.testing);
          //syncTimer = setInterval(() => syncCall(args?.testing), 10000);
          return;
      }
      return;
    case actionTypes.UPDATE: 
      // Only one "update" method:
      callCanister({
        anon: false,
        method: 'send_payment',
        key: stateKeys.payment,
        payload: args.payload,
        testing: args?.testing,
        okActionKey: actionTypes.UPDATE,
        responseHandler: parseSendPaymentResponse
      });
      return;
    case actionTypes.RESET:
      clearInterval(syncTimer);
      syncTimer = null;
      self.close();
      return;
  }
}

self.addEventListener("message", onMessage);


/*


import { idlFactory } from "../../../declarations/backend/backend.did.js";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import fetch from 'isomorphic-fetch';
const getBackend = async () => {
  const agent = new HttpAgent({identity: Secp256k1KeyIdentity.generate(), fetch, host: `http://127.0.0.1:4943` });
  await agent.fetchRootKey().catch((err) => { console.error(err) })
  return Actor.createActor(idlFactory, { agent, canisterId:  import.meta.env.CANISTER_ID_BACKEND } );
}
export default getBackend;

*/






// Manually polyfill BigInt support since not using TS:
BigInt.prototype.toJSON = function () { return this.toString(); };

import { idlFactory } from "../../../declarations/backend/backend.did.js";
import createAuthenticatedWorkerActor, { createAnonymousActor } from "./createWorkerActor.js";
import { statusEnum, stateKeys, actionTypes } from "../utils/enums.js";
import {
  flip,
  randomNat,
  nsToJsDate,
  toBaseUnits,
  fromBaseUnits,
  containsDecimalPoint,
  prepareSendPaymentArgs,
  parseSendPaymentResponse,
  getPaymentFromSendPaymentResponse,
  parsePayment,
  parseStatus,
  parseAccountBalanceCallResponse,
  parseTokenCanisterMetadataResponse,
  getStatusMessage,
  getDisplayDateStrings
} from "../utils/utils.js";


// Note to self: be sure when deploying between local and mainnet, the deploy was run to 
// actually update the .env accordingly. 
async function getActor() {
  return await createAuthenticatedWorkerActor(import.meta.env.CANISTER_ID_BACKEND, idlFactory);
} 

let timer;

function handleMetadataResponse(r) {
  if (r?.ok) {
    const { canisterId, metadata: metadatas = [] } = r.ok;
    const metadata = metadatas.reduce((acc, [k, v]) => ({
      ...acc,
      [k.replace('icrc1:', '')]: (Object.values(v)[0])
    }), { canisterId });
    return { ok:  metadata }
  } else {
    return { err: r.err.msg }
  }
}


async function queryMetadata() {
  try {
    const backend = await getActor();
    const response = await backend.get_icrc1_token_canister_metadata();
    if (response?.ok) {
      const { ok: { canisterId, metadata: canisterMetadata } } = response;
      const metadata = canisterMetadata.reduce((acc, [k, v]) => ({
        ...acc,
        [k.replace('icrc1:', '')]: (Object.values(v)[0])
      }), { canisterId });
      self.postMessage({ type: "VALUE", key: "canisterMetadata", payload: metadata });
    }
  } finally {
    self.postMessage({ type: "LOADING", key: "canisterMetadata", payload: false });
  }
}

async function queryPayments() {
  try {
    const backend = await getActor();
    const response = await backend.get_account_payments();
    if (response?.ok) {
      const { ok: { atTime, payments, createdCount } } = response;
      const timestamp = nsToMs(atTime);
      const metadata = canisterMetadata.reduce((acc, [k, v]) => ({
        ...acc,
        [k.replace('icrc1:', '')]: (Object.values(v)[0])
      }), { canisterId });
      self.postMessage({ type: "VALUE", key: "canisterMetadata", payload: metadata });
    }
  } finally {
    self.postMessage({ type: "LOADING", key: "canisterMetadata", payload: false });
  }
}






async function queryCanisterMetadata() {
  try {
    const backend = await getActor();
    if (backend) {
      const response = await backend.get_icrc1_token_canister_metadata();
      if (response?.ok?.metadata && response.ok.metadata.length > 0) {
        const metadata = response.ok.metadata.reduce((acc, [k, v]) => {
          return {
            ...acc,
            [k.replace('icrc1:', '')]: (Object.values(v)[0])
          }
        }, {});
        self.postMessage({ 
          type: "VALUE", 
          payload: metadata, 
          key: 'canisterMetadata' 
        });
      } else {
        const errorMessage = (response?.err?.msg 
          ? response.err.msg 
          : "Canister returned no ICRC1 canister metadata."
        );
        self.postMessage({ 
          type: "ERROR", 
          payload: errorMessage, 
          key: 'canisterMetadata' 
        });
      }
    }
  } catch (e) {
    const msg = e?.msg ? e.msg : JSON.stringify(e);
    self.postMessage({ 
      type: "ERROR", 
      payload: `Failed canister call due to ${msg}`, 
      key: 'canisterMetadata' 
    });
  } finally {
    self.postMessage({ 
      type: "LOADING", 
      key: "canisterMetadata", 
      payload: false 
    })
  }

}

function onMessage ({ data }) {
  console.info(`WebWorker::self.onmessage() data ${JSON.stringify(data)}`)
  const { type  } = data;
  switch (type) {
    case "QUERY_BALANCE":

      return;

    case "QUERY_PAYMENTS":

      return;
    case "QUERY_CANISTER_METADATA":
      callCanister({ 
        key: "canisterMetadata",
        method: 'get_icrc1_token_canister_metadata',
        resultTransform: handleMetadataResponse
      })
      return;
    
    default:
      console.info('WebWorker::self.onmessage() with no data action type.')
  };
}

async function callCanister({ 
  key, 
  method, 
  resultTransform = (r) => r,
  payload 
}) {
  try {
    self.postMessage({ type: "LOADING", key, payload: true });
    const backend = await getActor();
    let response = payload ? await backend[method](payload) : await backend[method]();
    response = resultTransform(response);
    if (response?.ok) {
      const payload = { ...response.ok };
      console.log(JSON.stringify(payload))

      self.postMessage({ type: "VALUE", key, payload: { ...response.ok }});
    } else {
      self.postMessage({ 
        type: "ERROR",  
        key, 
        payload: (response?.err?.msg ? response.err.msg : `Canister call ${method} returned err without a given msg.`) 
      });
    }
  } catch (e) {
    console.error(`wworker.self::callCanister ${method || 'method undefined'} caught error ${e?.msg ? e.msg : e}`)
  } finally {
    self.postMessage({ type: "LOADING", key, payload: false });
  }
}

self.addEventListener("message", onMessage);





public shared ({ caller }) func send_payment2({
  clientPaymentId : Text;
  amount : Nat;
  description : ?Text;
  recipientAddress : Text;
}) : async Types.SendPaymentResult {
  // Reject if anonymous:
  assert (not Principal.isAnonymous(caller));
  // Reject if the icrc1 token canister id has not been set valid.
  //assert (not (icrc1TokenCanisterId_ == Types.INVALID_CANISTER_ID));
  // Attempt to create sender's subaccount so initial payment can be created:
  let account = Utils.getAccountUserSubaccount({
    canisterId = getCanisterId_();
    user = caller;
  });
  // Resolve the account creation attempt:
  switch (addressConverter_.fromText(recipientAddress)) {
    // Recipient address wasn't valid  icrc1 account encoded text:
    case (#err _) {
      // Payment attempt still saved and result returned to caller:
      let payment = createPutPayment_({
        clientPaymentId;
        caller;
        account;
        amount;
        description;
        recipientAddress;
        status = #Failed({
          timestampNs = Time.now();
          kind = #InvalidRecipientAddress({});
        });
      });
      return #err({
        payment;
        msg = "The intended recipient address text was not valid ICRC1 account encoding.";
      });
    };
    // Valid recipient address, continue to process payment:
    case (#ok(to)) {
      let p = createPutPayment_({
        clientPaymentId;
        caller;
        account;
        amount;
        description;
        recipientAddress;
        status = #Pending({});
      });
      // Make the icrc1 intercanister transfer call, catching if error'd:
      let response : Result.Result<Types.TransferResult, Types.PaymentError> = try {
        #ok(await icrc1Actor_.icrc1_transfer({ from_subaccount = account.subaccount; amount; fee = null; memo = null; created_at_time = null; to }));
      } catch (e) {
        #err(#InterCanisterCallCaughtError(Error.message(e)));
      };
      // Parse the results of the icrc1 intercansiter transfer call:
      let result : Result.Result<(Text, Types.PaymentStatus), (Text, Types.PaymentStatus)> = switch (response) {
        case (#ok(transferResult)) {
          switch (transferResult) {
            case (#Ok _) #ok("", #Completed({ timestampNs = Time.now() }));
            case (#Err transferErr) #err(
              "The icrc1 transfer call could not be completed as requested.",
              #Failed({
                timestampNs = Time.now();
                kind = #ICRC1TokenCanisterTransferErr(transferErr);
              }),
            );
          };
        };
        case (#err(kind)) #err(
          "The intercanister icrc1 transfer call caught an error and did not finish processing.",
          #Failed({ timestampNs = Time.now(); kind }),
        );
      };
      // Resolve the status to update the payment and return msg if err'd:
      let (msg, status) = switch (result) {
        case (#ok(t, s))(t, s);
        case (#err(t, s))(t, s);
      };
      let payment : Types.Payment = {
        id = p.id;
        number = p.number;
        clientPaymentId = p.clientPaymentId;
        createdAtNs = p.createdAtNs;
        amount = p.amount;
        description = p.description;
        sourceAddress = p.sourceAddress;
        recipientAddress = p.recipientAddress;
        status;
      };
      // Update the user's stored payments.
      let payments = Array.map<Types.Payment, Types.Payment>(
        getUsersPayments_(caller),
        func(p : Types.Payment) : Types.Payment {
          if (p.id == payment.id) { return payment } else {
            return p;
          };
        },
      );
      ignore Map.put(usersPaymentsMap_, phash, caller, payments);
      // Finally return the result:
      switch (result) {
        case (#ok _) {
          return #ok({ payment });
        };
        case (#err _) {
          return #ok({ payment; msg });
        };
      };
    };
  };
};

























