### see [here](../../README.md)

## other points of note

This project uses a web worker to handle all canister calls (because why not?).

As a result instead of simply importing the backend as an actor instance of its generated declarations, when a backend actor instance is needed, it is created by the web worker. 

This is why there's a `useInternetIdentity` as opposed to the original AuthClient demo's `use-Auth-Client` hook which provides more functionality than just the `isAuthenticated` variable used here. 