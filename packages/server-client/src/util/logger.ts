export interface ILogger {
  error(...args: any[]): void;

  warn(...args: any[]): void;

  info(...args: any[]): void;

  verbose(...args: any[]): void;

  debug(...args: any[]): void;
}

/**
 * 日志工具
 * TODO 后期替换
 */
export class Logger {
  private static instance: ILogger = {
    error: console.error,
    warn: console.warn,
    info: console.warn,
    verbose: console.debug,
    debug: console.debug,
  };

  public static create() {
    return this.instance;
  }
}
