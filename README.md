# another starter template for developing on the internet computer  

This project is based off the work of others, most directly: 

 - [vite react motoko template](https://github.com/rvanasa/vite-react-motoko/tree/main)  
  
  with additions from 

 - [authclient demo](https://github.com/krpeacock/auth-client-demo/tree/main)  
  
  and 

 - [icwebworker](https://github.com/peterpeterparker/icwebworker/tree/main)  

Note `vite react motoko template` originally uses Typescript, while this project just uses Javascript (for now).  

## at a glance

This is a starter template that comes preconfigured to work out of the box with:

 - Vite
 - React
 - React Router
 - Tailwind
 - Internet Identity
 - AuthClient 
 - Motoko
 - mo-dev
 - Web Workers
 - Eslint for the frontend with the react and react-hooks plugins
 - more to come...

The Internet Computer is a reverse-gas blockchain platform whose smart contracts are mutable and can directly interact with the rest of the web and even other "immutable" blockchains. 

Its smart contracts, called canisters, can run dapps ("decentralized apps") that are capable of hosting the full web stack and even more ('bridgeless' interoperability for instance). 

This project comes with a [frontend](./src/frontend/) and [backend](./src/backend/) to quickly get started developing. 
## important notice

This project requires the Internet Computer's `dfx` sdk to run.  

## running the project locally

_todo_ (use make or another to initialize easily)

If `dfx` is installed on your system, you can run this project locally using the following commands:

```bash
# Starts the replica ("local testnet") clean ("free of preexisting side effects")
# Open a new terminal instance, or add --background to run dfx in the background
dfx start --clean 

# Initialize and deploy the canister
npm run setup
```

This will create and deploy the frontend, backend and internet identity canisters.

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.
## iterating development and making changes

When you're ready to make frontend and/or backend changes, you can start the development server process by running:

```bash
npm start
```

Which will: 

 - Start vite running a frontend server at `http://127.0.0.1:3000ish`, proxying API requests to the frontend's canister on the replica at port 4943. 
  
 - Start the very helpful library `mo-dev` which will monitor changes made to the `backend` Motoko canister, updating its deployment and generated type declarations used by the frontend. 

## note on project's directory structure

While this is in the root of the project, because of how Vite and Tailwind prefer their project layout, the frontend is an inner npm project in the `src/frontend` subdirectory. 

As a result, the scripts of this project directly run the scripts of that project. 
 
## note on frontend environment variables 

`dfx` generates a `.env` containing all the environmental variables it creates, which is specified to be created in `src/frontend/`. 

`vite-plugin-environment` will make these available through the `vite.config.js` configuration on `process.env` and `import.meta.env`

Just a reminder--don't push your private keys!

## note about eslint

Linting is not hooked into other scripts, if you want to use it run it manually with:

```bash
npm run lint
```

in either the root or frontend directory. It will only lint the frontend files (currently).

# there's more in the frontend readme!