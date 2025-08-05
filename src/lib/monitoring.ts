import * as Sentry from "@sentry/react";

// Configuration Sentry
export const initSentry = () => {
  // Récupérer la clé DSN depuis les variables d'environnement Supabase
  const sentryDsn = process.env.SENTRY_DSN;
  
  if (!sentryDsn) {
    console.warn('Sentry DSN not configured');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
    ],
    environment: process.env.NODE_ENV || 'development',
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Session replay (optionnel)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Filtrage des erreurs
    beforeSend(event) {
      // Filtrer les erreurs non critiques
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value?.includes('ResizeObserver loop')) {
          return null; // Ignorer cette erreur commune
        }
      }
      return event;
    },
    // Tags personnalisés
    initialScope: {
      tags: {
        component: "react-app"
      }
    }
  });
};

// Wrapper pour capturer les erreurs React
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Fonctions utilitaires
export const captureUserFeedback = (user: any, message: string) => {
  Sentry.captureFeedback({
    name: user?.name || 'Utilisateur anonyme',
    email: user?.email || 'anonymous@example.com',
    message: message,
  });
};

export const setUserContext = (user: any) => {
  Sentry.setUser({
    id: user?.id,
    email: user?.email,
    username: user?.name,
  });
};

export const addBreadcrumb = (message: string, category: string = 'navigation') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level: 'info',
  });
};

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;