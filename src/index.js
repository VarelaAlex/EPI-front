import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as swr from './serviceWorkerRegistration';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));

swr.register({
  onUpdate: async (registration) => {
    if (registration && registration.waiting) {
      await registration.unregister();
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);