/**
 * Enterprise-grade logging system using Pino
 * High-performance structured logging with multiple transports
 */
import pino from 'pino';
export interface LoggerConfig {
    level: pino.Level;
    enableConsole: boolean;
    enableFile: boolean;
    logDirectory: string;
    prettyPrint: boolean;
}
export declare class Logger {
    private static instance;
    private logger;
    private config;
    private constructor();
    static getInstance(config?: Partial<LoggerConfig>): Logger;
    static getLogger(name: string): pino.Logger;
    private createLogger;
    getLogger(): pino.Logger;
    child(bindings: Record<string, unknown>): pino.Logger;
}
export declare const getLogger: (name: string) => pino.Logger;
export declare const logger: pino.Logger<never, boolean>;
//# sourceMappingURL=logger.d.ts.map