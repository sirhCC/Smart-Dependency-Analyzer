"use strict";
/**
 * High-performance parallel processing engine for batch analysis
 * Implements intelligent chunking and load balancing for optimal throughput
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parallelEngine = exports.ParallelProcessingEngine = void 0;
const logger_1 = require("../../utils/logger");
class ParallelProcessingEngine {
    maxConcurrency;
    workers = new Map();
    taskQueue = [];
    activeTasks = new Map();
    processingStats = {
        totalTasks: 0,
        completedTasks: 0,
        failedTasks: 0,
        avgProcessingTime: 0,
        throughput: 0,
        startTime: Date.now()
    };
    DEFAULT_CONCURRENCY = Math.max(2, Math.floor(require('os').cpus().length * 0.75));
    DEFAULT_CHUNK_SIZE = 10;
    DEFAULT_TIMEOUT = 30000; // 30 seconds
    constructor(maxConcurrency = this.DEFAULT_CONCURRENCY) {
        this.maxConcurrency = maxConcurrency;
        this.initializeWorkers();
        logger_1.logger.info(`⚡ Parallel processing engine initialized with ${maxConcurrency} workers`);
    }
    /**
     * Initialize worker pool
     */
    initializeWorkers() {
        for (let i = 0; i < this.maxConcurrency; i++) {
            const workerId = `worker-${i}`;
            this.workers.set(workerId, {
                tasksCompleted: 0,
                totalProcessingTime: 0,
                averageTaskTime: 0,
                errorsEncountered: 0,
                isActive: false
            });
        }
    }
    /**
     * Process packages in parallel with intelligent batching
     */
    async processPackagesBatch(packages, processor, options = {}) {
        const { maxConcurrency = this.maxConcurrency, chunkSize = this.DEFAULT_CHUNK_SIZE, timeout = this.DEFAULT_TIMEOUT, retryAttempts = 2 } = options;
        if (packages.length === 0)
            return [];
        const startTime = Date.now();
        this.processingStats.totalTasks += packages.length;
        logger_1.logger.info(`🚀 Processing ${packages.length} packages with ${maxConcurrency} workers`);
        // Split packages into optimized chunks
        const chunks = this.createOptimizedChunks(packages, chunkSize);
        const results = new Array(packages.length);
        const promises = [];
        // Process chunks in parallel
        let chunkIndex = 0;
        for (let i = 0; i < Math.min(maxConcurrency, chunks.length); i++) {
            promises.push(this.processChunkWithWorker(chunks[chunkIndex++] || { packages: [], startIndex: 0 }, processor, results, timeout, retryAttempts, () => chunkIndex < chunks.length ? (chunks[chunkIndex++] || null) : null));
        }
        await Promise.all(promises);
        const duration = Date.now() - startTime;
        this.updateProcessingStats(packages.length, duration);
        logger_1.logger.info(`✅ Batch processing completed: ${packages.length} packages in ${duration}ms (${Math.round(packages.length / (duration / 1000))} pkg/s)`);
        return results.filter(r => r !== undefined);
    }
    /**
     * Process a single chunk with a worker
     */
    async processChunkWithWorker(chunk, processor, results, timeout, retryAttempts, getNextChunk) {
        const workerId = this.getAvailableWorker();
        while (chunk) {
            const worker = this.workers.get(workerId);
            worker.isActive = true;
            try {
                await this.processChunk(chunk, processor, results, timeout, retryAttempts, workerId);
            }
            catch (error) {
                logger_1.logger.error(`❌ Worker ${workerId} failed to process chunk:`, error);
                worker.errorsEncountered++;
            }
            finally {
                worker.isActive = false;
            }
            // Get next chunk to process
            chunk = getNextChunk() || { packages: [], startIndex: 0 };
        }
    }
    /**
     * Process a single chunk of packages
     */
    async processChunk(chunk, processor, results, timeout, retryAttempts, workerId) {
        const worker = this.workers.get(workerId);
        const chunkStartTime = Date.now();
        // Process packages in chunk concurrently
        const chunkPromises = chunk.packages.map(async (pkg, index) => {
            const globalIndex = chunk.startIndex + index;
            try {
                const result = await this.executeWithTimeout(() => this.retryOperation(() => processor(pkg), retryAttempts), timeout);
                results[globalIndex] = result;
                this.processingStats.completedTasks++;
            }
            catch (error) {
                logger_1.logger.warn(`⚠️ Failed to process package ${pkg.name}: ${error}`);
                this.processingStats.failedTasks++;
            }
        });
        await Promise.all(chunkPromises);
        // Update worker stats
        const chunkDuration = Date.now() - chunkStartTime;
        worker.tasksCompleted += chunk.packages.length;
        worker.totalProcessingTime += chunkDuration;
        worker.averageTaskTime = worker.totalProcessingTime / worker.tasksCompleted;
    }
    /**
     * Create optimized chunks based on package complexity
     */
    createOptimizedChunks(packages, baseChunkSize) {
        const chunks = [];
        // Sort packages by estimated complexity (more scripts/dependencies = higher complexity)
        const sortedPackages = packages.map((pkg, index) => ({
            pkg,
            originalIndex: index,
            complexity: this.estimatePackageComplexity(pkg)
        })).sort((a, b) => b.complexity - a.complexity);
        // Create balanced chunks
        let currentChunk = [];
        let currentComplexity = 0;
        let startIndex = 0;
        const maxComplexityPerChunk = 100;
        for (const item of sortedPackages) {
            if (currentChunk.length >= baseChunkSize ||
                (currentComplexity + item.complexity > maxComplexityPerChunk && currentChunk.length > 0)) {
                chunks.push({ packages: currentChunk, startIndex });
                currentChunk = [];
                currentComplexity = 0;
                startIndex = chunks.length * baseChunkSize;
            }
            currentChunk.push(item.pkg);
            currentComplexity += item.complexity;
        }
        if (currentChunk.length > 0) {
            chunks.push({ packages: currentChunk, startIndex });
        }
        return chunks;
    }
    /**
     * Estimate package complexity for load balancing
     */
    estimatePackageComplexity(pkg) {
        let complexity = 1; // Base complexity
        // Script complexity
        if (pkg.scripts) {
            complexity += Object.keys(pkg.scripts).length * 2;
            complexity += Object.values(pkg.scripts).reduce((sum, script) => sum + script.length / 100, 0);
        }
        // Dependency complexity
        if (pkg.dependencies) {
            complexity += pkg.dependencies.size * 0.5;
        }
        // Description and keyword complexity
        if (pkg.description) {
            complexity += pkg.description.length / 200;
        }
        if (pkg.keywords) {
            complexity += pkg.keywords.length * 0.3;
        }
        // Author and maintainer complexity
        if (pkg.maintainers) {
            complexity += pkg.maintainers.length * 0.5;
        }
        return Math.max(1, Math.round(complexity));
    }
    /**
     * Get next available worker
     */
    getAvailableWorker() {
        // Find least busy worker
        let leastBusyWorker = '';
        let minTasks = Infinity;
        Array.from(this.workers.entries()).forEach(([workerId, stats]) => {
            if (!stats.isActive && stats.tasksCompleted < minTasks) {
                minTasks = stats.tasksCompleted;
                leastBusyWorker = workerId;
            }
        });
        // If no idle worker, use the one with shortest average task time
        if (!leastBusyWorker) {
            let shortestTime = Infinity;
            Array.from(this.workers.entries()).forEach(([workerId, stats]) => {
                if (stats.averageTaskTime < shortestTime) {
                    shortestTime = stats.averageTaskTime;
                    leastBusyWorker = workerId;
                }
            });
        }
        return leastBusyWorker || 'worker-0';
    }
    /**
     * Execute operation with timeout
     */
    async executeWithTimeout(operation, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Operation timed out after ${timeout}ms`));
            }, timeout);
            operation()
                .then(result => {
                clearTimeout(timer);
                resolve(result);
            })
                .catch(error => {
                clearTimeout(timer);
                reject(error);
            });
        });
    }
    /**
     * Retry operation with exponential backoff
     */
    async retryOperation(operation, maxRetries) {
        let lastError = null;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (attempt < maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError || new Error('Max retries exceeded');
    }
    /**
     * Update processing statistics
     */
    updateProcessingStats(tasksCount, duration) {
        this.processingStats.avgProcessingTime =
            (this.processingStats.avgProcessingTime * (this.processingStats.completedTasks - tasksCount) + duration) /
                this.processingStats.completedTasks;
        this.processingStats.throughput = this.processingStats.completedTasks /
            ((Date.now() - this.processingStats.startTime) / 1000);
    }
    /**
     * Get processing statistics
     */
    getStats() {
        return {
            ...this.processingStats,
            workers: Array.from(this.workers.entries()).map(([id, stats]) => ({
                id,
                ...stats
            })),
            activeWorkers: Array.from(this.workers.values()).filter(w => w.isActive).length
        };
    }
    /**
     * Optimize concurrency based on system performance
     */
    optimizeConcurrency() {
        const stats = this.getStats();
        const avgTaskTime = stats.avgProcessingTime;
        const throughput = stats.throughput;
        // Adjust concurrency based on performance metrics
        if (avgTaskTime > 1000 && throughput < 10) {
            // Reduce concurrency if tasks are taking too long
            this.maxConcurrency = Math.max(2, this.maxConcurrency - 1);
            logger_1.logger.info(`🔧 Reduced concurrency to ${this.maxConcurrency} due to slow performance`);
        }
        else if (avgTaskTime < 100 && throughput > 50) {
            // Increase concurrency if tasks are completing quickly
            const maxPossible = require('os').cpus().length;
            this.maxConcurrency = Math.min(maxPossible, this.maxConcurrency + 1);
            logger_1.logger.info(`🚀 Increased concurrency to ${this.maxConcurrency} due to fast performance`);
        }
    }
    /**
     * Reset statistics
     */
    resetStats() {
        this.processingStats = {
            totalTasks: 0,
            completedTasks: 0,
            failedTasks: 0,
            avgProcessingTime: 0,
            throughput: 0,
            startTime: Date.now()
        };
        Array.from(this.workers.values()).forEach(stats => {
            stats.tasksCompleted = 0;
            stats.totalProcessingTime = 0;
            stats.averageTaskTime = 0;
            stats.errorsEncountered = 0;
        });
        logger_1.logger.info('📊 Processing statistics reset');
    }
    /**
     * Cleanup resources
     */
    destroy() {
        this.workers.clear();
        this.taskQueue.length = 0;
        this.activeTasks.clear();
        logger_1.logger.info('💥 Parallel processing engine destroyed');
    }
}
exports.ParallelProcessingEngine = ParallelProcessingEngine;
// Global processing engine instance
exports.parallelEngine = new ParallelProcessingEngine();
//# sourceMappingURL=parallel-engine.js.map