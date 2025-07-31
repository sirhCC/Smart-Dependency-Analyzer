/**
 * Intelligent multi-level caching system for high-performance dependency analysis
 *
 * Implements sophisticated caching strategies:
 * - L1: In-memory LRU cache for hot data
 * - L2: Redis/persistent cache for warm data
 * - L3: File-based cache for cold data
 * - Smart cache invalidation and warming
 */
import { EventEmitter } from 'events';
export interface CacheConfig {
    /** Maximum memory cache size (MB) */
    maxMemorySize: number;
    /** Maximum cache entries */
    maxEntries: number;
    /** Default TTL in milliseconds */
    defaultTtl: number;
    /** Enable Redis cache layer */
    enableRedis: boolean;
    /** Enable file cache layer */
    enableFileCache: boolean;
    /** Cache directory for file-based storage */
    cacheDirectory: string;
    /** Redis connection options */
    redisConfig?: {
        host: string;
        port: number;
        password?: string;
        db?: number;
    };
}
export interface CacheEntry<T = any> {
    key: string;
    value: T;
    size: number;
    accessCount: number;
    lastAccessed: number;
    created: number;
    ttl: number;
    compressed?: boolean;
}
export interface CacheStats {
    level1: {
        hits: number;
        misses: number;
        entries: number;
        memoryUsage: number;
        hitRate: number;
    };
    level2: {
        hits: number;
        misses: number;
        entries: number;
        hitRate: number;
    };
    level3: {
        hits: number;
        misses: number;
        entries: number;
        diskUsage: number;
        hitRate: number;
    };
    overall: {
        totalHits: number;
        totalMisses: number;
        overallHitRate: number;
        avgResponseTime: number;
    };
}
/**
 * High-performance intelligent caching system with multiple cache levels
 */
export declare class IntelligentCache extends EventEmitter {
    private readonly config;
    private readonly l1Cache;
    private readonly accessOrder;
    private readonly stats;
    private currentMemoryUsage;
    private redisClient?;
    private maintenanceInterval?;
    constructor(config?: Partial<CacheConfig>);
    /**
     * Initialize cache system and start maintenance tasks
     */
    private initialize;
    /**
     * Get value from cache with intelligent level selection
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set value in cache with intelligent distribution
     */
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    /**
     * Invalidate cache entry across all levels
     */
    invalidate(key: string): Promise<void>;
    /**
     * Warm cache with frequently accessed data
     */
    warmCache(patterns: string[]): Promise<void>;
    /**
     * Get comprehensive cache statistics
     */
    getStats(): CacheStats;
    /**
     * Clear all cache levels
     */
    clear(): Promise<void>;
    private getFromL1;
    private setToL1;
    private getFromL2;
    private setToL2;
    private getFromL3;
    private setToL3;
    private evictLRU;
    private isExpired;
    private estimateSize;
    private shouldCacheInL2;
    private shouldCacheInL3;
    private updateHitRates;
    private updateResponseTime;
    private getActiveLevels;
    private initializeRedis;
    private initializeFileCache;
    private removeFromFileCache;
    private clearFileCache;
    private startMaintenanceTasks;
    private runMaintenance;
    /**
     * Cleanup resources
     */
    destroy(): void;
    /**
     * Configure cache settings (placeholder for compatibility)
     */
    configure(config: any): Promise<void>;
    /**
     * Get cache hit rate
     */
    getHitRate(): Promise<number>;
}
//# sourceMappingURL=intelligent-cache.d.ts.map