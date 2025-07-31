/**
 * Enterprise-grade logging system using Pino
 * High-performance structured logging with multiple transports
 */

import pino from 'pino';
import { createWriteStream } from 'fs';
import { join } from 'path';

export interface LoggerConfig {
  level: pino.Level;
  enableConsole: boolean;
  enableFile: boolean;
  logDirectory: string;
  prettyPrint: boolean;
}

export class Logger {
  private static instance: Logger;
  private logger: pino.Logger;
  private config: LoggerConfig;

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: (process.env.LOG_LEVEL as pino.Level) || 'info',
      enableConsole: true,
      enableFile: false,
      logDirectory: './logs',
      prettyPrint: process.env.NODE_ENV !== 'production',
      ...config,
    };

    this.logger = this.createLogger();
  }

  public static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  public static getLogger(name: string): pino.Logger {
    const instance = Logger.getInstance();
    return instance.logger.child({ component: name });
  }

  private createLogger(): pino.Logger {
    const streams: pino.StreamEntry[] = [];

    // Console transport
    if (this.config.enableConsole) {
      streams.push({
        level: this.config.level,
        stream: this.config.prettyPrint
          ? pino.destination(1) // stdout with pretty printing
          : process.stdout,
      });
    }

    // File transport
    if (this.config.enableFile) {
      const logFile = join(this.config.logDirectory, 'sda.log');
      streams.push({
        level: this.config.level,
        stream: createWriteStream(logFile, { flags: 'a' }),
      });
    }

    const logger = pino(
      {
        name: 'sda',
        level: this.config.level,
        formatters: {
          level: (label) => ({ level: label }),
          bindings: (bindings) => ({
            pid: bindings.pid,
            hostname: bindings.hostname,
          }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
          pid: process.pid,
          hostname: require('os').hostname(),
        },
      },
      pino.multistream(streams)
    );

    return logger;
  }

  public getLogger(): pino.Logger {
    return this.logger;
  }

  public child(bindings: Record<string, unknown>): pino.Logger {
    return this.logger.child(bindings);
  }
}

// Export singleton instance methods
export const getLogger = (name: string): pino.Logger => Logger.getLogger(name);
export const logger = Logger.getInstance().getLogger();
