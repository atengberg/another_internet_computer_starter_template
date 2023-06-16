### see [here](../../README.md)

## other points of note

This project uses a web worker to handle all canister calls (because why not?).

As a result instead of simply importing the backend as an actor instance of its generated declarations, when a backend actor instance is needed, it is created by the web worker. 

This is why there's a `useInternetIdentity` in contrast to the original AuthClient demo's `use-Auth-Client` hook which provides more functionality than just the `isAuthenticated` variable used here. 

!todo figure out best way to group canister related stuff

## frontend "architecture"

`CanisterProvider` creates `CanisterContext` made available by the `useCanister` hook.

The `CanisterProvider` uses the `useInternetIdentity` and `useWorker` hooks providing the related memeoized values (such `isAuthenticated`, `login`, `logout`, canister state defined in the reducer, etc). 

In particular, the canister provider makes `taskUi` and `taskWorker` available which both take the same argument type: an action event of ~ `{ type, payload, key }`.

The `taskUi` dispatches to the reducer the `CanisterProvider` uses. 

The `taskWorker` "dispatches" (`postMessage`) to the web worker. 

The `useWorker` pipes the messages the worker sends back to itself on the UI to the reducer's dispatch (which would be the same as `taskUi` except its in the scope the provider so does so directly).

In particular, the reducer uses a generic setter such that `{ type: "SET_VALUE", payload: <updated data>, key: <data's state name/property> }`.

So the flow goes something like:

UI: `taskUi({ type: "PING" })` -> WebWorker: `backend.ping()` -> WebWorker (back to UI) `postMessage({ type: "SET_VALUE", payload: pingCount, key: "pingCount" })` which is then received by the canister provider's reducer and updates the state. 

That's probably not very clear, but if you look at the default example should be direct enough. 