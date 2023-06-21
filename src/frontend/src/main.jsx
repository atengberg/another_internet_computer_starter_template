import React from 'react';
import ReactDOM from 'react-dom/client';
import CanisterProvider from './components/CanisterProvider.jsx';
import App from './App.jsx';
import './index.css';

const dapp = (
  <CanisterProvider>
    <App />
  </CanisterProvider>
);

const notSupported = (
  <div className="w-full mt-1/3 text-center italic text-3xl">
    This dapp requires a browser that supports web workers.
  </div>
);

// Check web workers supported; Firefox doesn't yet by default allow module type workers.
const supported = !!typeof(Worker) || !(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    { supported ? dapp : notSupported }
  </React.StrictMode>
);
