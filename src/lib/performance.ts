interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initPerformanceObserver();
    this.trackCoreWebVitals();
  }

  private initPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observer différents types de métriques
      try {
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift'] });
      } catch (e) {
        console.warn('Performance observer not fully supported:', e);
      }
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'navigation':
        this.trackNavigationMetrics(entry as PerformanceNavigationTiming);
        break;
      case 'paint':
        this.trackPaintMetrics(entry as PerformancePaintTiming);
        break;
      case 'largest-contentful-paint':
        this.addMetric('LCP', entry.startTime, 'ms');
        break;
      case 'layout-shift':
        const layoutShift = entry as any;
        if (!layoutShift.hadRecentInput) {
          this.addMetric('CLS', layoutShift.value, 'score');
        }
        break;
    }
  }

  private trackNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics = {
      'DNS_Lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'TCP_Connection': entry.connectEnd - entry.connectStart,
      'Server_Response': entry.responseStart - entry.requestStart,
      'DOM_Loading': entry.domContentLoadedEventStart - entry.domContentLoadedEventEnd,
      'Page_Load': entry.loadEventEnd - entry.loadEventStart,
      'Total_Load_Time': entry.loadEventEnd - entry.fetchStart
    };

    for (const [name, value] of Object.entries(metrics)) {
      if (value > 0) {
        this.addMetric(name, value, 'ms');
      }
    }
  }

  private trackPaintMetrics(entry: PerformancePaintTiming) {
    this.addMetric(entry.name.replace('-', '_').toUpperCase(), entry.startTime, 'ms');
  }

  private trackCoreWebVitals() {
    // First Input Delay (FID)
    if ('PerformanceEventTiming' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventEntry = entry as any;
          if (eventEntry.processingStart && eventEntry.startTime) {
            const fid = eventEntry.processingStart - eventEntry.startTime;
            this.addMetric('FID', fid, 'ms');
          }
        }
      });

      try {
        observer.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.warn('FID measurement not supported:', e);
      }
    }
  }

  addMetric(name: string, value: number, unit: string, context?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context
    };

    this.metrics.push(metric);

    // Envoyer vers analytics si la valeur est importante
    if (this.isImportantMetric(name)) {
      import('./analytics').then(({ analytics }) => {
        analytics.trackPerformance(name, value, unit);
      });
    }

    // Log en development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} = ${value}${unit}`, context);
    }
  }

  private isImportantMetric(name: string): boolean {
    const importantMetrics = ['LCP', 'FID', 'CLS', 'Total_Load_Time', 'API_Response'];
    return importantMetrics.includes(name);
  }

  // Mesurer le temps d'exécution d'une fonction
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.addMetric(`Function_${name}`, duration, 'ms');
    return result;
  }

  // Mesurer le temps d'exécution d'une promesse
  async measureAsync<T>(name: string, promise: Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await promise;
      const duration = performance.now() - start;
      this.addMetric(`Async_${name}`, duration, 'ms');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.addMetric(`Async_${name}_Error`, duration, 'ms');
      throw error;
    }
  }

  // Mesurer les métriques de bundle
  measureBundleSize() {
    if ('navigator' in window && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.addMetric('Network_Type', 0, 'string', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      }
    }

    // Mesurer la taille des ressources
    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    const resourceTypes: Record<string, number> = {};

    resources.forEach((resource: any) => {
      if (resource.transferSize) {
        totalSize += resource.transferSize;
        const type = this.getResourceType(resource.name);
        resourceTypes[type] = (resourceTypes[type] || 0) + resource.transferSize;
      }
    });

    this.addMetric('Total_Resources_Size', totalSize, 'bytes');
    
    for (const [type, size] of Object.entries(resourceTypes)) {
      this.addMetric(`${type}_Size`, size, 'bytes');
    }
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'JavaScript';
    if (url.includes('.css')) return 'CSS';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) return 'Images';
    if (url.includes('/api/')) return 'API';
    return 'Other';
  }

  // Obtenir un rapport de performance
  getPerformanceReport(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Nettoyer les anciennes métriques
  cleanup() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.metrics = this.metrics.filter(metric => metric.timestamp > oneHourAgo);
  }
}

// Hook React pour la mesure de performance
export const usePerformanceMonitor = () => {
  const monitor = new PerformanceMonitor();

  return {
    measureFunction: monitor.measureFunction.bind(monitor),
    measureAsync: monitor.measureAsync.bind(monitor),
    addMetric: monitor.addMetric.bind(monitor),
    getReport: monitor.getPerformanceReport.bind(monitor)
  };
};

// Instance globale
export const performanceMonitor = new PerformanceMonitor();