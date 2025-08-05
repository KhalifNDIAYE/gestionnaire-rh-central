enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface BusinessMetric {
  name: string;
  value: number;
  unit?: string;
  category: string;
  timestamp: string;
  context?: Record<string, any>;
}

class StructuredLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private sessionId: string;
  private userId?: string;
  private context: Record<string, any> = {};

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUser(userId: string) {
    this.userId = userId;
  }

  setContext(context: Record<string, any>) {
    this.context = { ...this.context, ...context };
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    component?: string,
    action?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.context, ...context },
      userId: this.userId,
      sessionId: this.sessionId,
      component,
      action,
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      }
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Maintenir la limite de logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Envoyer les logs critiques immédiatement
    if (entry.level >= LogLevel.ERROR) {
      this.sendLogToServer(entry);
    }

    // Log dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(entry);
    }
  }

  private logToConsole(entry: LogEntry) {
    const logMethods = {
      [LogLevel.DEBUG]: console.debug,
      [LogLevel.INFO]: console.info,
      [LogLevel.WARN]: console.warn,
      [LogLevel.ERROR]: console.error,
      [LogLevel.FATAL]: console.error
    };

    const method = logMethods[entry.level];
    method(
      `[${entry.timestamp}] ${LogLevel[entry.level]} ${entry.component || 'APP'}: ${entry.message}`,
      entry.context
    );
  }

  private async sendLogToServer(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  // Méthodes de logging
  debug(message: string, context?: Record<string, any>, component?: string, action?: string) {
    this.addLog(this.createLogEntry(LogLevel.DEBUG, message, context, component, action));
  }

  info(message: string, context?: Record<string, any>, component?: string, action?: string) {
    this.addLog(this.createLogEntry(LogLevel.INFO, message, context, component, action));
  }

  warn(message: string, context?: Record<string, any>, component?: string, action?: string) {
    this.addLog(this.createLogEntry(LogLevel.WARN, message, context, component, action));
  }

  error(message: string, context?: Record<string, any>, component?: string, action?: string) {
    this.addLog(this.createLogEntry(LogLevel.ERROR, message, context, component, action));
  }

  fatal(message: string, context?: Record<string, any>, component?: string, action?: string) {
    this.addLog(this.createLogEntry(LogLevel.FATAL, message, context, component, action));
  }

  // Logging d'événements spécifiques
  logUserAction(action: string, component: string, context?: Record<string, any>) {
    this.info(`User action: ${action}`, context, component, action);
  }

  logAPICall(method: string, url: string, duration: number, status: number, context?: Record<string, any>) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.addLog(this.createLogEntry(
      level,
      `API call: ${method} ${url} - ${status} (${duration}ms)`,
      { method, url, duration, status, ...context },
      'API',
      'request'
    ));
  }

  logPerformance(metric: string, value: number, unit: string, context?: Record<string, any>) {
    this.info(`Performance: ${metric} = ${value}${unit}`, { metric, value, unit, ...context }, 'Performance');
  }

  logError(error: Error, component?: string, context?: Record<string, any>) {
    this.error(
      `Error: ${error.message}`,
      {
        name: error.name,
        stack: error.stack,
        ...context
      },
      component,
      'error'
    );
  }

  // Obtenir les logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Exporter les logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Vider les logs
  clearLogs() {
    this.logs = [];
  }
}

// Gestionnaire de métriques métier
class BusinessMetricsCollector {
  private metrics: BusinessMetric[] = [];

  recordMetric(
    name: string,
    value: number,
    category: string,
    unit?: string,
    context?: Record<string, any>
  ) {
    const metric: BusinessMetric = {
      name,
      value,
      unit,
      category,
      timestamp: new Date().toISOString(),
      context
    };

    this.metrics.push(metric);

    // Envoyer vers analytics
    import('./analytics').then(({ analytics }) => {
      analytics.trackBusinessMetric(name, value, context);
    });

    // Log de la métrique
    logger.info(`Business metric: ${name} = ${value}${unit || ''}`, { category, ...context }, 'BusinessMetrics');
  }

  // Métriques RH spécifiques
  recordUserLogin(userId: string, method: string) {
    this.recordMetric('user_login', 1, 'authentication', 'count', { userId, method });
  }

  recordEmployeeCreated(department: string) {
    this.recordMetric('employee_created', 1, 'hr', 'count', { department });
  }

  recordProjectCompleted(projectId: string, duration: number) {
    this.recordMetric('project_completed', duration, 'projects', 'days', { projectId });
  }

  recordLeaveRequestSubmitted(type: string, duration: number) {
    this.recordMetric('leave_request_submitted', duration, 'leave', 'days', { type });
  }

  recordPayrollProcessed(employeeCount: number, processingTime: number) {
    this.recordMetric('payroll_processed', employeeCount, 'payroll', 'employees', { processingTime });
  }

  recordDocumentGenerated(type: string, size: number) {
    this.recordMetric('document_generated', size, 'documents', 'bytes', { type });
  }

  getMetrics(category?: string): BusinessMetric[] {
    if (category) {
      return this.metrics.filter(metric => metric.category === category);
    }
    return [...this.metrics];
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Instances globales
export const logger = new StructuredLogger();
export const businessMetrics = new BusinessMetricsCollector();

// Hook React pour le logging
export const useLogger = (component: string) => {
  return {
    debug: (message: string, context?: Record<string, any>, action?: string) =>
      logger.debug(message, context, component, action),
    info: (message: string, context?: Record<string, any>, action?: string) =>
      logger.info(message, context, component, action),
    warn: (message: string, context?: Record<string, any>, action?: string) =>
      logger.warn(message, context, component, action),
    error: (message: string, context?: Record<string, any>, action?: string) =>
      logger.error(message, context, component, action),
    logUserAction: (action: string, context?: Record<string, any>) =>
      logger.logUserAction(action, component, context),
    logError: (error: Error, context?: Record<string, any>) =>
      logger.logError(error, component, context)
  };
};