/**
 * Authentication Logger
 * Logs all auth-related events to help debug session issues
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

class AuthLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 500; // Keep last 500 logs
  private enabled = process.env.NODE_ENV === 'development';

  log(level: LogLevel, category: string, message: string, data?: any) {
    if (!this.enabled) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : undefined,
    };

    this.logs.push(entry);

    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with colors
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔍',
    };

    const color = {
      info: 'color: #3b82f6',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444',
      debug: 'color: #8b5cf6',
    };

    console.log(
      `%c${emoji[level]} [${category}] ${message}`,
      color[level],
      data || ''
    );

    // Save to localStorage for persistence
    this.saveToStorage();
  }

  info(category: string, message: string, data?: any) {
    this.log('info', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    this.log('warn', category, message, data);
  }

  error(category: string, message: string, data?: any) {
    this.log('error', category, message, data);
  }

  debug(category: string, message: string, data?: any) {
    this.log('debug', category, message, data);
  }

  private saveToStorage() {
    try {
      localStorage.setItem('auth_logs', JSON.stringify(this.logs));
    } catch (e) {
      // Ignore storage errors
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('auth_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  getLogs(filter?: { level?: LogLevel; category?: string; since?: Date }) {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter((log) => log.level === filter.level);
    }

    if (filter?.category) {
      filtered = filtered.filter((log) => log.category === filter.category);
    }

    if (filter?.since) {
      filtered = filtered.filter(
        (log) => new Date(log.timestamp) >= filter.since!
      );
    }

    return filtered;
  }

  exportLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('auth_logs');
    console.log('🗑️ Auth logs cleared');
  }

  printSummary() {
    const summary = {
      total: this.logs.length,
      errors: this.logs.filter((l) => l.level === 'error').length,
      warnings: this.logs.filter((l) => l.level === 'warn').length,
      byCategory: {} as Record<string, number>,
    };

    this.logs.forEach((log) => {
      summary.byCategory[log.category] =
        (summary.byCategory[log.category] || 0) + 1;
    });

    console.table(summary);
    return summary;
  }
}

// Singleton instance
export const authLogger = new AuthLogger();

// Load existing logs on init
if (typeof window !== 'undefined') {
  authLogger.loadFromStorage();
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).authLogger = authLogger;
  console.log('💡 Auth Logger available: window.authLogger');
  console.log('   - authLogger.getLogs() - View all logs');
  console.log('   - authLogger.printSummary() - View summary');
  console.log('   - authLogger.exportLogs() - Download logs');
  console.log('   - authLogger.clearLogs() - Clear logs');
}
