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
export declare class PerformanceEngine {
    private memoryOptimizer;
    private cache;
    private processor;
    private coordinator;
    private metrics;
    constructor();
    /**
     * Optimize analysis performance based on project characteristics
     */
    optimizeAnalysis(packages: Package[], options: AnalysisConfig): Promise<{
        plan: OptimizationPlan;
        results: AnalysisResult[];
        metrics: PerformanceMetrics;
    }>;
    /**
     * Generate optimal processing plan based on workload characteristics
     */
    private generateOptimizationPlan;
    /**
     * Initialize performance monitoring systems
     */
    private initializePerformanceMonitoring;
    /**
     * Execute optimized analysis using the generated plan
     */
    private executeOptimizedAnalysis;
    /**
     * Calculate comprehensive performance metrics
     */
    private calculatePerformanceMetrics;
    /**
     * Initialize default metrics
     */
    private initializeMetrics;
    /**
     * Get current performance metrics
     */
    getMetrics(): PerformanceMetrics;
    /**
     * Get performance recommendations based on current metrics
     */
    getPerformanceRecommendations(): string[];
}
/**
 * Factory function to create performance-optimized analysis engine
 */
export declare function createPerformanceEngine(): PerformanceEngine;
//# sourceMappingURL=performance-engine.d.ts.map