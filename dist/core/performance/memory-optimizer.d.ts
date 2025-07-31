/**
 * Memory optimization engine for large-scale dependency analysis
 *
 * Implements advanced memory management techniques:
 * - Streaming processing to minimize memory footprint
 * - Intelligent garbage collection strategies
 * - Memory leak detection and prevention
 * - Dynamic memory allocation optimization
 */
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
export declare class MemoryOptimizer {
    private config;
    private gcCount;
    private leaksDetected;
    private memoryHistory;
    private gcTimer?;
    constructor();
    /**
     * Configure memory optimization settings
     */
    configure(config: MemoryConfig): Promise<void>;
    /**
     * Get available system memory in MB
     */
    getAvailableMemory(): number;
    /**
     * Get current memory usage in MB
     */
    getCurrentMemoryUsage(): Promise<number>;
    /**
     * Get comprehensive memory statistics
     */
    getMemoryStats(): Promise<MemoryStats>;
    /**
     * Force garbage collection if needed
     */
    forceGarbageCollection(): Promise<void>;
    /**
     * Optimize memory for streaming large datasets
     */
    createStreamingProcessor<T, R>(processor: (item: T) => Promise<R>, batchSize?: number): (items: T[]) => AsyncGenerator<R[], void, unknown>;
    /**
     * Create a memory-optimized object pool
     */
    createObjectPool<T>(factory: () => T, reset: (obj: T) => void, maxSize?: number): ObjectPool<T>;
    /**
     * Start monitoring memory usage
     */
    private startMemoryMonitoring;
    /**
     * Configure garbage collection strategy
     */
    private configureGarbageCollection;
    /**
     * Detect potential memory leaks
     */
    private detectMemoryLeaks;
    /**
     * Calculate memory usage trend
     */
    private calculateTrend;
    /**
     * Cleanup resources
     */
    cleanup(): void;
}
/**
 * Memory-optimized object pool for reusing expensive objects
 */
export declare class ObjectPool<T> {
    private factory;
    private reset;
    private maxSize;
    private pool;
    private inUse;
    constructor(factory: () => T, reset: (obj: T) => void, maxSize?: number);
    /**
     * Get an object from the pool
     */
    acquire(): T;
    /**
     * Return an object to the pool
     */
    release(obj: T): void;
    /**
     * Get pool statistics
     */
    getStats(): {
        available: number;
        inUse: number;
        maxSize: number;
    };
}
//# sourceMappingURL=memory-optimizer.d.ts.map