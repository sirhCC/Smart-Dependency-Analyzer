/**
 * Logger utility tests
 */

import { Logger, getLogger } from '../utils/logger';

describe('Logger', () => {
  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should return a logger instance', () => {
      const instance = Logger.getInstance();
      expect(instance).toBeInstanceOf(Logger);
    });
  });

  describe('getLogger', () => {
    it('should return a logger with component name', () => {
      const logger = getLogger('TEST');
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should create different child loggers for different components', () => {
      const logger1 = getLogger('COMPONENT1');
      const logger2 = getLogger('COMPONENT2');
      expect(logger1).toBeDefined();
      expect(logger2).toBeDefined();
      // They should be different child instances
      expect(logger1).not.toBe(logger2);
    });
  });

  describe('logger functionality', () => {
    it('should be able to log messages', () => {
      const logger = getLogger('TEST');
      // These should not throw
      expect(() => logger.info('Test message')).not.toThrow();
      expect(() => logger.error('Error message')).not.toThrow();
      expect(() => logger.warn('Warning message')).not.toThrow();
      expect(() => logger.debug('Debug message')).not.toThrow();
    });
  });
});
