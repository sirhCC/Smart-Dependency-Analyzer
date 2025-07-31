"use strict";
/**
 * Memory optimization engine for large-scale dependency analysis
 *
 * Implements advanced memory management techniques:
 * - Streaming processing to minimize memory footprint
 * - Intelligent garbage collection strategies
 * - Memory leak detection and prevention
 * - Dynamic memory allocation optimization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPool = exports.MemoryOptimizer = void 0;
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.getLogger)('MemoryOptimizer');
/**
 * Advanced memory optimizer for enterprise-scale analysis
 */
class MemoryOptimizer {
    config;
    gcCount = 0;
    leaksDetected = 0;
    memoryHistory = [];
    gcTimer;
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
    async configure(config) {
        this.config = { ...config };
        // Start memory monitoring
        await this.startMemoryMonitoring();
        // Configure garbage collection strategy
        this.configureGarbageCollection();
        logger.info(`💾 Memory optimizer configured: ${JSON.stringify(config)}`);
    }
    /**
     * Get available system memory in MB
     */
    getAvailableMemory() {
        const os = require('os');
        const freeMB = os.freemem() / (1024 * 1024);
        const totalMB = os.totalmem() / (1024 * 1024);
        logger.debug(`💾 System memory: ${freeMB.toFixed(1)}MB free of ${totalMB.toFixed(1)}MB total`);
        return freeMB;
    }
    /**
     * Get current memory usage in MB
     */
    async getCurrentMemoryUsage() {
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
    async getMemoryStats() {
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
    async forceGarbageCollection() {
        if (global.gc) {
            const beforeMB = process.memoryUsage().heapUsed / (1024 * 1024);
            global.gc();
            const afterMB = process.memoryUsage().heapUsed / (1024 * 1024);
            this.gcCount++;
            const freedMB = beforeMB - afterMB;
            logger.debug(`🗑️ Garbage collection: freed ${freedMB.toFixed(1)}MB`);
        }
        else {
            logger.warn('⚠️ Garbage collection not available (run with --expose-gc)');
        }
    }
    /**
     * Optimize memory for streaming large datasets
     */
    createStreamingProcessor(processor, batchSize = 100) {
        const self = this;
        return async function* streamingProcessor(items) {
            logger.info(`🌊 Starting streaming processing: ${items.length} items, batch size ${batchSize}`);
            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);
                const results = [];
                // Process batch
                for (const item of batch) {
                    try {
                        const result = await processor(item);
                        results.push(result);
                    }
                    catch (error) {
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
    createObjectPool(factory, reset, maxSize = 100) {
        return new ObjectPool(factory, reset, maxSize);
    }
    /**
     * Start monitoring memory usage
     */
    async startMemoryMonitoring() {
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
    configureGarbageCollection() {
        if (!global.gc) {
            logger.warn('⚠️ Garbage collection not available - run with --expose-gc for optimal performance');
            return;
        }
        switch (this.config.gcStrategy) {
            case 'aggressive':
                // Force GC every 10 seconds
                setInterval(() => this.forceGarbageCollection(), 10000);
                break;
            case 'balanced':
                // Force GC every 30 seconds
                setInterval(() => this.forceGarbageCollection(), 30000);
                break;
            case 'conservative':
                // Let Node.js handle GC naturally
                break;
        }
        logger.info(`🗑️ Garbage collection strategy: ${this.config.gcStrategy}`);
    }
    /**
     * Detect potential memory leaks
     */
    async detectMemoryLeaks() {
        if (this.memoryHistory.length < 10)
            return;
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
    calculateTrend(values) {
        if (values.length < 2)
            return 0;
        const first = values[0];
        const last = values[values.length - 1];
        if (first === undefined || last === undefined)
            return 0;
        return last - first;
    }
    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.gcTimer) {
            clearInterval(this.gcTimer);
        }
        logger.info('💾 Memory optimizer cleaned up');
    }
}
exports.MemoryOptimizer = MemoryOptimizer;
/**
 * Memory-optimized object pool for reusing expensive objects
 */
class ObjectPool {
    factory;
    reset;
    maxSize;
    pool = [];
    inUse = new Set();
    constructor(factory, reset, maxSize = 100) {
        this.factory = factory;
        this.reset = reset;
        this.maxSize = maxSize;
    }
    /**
     * Get an object from the pool
     */
    acquire() {
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
    release(obj) {
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
    getStats() {
        return {
            available: this.pool.length,
            inUse: this.inUse.size,
            maxSize: this.maxSize
        };
    }
}
exports.ObjectPool = ObjectPool;
//# sourceMappingURL=memory-optimizer.js.map