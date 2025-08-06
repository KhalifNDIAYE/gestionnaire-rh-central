import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialiser Sentry de manière asynchrone
import { initSentry } from "./lib/monitoring";
initSentry().then(() => {
  console.log('Sentry initialized successfully');
}).catch((error) => {
  console.error('Failed to initialize Sentry:', error);
});

// Initialiser les analytics privacy-friendly
import { analytics } from "./lib/analytics";
analytics.requestConsent().then(() => {
  console.log('Analytics initialized');
});

// Initialiser le monitoring de performance
import { performanceMonitor } from "./lib/performance";
performanceMonitor.measureBundleSize();

// Initialiser les logs structurés
import { logger } from "./lib/logging";
logger.info('Application starting', { version: '1.0.0' }, 'Main');

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
