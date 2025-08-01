/**
 * Enterprise-grade cache manager for performance optimization
 * Implements intelligent caching strategies for AI predictions and analysis results
 */
import { Package } from '../../types';
import { VulnerabilityPrediction } from '../intelligence/ai-engine';
interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    hitRate: number;
    totalQueries: number;
}
export declare class CacheManager {
    private predictionCache;
    private typosquattingCache;
    private patternCache;
    private stats;
    private readonly DEFAULT_TTL;
    private readonly MAX_CACHE_SIZE;
    private readonly CLEANUP_INTERVAL;
    private cleanupTimer;
    constructor();
    /**
     * Generate cache key for package analysis
     */
    private generatePackageKey;
    /**
     * Cache vulnerability prediction with intelligent TTL
     */
    cachePrediction(pkg: Package, prediction: VulnerabilityPrediction): void;
    /**
     * Retrieve cached prediction
     */
    getCachedPrediction(pkg: Package): VulnerabilityPrediction | null;
    /**
     * Cache typosquatting analysis results
     */
    cacheTyposquattingResult(packageName: string, result: {
        isTyposquat: boolean;
        target: string;
        confidence: number;
    }): void;
    /**
     * Get cached typosquatting result
     */
    getCachedTyposquattingResult(packageName: string): {
        isTyposquat: boolean;
        target: string;
        confidence: number;
    } | null;
    /**
     * Cache pattern analysis results
     */
    cachePatternResult(content: string, result: {
        score: number;
        threats: string[];
    }): void;
    /**
     * Get cached pattern result
     */
    getCachedPatternResult(content: string): {
        score: number;
        threats: string[];
    } | null;
    /**
     * Warm cache with commonly analyzed packages
     */
    warmCache(packages: Package[], predictions: VulnerabilityPrediction[]): Promise<void>;
    /**
     * Bulk cache operations for batch processing
     */
    batchCachePredictions(packagePredictionPairs: Array<{
        pkg: Package;
        prediction: VulnerabilityPrediction;
    }>): void;
    /**
     * Intelligent cache eviction using LFU + TTL
     */
    private enforceMaxSize;
    /**
     * Cleanup expired entries
     */
    private cleanup;
    /**
     * Start automatic cleanup timer
     */
    private startCleanupTimer;
    /**
     * Update cache statistics
     */
    private updateStats;
    /**
     * Update hit rate calculation
     */
    private updateHitRate;
    /**
     * Get cache performance statistics
     */
    getStats(): CacheStats;
    /**
     * Clear all caches
     */
    clear(): void;
    /**
     * Precompute common patterns for performance
     */
    precomputeCommonPatterns(): void;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
export declare const cacheManager: CacheManager;
export {};
//# sourceMappingURL=cache-manager.d.ts.map