interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, any>;
}

interface UserProperties {
  role?: string;
  department?: string;
  signupDate?: string;
  plan?: string;
}

class PrivacyFriendlyAnalytics {
  private isEnabled: boolean = false;
  private userId: string | null = null;
  private sessionId: string;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = this.checkUserConsent();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private checkUserConsent(): boolean {
    // Vérifier le consentement utilisateur (RGPD)
    const consent = localStorage.getItem('analytics_consent');
    return consent === 'accepted';
  }

  // Demander le consentement utilisateur
  requestConsent(): Promise<boolean> {
    return new Promise((resolve) => {
      const hasConsent = localStorage.getItem('analytics_consent');
      if (hasConsent) {
        this.isEnabled = hasConsent === 'accepted';
        resolve(this.isEnabled);
        return;
      }

      // Afficher une modal de consentement (à implémenter dans l'UI)
      const consent = confirm(
        'Acceptez-vous l\'utilisation d\'analytics respectueux de la vie privée pour améliorer l\'application ?'
      );
      
      localStorage.setItem('analytics_consent', consent ? 'accepted' : 'refused');
      this.isEnabled = consent;
      resolve(consent);
    });
  }

  // Définir l'utilisateur actuel
  setUser(userId: string, properties?: UserProperties) {
    if (!this.isEnabled) return;
    
    this.userId = userId;
    
    // Hasher l'ID utilisateur pour la confidentialité
    const hashedUserId = this.hashUserId(userId);
    
    this.track('user_identified', 'user', undefined, undefined, {
      hashedUserId,
      ...properties
    });
  }

  private hashUserId(userId: string): string {
    // Simple hash pour anonymiser l'ID utilisateur
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Tracker un événement
  track(
    action: string,
    category: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ) {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      action,
      category,
      label,
      value,
      userId: this.userId,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.pathname,
        referrer: document.referrer || 'direct'
      }
    };

    this.events.push(event);
    
    // Envoyer l'événement (batch ou immédiat selon la criticité)
    if (this.isCriticalEvent(action)) {
      this.sendEvent(event);
    } else {
      this.batchEvents();
    }
  }

  private isCriticalEvent(action: string): boolean {
    const criticalEvents = ['error', 'purchase', 'signup', 'login'];
    return criticalEvents.includes(action);
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Envoyer vers notre API d'analytics ou service tiers respectueux
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  private batchEvents() {
    // Envoyer les événements par batch toutes les 30 secondes
    if (this.events.length >= 10) {
      this.flushEvents();
    }
  }

  private async flushEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend })
      });
    } catch (error) {
      console.error('Failed to send analytics batch:', error);
      // Remettre les événements en cas d'échec
      this.events.unshift(...eventsToSend);
    }
  }

  // Métriques de performance
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track('performance_metric', 'performance', metric, value, { unit });
  }

  // Métriques métier
  trackBusinessMetric(metric: string, value: number, context?: Record<string, any>) {
    this.track('business_metric', 'business', metric, value, context);
  }

  // Tracker les erreurs
  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', 'error', error.message, undefined, {
      stack: error.stack,
      name: error.name,
      ...context
    });
  }

  // Navigation tracking
  trackPageView(page: string) {
    this.track('page_view', 'navigation', page, undefined, {
      title: document.title
    });
  }

  // Feature usage
  trackFeatureUsage(feature: string, action: string = 'used') {
    this.track(action, 'feature', feature);
  }

  // Conversion tracking
  trackConversion(goal: string, value?: number) {
    this.track('conversion', 'goal', goal, value);
  }
}

// Instance globale
export const analytics = new PrivacyFriendlyAnalytics();

// Hook React pour l'analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackBusinessMetric: analytics.trackBusinessMetric.bind(analytics),
    setUser: analytics.setUser.bind(analytics)
  };
};