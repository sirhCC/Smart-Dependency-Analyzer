/**
 * High-performance concurrent processing engine for massive scale dependency analysis
 *
 * Implements sophisticated parallel processing strategies:
 * - Dynamic worker pool management
 * - Intelligent load balancing and task distribution
 * - Resource-aware scheduling
 * - Fault tolerance and recovery
 */
import { EventEmitter } from 'events';
export interface ProcessingTask {
    id: string;
    type: string;
    data: any;
    priority: number;
    timeout?: number;
    retries?: number;
    dependencies?: string[];
}
export interface ProcessingResult {
    taskId: string;
    success: boolean;
    result?: any;
    error?: Error;
    processingTime: number;
    workerId: string;
}
export interface WorkerMetrics {
    id: string;
    tasksCompleted: number;
    tasksActive: number;
    avgProcessingTime: number;
    memoryUsage: number;
    cpuUsage: number;
    errors: number;
    status: 'idle' | 'busy' | 'error' | 'terminated';
}
export interface ConcurrentConfig {
    /** Maximum number of worker threads */
    maxWorkers: number;
    /** Minimum number of worker threads to keep alive */
    minWorkers: number;
    /** Maximum tasks per worker before recycling */
    maxTasksPerWorker: number;
    /** Worker idle timeout before termination (ms) */
    workerIdleTimeout: number;
    /** Maximum task queue size */
    maxQueueSize: number;
    /** Enable automatic worker scaling */
    enableAutoScaling: boolean;
    /** Resource usage thresholds for scaling */
    resourceThresholds: {
        cpuThreshold: number;
        memoryThreshold: number;
        queueLengthThreshold: number;
    };
}
/**
 * Advanced concurrent processor with intelligent worker management
 */
export declare class ConcurrentProcessor extends EventEmitter {
    private readonly config;
    private readonly workers;
    private readonly taskQueue;
    private readonly activeTasks;
    private readonly pendingResults;
    private readonly workerMetrics;
    private taskIdCounter;
    private scalingInterval?;
    private metricsInterval?;
    private isShuttingDown;
    constructor(config?: Partial<ConcurrentConfig>);
    /**
     * Initialize the concurrent processor
     */
    private initialize;
    /**
     * Process a single task with high-performance execution
     */
    processTask(task: Omit<ProcessingTask, 'id'>): Promise<ProcessingResult>;
    /**
     * Process multiple tasks concurrently with intelligent batching
     */
    processBatch(tasks: Omit<ProcessingTask, 'id'>[]): Promise<ProcessingResult[]>;
    /**
     * Process tasks in parallel with dependency resolution
     */
    processWithDependencies(tasks: Omit<ProcessingTask, 'id'>[]): Promise<ProcessingResult[]>;
    /**
     * Get current processing statistics
     */
    getMetrics(): {
        workers: WorkerMetrics[];
        queue: {
            total: number;
            byPriority: Record<number, number>;
        };
        performance: {
            tasksCompleted: number;
            avgProcessingTime: number;
            errorRate: number;
            throughput: number;
        };
    };
    /**
     * Gracefully shutdown the processor
     */
    shutdown(): Promise<void>;
    /**
     * Get available CPU cores for processing
     */
    getAvailableCores(): number;
    /**
     * Get current parallelism level
     */
    getCurrentParallelism(): number;
    /**
     * Configure processor settings (placeholder for compatibility)
     */
    configure(config: any): Promise<void>;
    private createInitialWorkers;
    private createWorker;
    private assignNextTask;
    private getNextTask;
    private assignTaskToWorker;
    private handleWorkerMessage;
    private handleTaskResult;
    private handleTaskError;
    private handleWorkerError;
    private recycleWorker;
    private findAvailableWorker;
    private shouldScaleUp;
    private shouldScaleDown;
    private getTotalQueueLength;
    private generateTaskId;
    private calculateThroughput;
    private updateWorkerMetrics;
    private startAutoScaling;
    private performAutoScaling;
    private startMetricsCollection;
    private waitForActiveTasks;
    private terminateAllWorkers;
}
//# sourceMappingURL=concurrent-processor.d.ts.map