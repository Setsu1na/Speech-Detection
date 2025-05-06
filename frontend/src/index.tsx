import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PhoneFrame from './components/PhoneFrame';
import './components/PhoneFrame.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <PhoneFrame>
      <App />
    </PhoneFrame>
  </React.StrictMode>
); 