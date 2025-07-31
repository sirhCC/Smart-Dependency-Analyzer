"use strict";
/**
 * Enterprise-grade logging system using Pino
 * High-performance structured logging with multiple transports
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.getLogger = exports.Logger = void 0;
const pino_1 = __importDefault(require("pino"));
const fs_1 = require("fs");
const path_1 = require("path");
class Logger {
    static instance;
    logger;
    config;
    constructor(config = {}) {
        this.config = {
            level: process.env.LOG_LEVEL || 'info',
            enableConsole: true,
            enableFile: false,
            logDirectory: './logs',
            prettyPrint: process.env.NODE_ENV !== 'production',
            ...config,
        };
        this.logger = this.createLogger();
    }
    static getInstance(config) {
        if (!Logger.instance) {
            Logger.instance = new Logger(config);
        }
        return Logger.instance;
    }
    static getLogger(name) {
        const instance = Logger.getInstance();
        return instance.logger.child({ component: name });
    }
    createLogger() {
        const streams = [];
        // Console transport
        if (this.config.enableConsole) {
            streams.push({
                level: this.config.level,
                stream: this.config.prettyPrint
                    ? pino_1.default.destination(1) // stdout with pretty printing
                    : process.stdout,
            });
        }
        // File transport
        if (this.config.enableFile) {
            const logFile = (0, path_1.join)(this.config.logDirectory, 'sda.log');
            streams.push({
                level: this.config.level,
                stream: (0, fs_1.createWriteStream)(logFile, { flags: 'a' }),
            });
        }
        const logger = (0, pino_1.default)({
            name: 'sda',
            level: this.config.level,
            formatters: {
                level: (label) => ({ level: label }),
                bindings: (bindings) => ({
                    pid: bindings.pid,
                    hostname: bindings.hostname,
                }),
            },
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
            base: {
                pid: process.pid,
                hostname: require('os').hostname(),
            },
        }, pino_1.default.multistream(streams));
        return logger;
    }
    getLogger() {
        return this.logger;
    }
    child(bindings) {
        return this.logger.child(bindings);
    }
}
exports.Logger = Logger;
// Export singleton instance methods
const getLogger = (name) => Logger.getLogger(name);
exports.getLogger = getLogger;
exports.logger = Logger.getInstance().getLogger();
//# sourceMappingURL=logger.js.map