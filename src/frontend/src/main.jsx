import React from 'react';
import ReactDOM from 'react-dom/client';
import CanisterProvider from './components/CanisterProvider.jsx';
import App from './App.jsx';
import './index.css';

// Check web workers are supported.
const supported = !!typeof(Worker);
const getNotSupported = () => (
  <div className="w-full mt-1/3 text-center italic text-3xl">This dapp requires a browser that supports web workers.</div>
)

const dapp = <CanisterProvider><App /></CanisterProvider>;
ReactDOM.createRoot(document.getElementById('root')).render(supported ? dapp : getNotSupported());
