/**
 * Performance optimization engine for enterprise-scale dependency analysis
 * 
 * This module implements advanced performance optimizations to achieve:
 * - Process 10,000+ packages in under 30 seconds
 * - Sub-100ms API response times  
 * - Intelligent multi-level caching
 * - Memory optimization for large dependency trees
 */

import { Package, AnalysisConfig, AnalysisResult } from '../../types';
import { getLogger } from '../../utils/logger';
import { MemoryOptimizer } from './memory-optimizer';
import { IntelligentCache } from './intelligent-cache';
import { ConcurrentProcessor } from './concurrent-processor';
import { AnalysisCoordinator } from './analysis-coordinator';

const logger = getLogger('PerformanceEngine');

export interface PerformanceMetrics {
  totalPackages: number;
  processingTimeMs: number;
  packagesPerSecond: number;
  memoryUsageMB: number;
  cacheHitRate: number;
  parallelismLevel: number;
}

export interface OptimizationPlan {
  batchSize: number;
  parallelWorkers: number;
  cachingStrategy: 'aggressive' | 'balanced' | 'conservative';
  memoryLimitMB: number;
  processingMode: 'streaming' | 'batch' | 'hybrid';
}

/**
 * Enterprise-grade performance optimization engine
 */
export class PerformanceEngine {
  private memoryOptimizer: MemoryOptimizer;
  private cache: IntelligentCache;
  private processor: ConcurrentProcessor;
  private coordinator: AnalysisCoordinator;
  private metrics: PerformanceMetrics;

  constructor() {
    this.memoryOptimizer = new MemoryOptimizer();
    this.cache = new IntelligentCache();
    this.processor = new ConcurrentProcessor();
    this.coordinator = new AnalysisCoordinator(this.processor, this.cache, this.memoryOptimizer);
    this.metrics = this.initializeMetrics();
    
    logger.info('🚀 Performance Engine initialized for enterprise scale');
  }

  /**
   * Optimize analysis performance based on project characteristics
   */
  public async optimizeAnalysis(packages: Package[], options: AnalysisConfig): Promise<{
    plan: OptimizationPlan;
    results: AnalysisResult[];
    metrics: PerformanceMetrics;
  }> {
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

    } catch (error) {
      logger.error('Performance optimization failed:', error);
      throw new Error(`Performance optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate optimal processing plan based on workload characteristics
   */
  private async generateOptimizationPlan(packages: Package[], _options: AnalysisConfig): Promise<OptimizationPlan> {
    const packageCount = packages.length;
    const availableMemoryMB = this.memoryOptimizer.getAvailableMemory();
    const cpuCores = this.processor.getAvailableCores();

    // Determine optimal batch size (target: process batches in ~1-2 seconds)
    let batchSize: number;
    if (packageCount > 10000) {
      batchSize = Math.min(500, Math.ceil(packageCount / 20)); // Large projects: smaller batches
    } else if (packageCount > 1000) {
      batchSize = Math.min(100, Math.ceil(packageCount / 10)); // Medium projects: medium batches
    } else {
      batchSize = Math.min(50, packageCount); // Small projects: process all at once
    }

    // Determine optimal parallelism (target: maximize throughput without thrashing)
    const parallelWorkers = Math.min(
      cpuCores * 2, // Don't exceed 2x CPU cores
      Math.max(2, Math.ceil(packageCount / 100)), // Scale with package count
      16 // Cap at 16 workers for stability
    );

    // Determine caching strategy based on project size and memory
    let cachingStrategy: 'aggressive' | 'balanced' | 'conservative';
    if (availableMemoryMB > 2048 && packageCount > 1000) {
      cachingStrategy = 'aggressive'; // Cache everything for large projects with memory
    } else if (availableMemoryMB > 1024) {
      cachingStrategy = 'balanced'; // Standard caching
    } else {
      cachingStrategy = 'conservative'; // Minimal caching for memory-constrained environments
    }

    // Determine processing mode based on package count and memory
    let processingMode: 'streaming' | 'batch' | 'hybrid';
    if (packageCount > 5000) {
      processingMode = 'streaming'; // Streaming for very large projects
    } else if (packageCount > 500) {
      processingMode = 'hybrid'; // Hybrid for medium projects
    } else {
      processingMode = 'batch'; // Batch for small projects
    }

    // Set memory limit (leave 25% free for system)
    const memoryLimitMB = Math.floor(availableMemoryMB * 0.75);

    const plan: OptimizationPlan = {
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
  private async initializePerformanceMonitoring(plan: OptimizationPlan): Promise<void> {
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
  private async executeOptimizedAnalysis(
    packages: Package[], 
    options: AnalysisConfig, 
    plan: OptimizationPlan
  ): Promise<AnalysisResult[]> {
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
  private async calculatePerformanceMetrics(packageCount: number, processingTimeMs: number): Promise<PerformanceMetrics> {
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
  private initializeMetrics(): PerformanceMetrics {
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
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get performance recommendations based on current metrics
   */
  public getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];

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

/**
 * Factory function to create performance-optimized analysis engine
 */
export function createPerformanceEngine(): PerformanceEngine {
  return new PerformanceEngine();
}
