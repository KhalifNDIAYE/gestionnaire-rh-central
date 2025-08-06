import * as Sentry from "@sentry/react";
import { supabase } from "@/integrations/supabase/client";

// Configuration Sentry
export const initSentry = async () => {
  try {
    // Récupérer la configuration depuis Supabase
    const { data, error } = await supabase.functions.invoke('get-monitoring-config');
    
    if (error || !data?.success) {
      console.warn('Sentry configuration not available:', error?.message || data?.error);
      return;
    }

    const { sentryDsn, environment } = data.config;

    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      environment,
      // Performance monitoring
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
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
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
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