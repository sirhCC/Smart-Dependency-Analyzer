/**
 * Memory optimization engine for large-scale dependency analysis
 * 
 * Implements advanced memory management techniques:
 * - Streaming processing to minimize memory footprint
 * - Intelligent garbage collection strategies
 * - Memory leak detection and prevention
 * - Dynamic memory allocation optimization
 */

import { getLogger } from '../../utils/logger';

const logger = getLogger('MemoryOptimizer');

export interface MemoryConfig {
  maxMemoryMB: number;
  gcStrategy: 'aggressive' | 'balanced' | 'conservative';
  leakDetection: boolean;
}

export interface MemoryStats {
  usedMB: number;
  availableMB: number;
  heapUsedMB: number;
  heapTotalMB: number;
  gcCount: number;
  leaksDetected: number;
}

/**
 * Advanced memory optimizer for enterprise-scale analysis
 */
export class MemoryOptimizer {
  private config: MemoryConfig;
  private gcCount: number = 0;
  private leaksDetected: number = 0;
  private memoryHistory: number[] = [];
  private gcTimer: NodeJS.Timeout | undefined;
  private gcStrategyTimer: NodeJS.Timeout | undefined; // interval created by gcStrategy

  constructor() {
    this.config = {
      maxMemoryMB: 1024,
      gcStrategy: 'balanced',
      leakDetection: true
    };

    logger.info('💾 Memory Optimizer initialized');
  }

  /**
   * Configure memory optimization settings
   */
  public async configure(config: MemoryConfig): Promise<void> {
    this.config = { ...config };
    
    // Start memory monitoring
    await this.startMemoryMonitoring();
    
    // Configure garbage collection strategy
    this.configureGarbageCollection();
    
    logger.info(`💾 Memory optimizer configured: ${JSON.stringify(config)}`);
  }

  /**
   * Start monitoring (idempotent)
   */
  public async start(): Promise<void> {
    if (!this.gcTimer) {
      await this.startMemoryMonitoring();
    }
    if (!this.gcStrategyTimer) {
      this.configureGarbageCollection();
    }
  }

