import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import CanisterProvider from './feature/canister-provider/CanisterProvider.jsx';
import App from './App.jsx';
import './index.css';

global.BigInt.prototype.toJSON = function () { return this.toString() };

const dapp = (
  <Router>
    <CanisterProvider>
      <App />
    </CanisterProvider>
  </Router>
);

const notSupported = (
  <div className="mt-[34%] w-full text-center text-3xl">
    This dapp requires a browser that supports web workers.
  </div>
);

// Check web workers supported; Firefox doesn't yet by default allow module type workers.
const supported = !!typeof(Worker) || !(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)

ReactDOM.createRoot(document.getElementById('root')).render(
  supported ? dapp : notSupported 
);

