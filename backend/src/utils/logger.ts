type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

interface Colors {
  ERROR: string;
  WARN: string;
  INFO: string;
  DEBUG: string;
  RESET: string;
}

const colors: Colors = {
  ERROR: '\x1b[31m',
  WARN: '\x1b[33m',
  INFO: '\x1b[36m',
  DEBUG: '\x1b[35m',
  RESET: '\x1b[0m'
};

class Logger {
  private level: string;

  constructor() {
    this.level = process.env.LOG_LEVEL || 'INFO';
  }

  private log(level: LogLevel, ...args: unknown[]): void {
    const timestamp = new Date().toISOString();
    const color = colors[level] || colors.RESET;
    console.log(`${color}[${timestamp}] [${level}]${colors.RESET}`, ...args);
  }

  error(...args: unknown[]): void {
    this.log('ERROR', ...args);
  }

  warn(...args: unknown[]): void {
    this.log('WARN', ...args);
  }

  info(...args: unknown[]): void {
    this.log('INFO', ...args);
  }

  debug(...args: unknown[]): void {
    if (this.level === 'DEBUG') {
      this.log('DEBUG', ...args);
    }
  }
}

export const logger = new Logger();
export default logger;