  /**
   * Stop all timers (idempotent)
   */
  public stop(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
      this.gcTimer = undefined;
    }
    if (this.gcStrategyTimer) {
      clearInterval(this.gcStrategyTimer);
      this.gcStrategyTimer = undefined;
    }
  }

  /**
   * Get available system memory in MB
   */
  public getAvailableMemory(): number {
    const os = require('os');
    const freeMB = os.freemem() / (1024 * 1024);
    const totalMB = os.totalmem() / (1024 * 1024);
    
    logger.debug(`💾 System memory: ${freeMB.toFixed(1)}MB free of ${totalMB.toFixed(1)}MB total`);
    return freeMB;
  }

  /**
   * Get current memory usage in MB
   */
  public async getCurrentMemoryUsage(): Promise<number> {
    const memUsage = process.memoryUsage();
    const usedMB = memUsage.heapUsed / (1024 * 1024);
    
    // Track memory history for leak detection
    this.memoryHistory.push(usedMB);
    if (this.memoryHistory.length > 100) {
      this.memoryHistory.shift(); // Keep only last 100 measurements
    }
    
    // Check for memory leaks
    if (this.config.leakDetection) {
      await this.detectMemoryLeaks();
    }
    
    return usedMB;
  }

  /**
   * Get comprehensive memory statistics
   */
  public async getMemoryStats(): Promise<MemoryStats> {
    const memUsage = process.memoryUsage();
    const os = require('os');
    
    return {
      usedMB: memUsage.heapUsed / (1024 * 1024),
      availableMB: os.freemem() / (1024 * 1024),
      heapUsedMB: memUsage.heapUsed / (1024 * 1024),
      heapTotalMB: memUsage.heapTotal / (1024 * 1024),
      gcCount: this.gcCount,
      leaksDetected: this.leaksDetected
    };
  }

  /**
   * Force garbage collection if needed
   */
  public async forceGarbageCollection(): Promise<void> {
    if (global.gc) {
      const beforeMB = process.memoryUsage().heapUsed / (1024 * 1024);
      global.gc();
      const afterMB = process.memoryUsage().heapUsed / (1024 * 1024);
      
      this.gcCount++;
      const freedMB = beforeMB - afterMB;
      
      logger.debug(`🗑️ Garbage collection: freed ${freedMB.toFixed(1)}MB`);
    } else {
      logger.warn('⚠️ Garbage collection not available (run with --expose-gc)');
    }
  }

  /**
   * Optimize memory for streaming large datasets
   */
  public createStreamingProcessor<T, R>(
    processor: (item: T) => Promise<R>,
    batchSize: number = 100
  ): (items: T[]) => AsyncGenerator<R[], void, unknown> {
    const self = this;
    
    return async function* streamingProcessor(items: T[]): AsyncGenerator<R[], void, unknown> {
      logger.info(`🌊 Starting streaming processing: ${items.length} items, batch size ${batchSize}`);
      
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const results: R[] = [];
        
        // Process batch
        for (const item of batch) {
          try {
            const result = await processor(item);
            results.push(result);
          } catch (error) {
            logger.warn('Streaming processor error:', error);
          }
        }
        
        // Check memory usage and GC if needed
        const currentMemoryMB = await self.getCurrentMemoryUsage();
        if (currentMemoryMB > self.config.maxMemoryMB * 0.8) {
          logger.info(`💾 Memory usage high (${currentMemoryMB.toFixed(1)}MB), forcing GC`);
          await self.forceGarbageCollection();
        }
        
        yield results;
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setImmediate(resolve));
      }
      
      logger.info('🌊 Streaming processing completed');
    };
  }

  /**
   * Create a memory-optimized object pool
   */
  public createObjectPool<T>(
    factory: () => T,
    reset: (obj: T) => void,
    maxSize: number = 100
  ): ObjectPool<T> {
    return new ObjectPool(factory, reset, maxSize);
  }

  /**
   * Start monitoring memory usage
   */
  private async startMemoryMonitoring(): Promise<void> {
    // Clear existing timer
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
    }
    
    // Monitor memory every 5 seconds
    this.gcTimer = setInterval(async () => {
      const memoryMB = await this.getCurrentMemoryUsage();
      
      // Auto-GC if memory usage is high
      if (memoryMB > this.config.maxMemoryMB * 0.9) {
        logger.warn(`⚠️ High memory usage: ${memoryMB.toFixed(1)}MB (limit: ${this.config.maxMemoryMB}MB)`);
        await this.forceGarbageCollection();
      }
    }, 5000);
  }

  /**
   * Configure garbage collection strategy
   */
  private configureGarbageCollection(): void {
    if (!global.gc) {
      logger.warn('⚠️ Garbage collection not available - run with --expose-gc for optimal performance');
      return;
    }

    switch (this.config.gcStrategy) {
      case 'aggressive':
        // Force GC every 10 seconds
  if (this.gcStrategyTimer) clearInterval(this.gcStrategyTimer);
  this.gcStrategyTimer = setInterval(() => this.forceGarbageCollection(), 10000) as unknown as NodeJS.Timeout;
        break;
      
      case 'balanced':
        // Force GC every 30 seconds
  if (this.gcStrategyTimer) clearInterval(this.gcStrategyTimer);
  this.gcStrategyTimer = setInterval(() => this.forceGarbageCollection(), 30000) as unknown as NodeJS.Timeout;
        break;
      
      case 'conservative':
        if (this.gcStrategyTimer) {
          clearInterval(this.gcStrategyTimer);
          this.gcStrategyTimer = undefined;
        }
        // Let Node.js handle GC naturally
        break;
    }
    
    logger.info(`🗑️ Garbage collection strategy: ${this.config.gcStrategy}`);
  }

  /**
   * Detect potential memory leaks
   */
  private async detectMemoryLeaks(): Promise<void> {
    if (this.memoryHistory.length < 10) return;
    
    // Check for consistently increasing memory usage
    const recent = this.memoryHistory.slice(-10);
    const trend = this.calculateTrend(recent);
    
    if (trend > 5) { // Memory increasing by more than 5MB over last 10 measurements
      this.leaksDetected++;
      logger.warn(`🚨 Potential memory leak detected: trend +${trend.toFixed(1)}MB`);
      
      // Force aggressive GC to try to reclaim memory
      await this.forceGarbageCollection();
    }
  }

  /**
   * Calculate memory usage trend
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const first = values[0];
    const last = values[values.length - 1];
    
    if (first === undefined || last === undefined) return 0;
    return last - first;
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
  this.stop();
    logger.info('💾 Memory optimizer cleaned up');
  }
}

/**
 * Memory-optimized object pool for reusing expensive objects
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private inUse = new Set<T>();

  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    private maxSize: number = 100
  ) {}

  /**
   * Get an object from the pool
   */
  public acquire(): T {
    let obj = this.pool.pop();
    
    if (!obj) {
      obj = this.factory();
    }
    
    this.inUse.add(obj);
    return obj;
  }

  /**
   * Return an object to the pool
   */
  public release(obj: T): void {
    if (!this.inUse.has(obj)) {
      return; // Object not from this pool
    }
    
    this.inUse.delete(obj);
    this.reset(obj);
    
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
    }
  }

  /**
   * Get pool statistics
   */
  public getStats(): { available: number; inUse: number; maxSize: number } {
    return {
      available: this.pool.length,
      inUse: this.inUse.size,
      maxSize: this.maxSize
    };
  }
}
