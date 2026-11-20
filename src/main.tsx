import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || 'Unbekannter Darstellungsfehler' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('HBS Elternassistent Laufzeitfehler:', error, info);
  }

  handleResetAndReload = async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch {
      // ignore cleanup errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFBF5] text-slate-800 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-[#F1E9DA] rounded-3xl p-6 shadow-float text-center space-y-4">
            <h1 className="text-lg font-extrabold text-slate-900">
              Heimbürgeschule Kahla • Elternassistent
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Beim Laden der Ansicht ist ein technischer Fehler aufgetreten. Bitte laden Sie die Seite neu, um den aktuellen Stand abzurufen.
            </p>
            {this.state.message && (
              <p className="text-xs text-slate-400 font-mono break-words bg-slate-50 p-2 rounded-xl border border-slate-100">
                {this.state.message}
              </p>
            )}
            <button
              onClick={this.handleResetAndReload}
              className="w-full py-3 px-4 bg-[#0B7BA7] hover:bg-[#085a7a] text-white text-sm font-bold rounded-xl transition-colors"
            >
              Cache leeren &amp; neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Vite-Chunk-Fehler nach einem neuen Deployment automatisch einmalig abfangen
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  try {
    const key = 'hbs_asset_recovery_reload';
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      window.location.reload();
    }
  } catch {
    window.location.reload();
  }
});

// Progressive Web App (PWA) Service Worker Registrierung
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const hadController = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('HBS PWA Service Worker erfolgreich aktiv:', registration.scope);
        registration.update().catch(() => {});
      })
      .catch((error) => {
        console.warn('PWA Service Worker Registrierung nicht möglich:', error);
      });

    if (hadController) {
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloading) return;
        try {
          const key = 'hbs_sw_upgrade_reload';
          if (sessionStorage.getItem(key)) return;
          sessionStorage.setItem(key, '1');
        } catch {
          // ignore
        }
        reloading = true;
        window.location.reload();
      });
    }
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
