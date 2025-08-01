/**
 * High-performance parallel processing engine for batch analysis
 * Implements intelligent chunking and load balancing for optimal throughput
 */
import { Package } from '../../types';
interface BatchProcessingOptions {
    maxConcurrency?: number;
    chunkSize?: number;
    timeout?: number;
    retryAttempts?: number;
    priorityThreshold?: number;
}
export declare class ParallelProcessingEngine {
    private maxConcurrency;
    private workers;
    private taskQueue;
    private activeTasks;
    private processingStats;
    private readonly DEFAULT_CONCURRENCY;
    private readonly DEFAULT_CHUNK_SIZE;
    private readonly DEFAULT_TIMEOUT;
    constructor(maxConcurrency?: number);
    /**
     * Initialize worker pool
     */
    private initializeWorkers;
    /**
     * Process packages in parallel with intelligent batching
     */
    processPackagesBatch<T>(packages: Package[], processor: (pkg: Package) => Promise<T>, options?: BatchProcessingOptions): Promise<T[]>;
    /**
     * Process a single chunk with a worker
     */
    private processChunkWithWorker;
    /**
     * Process a single chunk of packages
     */
    private processChunk;
    /**
     * Create optimized chunks based on package complexity
     */
    private createOptimizedChunks;
    /**
     * Estimate package complexity for load balancing
     */
    private estimatePackageComplexity;
    /**
     * Get next available worker
     */
    private getAvailableWorker;
    /**
     * Execute operation with timeout
     */
    private executeWithTimeout;
    /**
     * Retry operation with exponential backoff
     */
    private retryOperation;
    /**
     * Update processing statistics
     */
    private updateProcessingStats;
    /**
     * Get processing statistics
     */
    getStats(): {
        workers: {
            tasksCompleted: number;
            totalProcessingTime: number;
            averageTaskTime: number;
            errorsEncountered: number;
            isActive: boolean;
            id: string;
        }[];
        activeWorkers: number;
        totalTasks: number;
        completedTasks: number;
        failedTasks: number;
        avgProcessingTime: number;
        throughput: number;
        startTime: number;
    };
    /**
     * Optimize concurrency based on system performance
     */
    optimizeConcurrency(): void;
    /**
     * Reset statistics
     */
    resetStats(): void;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
export declare const parallelEngine: ParallelProcessingEngine;
export {};
//# sourceMappingURL=parallel-engine.d.ts.map