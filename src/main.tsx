import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Progressive Web App (PWA) Service Worker Registrierung
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('HBS PWA Service Worker erfolgreich aktiv:', registration.scope);
      })
      .catch((error) => {
        console.warn('PWA Service Worker Registrierung nicht möglich:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
