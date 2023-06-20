### see [here](../../README.md)

## other points of note

This project uses a web worker to handle all canister calls (because why not?).

As a result instead of simply importing the backend as an actor instance of its generated declarations, when a backend actor instance is needed, it is created by the web worker. 

This is why there's a `useInternetIdentity` in contrast to the original AuthClient demo's `use-Auth-Client` hook which provides more functionality than just the `isAuthenticated` variable used here. 

## important!!! 

Vite doesn't inject the spread of enviromental variables on `process.env` into the build output, instead it uses `import.meta.env`. 

While it is possible to configure Vite's config to do this (see the example in the `define: {...}` comments), this project instead just uses `import.meta.env` along with the plugin `vite-plugin-environment` to automatically spread all the environmental vars from `.env` onto `import.meta.env`. 

As a result, if the default generated type declarations are imported and used in the client code in your own project, as shown in the developer doc's standard example, the references to `process.env` either needs to be substituted for `import.meta.env` or the vite config needs to be updated to define `process.env...canisterIds | dfxNetwork | etc`. 

Remember that the dev server hosting the frontend may behave differently than the asset canister hosting the frontend. 

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

### todo

 - figure out best way to group/name canister related stuff (an integrated set of hooks/provider/components/scripts/utils in same subdirectory?)
 - add vitetest 
 - add identity loaded from file to skip having to log in
 - "progress bar" loader + worker progress % emitter

 Links 

- https://kentcdodds.com/blog/stop-using-isloading-booleans
- https://kentcdodds.com/blog/how-to-test-custom-react-hooks
  