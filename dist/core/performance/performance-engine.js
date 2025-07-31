"use strict";
/**
 * Performance optimization engine for enterprise-scale dependency analysis
 *
 * This module implements advanced performance optimizations to achieve:
 * - Process 10,000+ packages in under 30 seconds
 * - Sub-100ms API response times
 * - Intelligent multi-level caching
 * - Memory optimization for large dependency trees
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceEngine = void 0;
exports.createPerformanceEngine = createPerformanceEngine;
const logger_1 = require("../../utils/logger");
const memory_optimizer_1 = require("./memory-optimizer");
const intelligent_cache_1 = require("./intelligent-cache");
const concurrent_processor_1 = require("./concurrent-processor");
const analysis_coordinator_1 = require("./analysis-coordinator");
const logger = (0, logger_1.getLogger)('PerformanceEngine');
/**
 * Enterprise-grade performance optimization engine
 */
class PerformanceEngine {
    memoryOptimizer;
    cache;
    processor;
    coordinator;
    metrics;
    constructor() {
        this.memoryOptimizer = new memory_optimizer_1.MemoryOptimizer();
        this.cache = new intelligent_cache_1.IntelligentCache();
        this.processor = new concurrent_processor_1.ConcurrentProcessor();
        this.coordinator = new analysis_coordinator_1.AnalysisCoordinator(this.processor, this.cache, this.memoryOptimizer);
        this.metrics = this.initializeMetrics();
        logger.info('🚀 Performance Engine initialized for enterprise scale');
    }
    /**
     * Optimize analysis performance based on project characteristics
     */
    async optimizeAnalysis(packages, options) {
        const startTime = Date.now();
        logger.info(`⚡ Starting performance-optimized analysis for ${packages.length} packages`);
        try {
            // Generate optimal processing plan
            const plan = await this.generateOptimizationPlan(packages, options);
            logger.info(`📋 Generated optimization plan: ${plan.processingMode} mode, ${plan.parallelWorkers} workers`);
            // Initialize performance monitoring
            await this.initializePerformanceMonitoring(plan);
            // Execute optimized analysis
            const results = await this.executeOptimizedAnalysis(packages, options, plan);
            // Calculate final metrics
            const processingTime = Date.now() - startTime;
            this.metrics = await this.calculatePerformanceMetrics(packages.length, processingTime);
            logger.info(`✅ Performance-optimized analysis completed in ${processingTime}ms`);
            logger.info(`📊 Performance: ${this.metrics.packagesPerSecond.toFixed(1)} packages/sec`);
            logger.info(`💾 Memory usage: ${this.metrics.memoryUsageMB.toFixed(1)}MB`);
            logger.info(`📈 Cache hit rate: ${(this.metrics.cacheHitRate * 100).toFixed(1)}%`);
            return {
                plan,
                results,
                metrics: this.metrics
            };
        }
        catch (error) {
            logger.error('Performance optimization failed:', error);
            throw new Error(`Performance optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Generate optimal processing plan based on workload characteristics
     */
    async generateOptimizationPlan(packages, _options) {
        const packageCount = packages.length;
        const availableMemoryMB = this.memoryOptimizer.getAvailableMemory();
        const cpuCores = this.processor.getAvailableCores();
        // Determine optimal batch size (target: process batches in ~1-2 seconds)
        let batchSize;
        if (packageCount > 10000) {
            batchSize = Math.min(500, Math.ceil(packageCount / 20)); // Large projects: smaller batches
        }
        else if (packageCount > 1000) {
            batchSize = Math.min(100, Math.ceil(packageCount / 10)); // Medium projects: medium batches
        }
        else {
            batchSize = Math.min(50, packageCount); // Small projects: process all at once
        }
        // Determine optimal parallelism (target: maximize throughput without thrashing)
        const parallelWorkers = Math.min(cpuCores * 2, // Don't exceed 2x CPU cores
        Math.max(2, Math.ceil(packageCount / 100)), // Scale with package count
        16 // Cap at 16 workers for stability
        );
        // Determine caching strategy based on project size and memory
        let cachingStrategy;
        if (availableMemoryMB > 2048 && packageCount > 1000) {
            cachingStrategy = 'aggressive'; // Cache everything for large projects with memory
        }
        else if (availableMemoryMB > 1024) {
            cachingStrategy = 'balanced'; // Standard caching
        }
        else {
            cachingStrategy = 'conservative'; // Minimal caching for memory-constrained environments
        }
        // Determine processing mode based on package count and memory
        let processingMode;
        if (packageCount > 5000) {
            processingMode = 'streaming'; // Streaming for very large projects
        }
        else if (packageCount > 500) {
            processingMode = 'hybrid'; // Hybrid for medium projects
        }
        else {
            processingMode = 'batch'; // Batch for small projects
        }
        // Set memory limit (leave 25% free for system)
        const memoryLimitMB = Math.floor(availableMemoryMB * 0.75);
        const plan = {
            batchSize,
            parallelWorkers,
            cachingStrategy,
            memoryLimitMB,
            processingMode
        };
        logger.info(`📊 Optimization plan: ${JSON.stringify(plan, null, 2)}`);
        return plan;
    }
    /**
     * Initialize performance monitoring systems
     */
    async initializePerformanceMonitoring(plan) {
        // Configure memory monitoring
        await this.memoryOptimizer.configure({
            maxMemoryMB: plan.memoryLimitMB,
            gcStrategy: plan.processingMode === 'streaming' ? 'aggressive' : 'balanced',
            leakDetection: true
        });
        // Configure caching system
        await this.cache.configure({
            strategy: plan.cachingStrategy,
            maxMemoryMB: Math.floor(plan.memoryLimitMB * 0.3), // 30% of memory for cache
            compressionEnabled: plan.processingMode === 'streaming'
        });
        // Configure concurrent processor
        await this.processor.configure({
            maxWorkers: plan.parallelWorkers,
            queueSize: plan.batchSize * 2,
            taskTimeout: 30000 // 30 second timeout per task
        });
        logger.info('📡 Performance monitoring systems initialized');
    }
    /**
     * Execute optimized analysis using the generated plan
     */
    async executeOptimizedAnalysis(packages, options, plan) {
        switch (plan.processingMode) {
            case 'streaming':
                return await this.coordinator.executeStreamingAnalysis(packages, options, plan);
            case 'batch':
                return await this.coordinator.executeBatchAnalysis(packages, options, plan);
            case 'hybrid':
                return await this.coordinator.executeHybridAnalysis(packages, options, plan);
            default:
                throw new Error(`Unknown processing mode: ${plan.processingMode}`);
        }
    }
    /**
     * Calculate comprehensive performance metrics
     */
    async calculatePerformanceMetrics(packageCount, processingTimeMs) {
        const packagesPerSecond = (packageCount / processingTimeMs) * 1000;
        const memoryUsageMB = await this.memoryOptimizer.getCurrentMemoryUsage();
        const cacheHitRate = await this.cache.getHitRate();
        const parallelismLevel = this.processor.getCurrentParallelism();
        return {
            totalPackages: packageCount,
            processingTimeMs,
            packagesPerSecond,
            memoryUsageMB,
            cacheHitRate,
            parallelismLevel
        };
    }
    /**
     * Initialize default metrics
     */
    initializeMetrics() {
        return {
            totalPackages: 0,
            processingTimeMs: 0,
            packagesPerSecond: 0,
            memoryUsageMB: 0,
            cacheHitRate: 0,
            parallelismLevel: 1
        };
    }
    /**
     * Get current performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    /**
     * Get performance recommendations based on current metrics
     */
    getPerformanceRecommendations() {
        const recommendations = [];
        if (this.metrics.packagesPerSecond < 100) {
            recommendations.push('Consider increasing parallel workers for better throughput');
        }
        if (this.metrics.memoryUsageMB > 1024) {
            recommendations.push('High memory usage detected - consider streaming mode for large projects');
        }
        if (this.metrics.cacheHitRate < 0.3) {
            recommendations.push('Low cache hit rate - consider more aggressive caching strategy');
        }
        if (this.metrics.processingTimeMs > 30000) {
            recommendations.push('Processing time exceeds 30s - consider optimizing analysis scope');
        }
        return recommendations;
    }
}
exports.PerformanceEngine = PerformanceEngine;
/**
 * Factory function to create performance-optimized analysis engine
 */
function createPerformanceEngine() {
    return new PerformanceEngine();
}
//# sourceMappingURL=performance-engine.js.map