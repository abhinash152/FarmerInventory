import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Automatically route API requests to Render backend in production
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://farmerinventory.onrender.com' : '');

if (API_BASE) {
  const originalFetch = window.fetch;
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string' && input.startsWith('/api')) {
      input = `${API_BASE}${input}`;
    } else if (input instanceof URL && input.pathname.startsWith('/api')) {
      input = new URL(`${API_BASE}${input.pathname}${input.search}`);
    }
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
