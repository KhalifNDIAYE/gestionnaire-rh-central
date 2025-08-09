interface LogContext {
  [key: string]: any;
}

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  module?: string;
  timestamp: string;
  sessionId?: string;
  userId?: string;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  private sessionId: string;
  private buffer: LogEntry[] = [];
  private bufferSize = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    // Send logs to Sentry in production
    if (import.meta.env.PROD) {
      this.setupSentryLogging();
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupSentryLogging() {
    // Sentry is already initialized in main.tsx
    // We'll send error and fatal logs to Sentry
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    module?: string
  ): LogEntry {
    return {
      level,
      message,
      context,
      module,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.getCurrentUserId(),
    };
  }

  private getCurrentUserId(): string | undefined {
    // Try to get user ID from current session
    try {
      if (typeof window !== 'undefined') {
        const authState = sessionStorage.getItem('supabase.auth.token');
        if (authState) {
          const parsed = JSON.parse(authState);
          return parsed?.user?.id;
        }
      }
    } catch {
      // Ignore errors when getting user ID
    }
    return undefined;
  }

  private addToBuffer(entry: LogEntry) {
    this.buffer.push(entry);
    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
    }
  }

  private async sendToRemote(entry: LogEntry) {
    // Only send ERROR and FATAL logs to remote in production
    if (import.meta.env.PROD && entry.level >= LogLevel.ERROR) {
      try {
        // Send to Sentry
        if ((window as any).Sentry) {
          (window as any).Sentry.addBreadcrumb({
            message: entry.message,
            level: entry.level === LogLevel.ERROR ? 'error' : 'fatal',
            data: entry.context,
          });

          if (entry.level === LogLevel.FATAL) {
            (window as any).Sentry.captureException(new Error(entry.message), {
              contexts: {
                custom: entry.context,
              },
              tags: {
                module: entry.module,
                sessionId: entry.sessionId,
              },
            });
          }
        }

        // Could also send to custom logging endpoint
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry)
        // });
      } catch (error) {
        // Don't let logging errors break the app
        console.error('Failed to send log to remote:', error);
      }
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext, module?: string) {
    if (level < this.logLevel) return;

    const entry = this.createLogEntry(level, message, context, module);
    
    // Add to buffer
    this.addToBuffer(entry);
    
    // Console output for development
    if (import.meta.env.DEV) {
      const consoleMessage = `[${entry.timestamp}] ${module ? `[${module}] ` : ''}${message}`;
      const logMethods = {
        [LogLevel.DEBUG]: console.debug,
        [LogLevel.INFO]: console.info,
        [LogLevel.WARN]: console.warn,
        [LogLevel.ERROR]: console.error,
        [LogLevel.FATAL]: console.error,
      };
      
      if (context) {
        logMethods[level](consoleMessage, context);
      } else {
        logMethods[level](consoleMessage);
      }
    }

    // Send to remote services
    this.sendToRemote(entry);
  }

  debug(message: string, context?: LogContext, module?: string) {
    this.log(LogLevel.DEBUG, message, context, module);
  }

  info(message: string, context?: LogContext, module?: string) {
    this.log(LogLevel.INFO, message, context, module);
  }

  warn(message: string, context?: LogContext, module?: string) {
    this.log(LogLevel.WARN, message, context, module);
  }

  error(message: string, context?: LogContext, module?: string) {
    this.log(LogLevel.ERROR, message, context, module);
  }

  fatal(message: string, context?: LogContext, module?: string) {
    this.log(LogLevel.FATAL, message, context, module);
  }

  // Get recent logs for debugging
  getRecentLogs(count = 50): LogEntry[] {
    return this.buffer.slice(-count);
  }

  // Performance logging
  time(label: string, module?: string) {
    const startTime = performance.now();
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.info(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` }, module);
      }
    };
  }

  // Set log level (useful for debugging)
  setLogLevel(level: 'debug' | 'info' | 'warn' | 'error' | 'fatal') {
    const levelMap = {
      debug: LogLevel.DEBUG,
      info: LogLevel.INFO,
      warn: LogLevel.WARN,
      error: LogLevel.ERROR,
      fatal: LogLevel.FATAL,
    };
    this.logLevel = levelMap[level];
  }
}

export const logger = new Logger();

// Export for legacy compatibility
export { logger as default };