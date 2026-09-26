import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import '@/i18n';
import '@/styles/index.css';
import App from './App';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  );
}
