/**
 * Analysis coordination engine for intelligent dependency analysis orchestration
 *
 * Coordinates complex analysis workflows with:
 * - Intelligent analysis planning and prioritization
 * - Dynamic resource allocation and optimization
 * - Cross-package dependency resolution
 * - Real-time progress tracking and adaptive scheduling
 */
import { EventEmitter } from 'events';
import { ConcurrentProcessor } from './concurrent-processor';
import { IntelligentCache } from './intelligent-cache';
import { MemoryOptimizer } from './memory-optimizer';
export interface AnalysisRequest {
    id: string;
    type: 'package' | 'vulnerability' | 'license' | 'dependency-tree' | 'comprehensive';
    targets: string[];
    options: AnalysisOptions;
    priority: number;
    deadline?: number;
}
export interface AnalysisOptions {
    includeDevDependencies: boolean;
    includePeerDependencies: boolean;
    maxDepth: number;
    enableCaching: boolean;
    parallelism: number;
    timeoutMs: number;
    retryCount: number;
    outputFormat: 'json' | 'xml' | 'html' | 'pdf';
    includeVulnerabilityScanning: boolean;
    includeLicenseAnalysis: boolean;
    includePerformanceMetrics: boolean;
}
export interface AnalysisStep {
    id: string;
    type: string;
    dependencies: string[];
    estimatedDuration: number;
    resourceRequirements: ResourceRequirements;
    canCache: boolean;
    priority: number;
}
export interface ResourceRequirements {
    cpu: number;
    memory: number;
    disk: number;
    network: boolean;
}
export interface AnalysisProgress {
    requestId: string;
    totalSteps: number;
    completedSteps: number;
    currentStep?: string;
    estimatedCompletion: number;
    processingRate: number;
    errors: AnalysisError[];
}
export interface AnalysisError {
    step: string;
    error: Error;
    timestamp: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    retryable: boolean;
}
export interface CoordinatorConfig {
    /** Maximum concurrent analysis requests */
    maxConcurrentRequests: number;
    /** Default analysis timeout */
    defaultTimeout: number;
    /** Enable intelligent scheduling */
    enableIntelligentScheduling: boolean;
    /** Resource limits */
    resourceLimits: {
        maxCpuUsage: number;
        maxMemoryUsage: number;
        maxDiskUsage: number;
    };
    /** Progress update interval */
    progressUpdateInterval: number;
    /** Enable adaptive optimization */
    enableAdaptiveOptimization: boolean;
}
/**
 * Intelligent analysis coordinator for enterprise-scale dependency analysis
 */
export declare class AnalysisCoordinator extends EventEmitter {
    private readonly config;
    private readonly processor;
    private readonly cache;
    private readonly memoryOptimizer;
    private readonly activeRequests;
    private readonly requestProgress;
    private readonly requestResults;
    private readonly analysisPlans;
    private progressInterval?;
    private optimizationInterval?;
    private requestIdCounter;
    constructor(processor: ConcurrentProcessor, cache: IntelligentCache, memoryOptimizer: MemoryOptimizer, config?: Partial<CoordinatorConfig>);
    /**
     * Initialize the analysis coordinator
     */
    private initialize;
    /**
     * Submit an analysis request for processing
     */
    submitAnalysis(request: Omit<AnalysisRequest, 'id'>): Promise<string>;
    /**
     * Get analysis progress for a request
     */
    getProgress(requestId: string): AnalysisProgress | null;
    /**
     * Get analysis results for a completed request
     */
    getResults(requestId: string): any | null;
    /**
     * Cancel an active analysis request
     */
    cancelAnalysis(requestId: string): Promise<boolean>;
    /**
     * Get coordinator statistics and metrics
     */
    getMetrics(): {
        activeRequests: number;
        totalCompleted: number;
        averageCompletionTime: number;
        successRate: number;
        resourceUtilization: {
            cpu: number;
            memory: number;
            cache: any;
        };
    };
    private generateAnalysisPlan;
    private generatePackageAnalysisSteps;
    private generateVulnerabilitySteps;
    private generateLicenseSteps;
    private generateDependencyTreeSteps;
    private generateComprehensiveSteps;
    private optimizeStepOrder;
    private executeAnalysisPlan;
    private updateProgress;
    private handleAnalysisError;
    private generateCacheKey;
    private aggregateResults;
    private generateAnalysisSummary;
    private estimateCompletion;
    private generateRequestId;
    private calculateAverageCompletionTime;
    private calculateSuccessRate;
    private calculateCpuUtilization;
    private calculateMemoryUtilization;
    private startProgressTracking;
    private startAdaptiveOptimization;
    private performAdaptiveOptimization;
    /**
     * Cleanup resources
     */
    destroy(): void;
    /**
     * Execute streaming analysis for performance engine compatibility
     */
    executeStreamingAnalysis(packages: any[], _options: any, _plan: any): Promise<any[]>;
    /**
     * Execute batch analysis for performance engine compatibility
     */
    executeBatchAnalysis(packages: any[], _options: any, _plan: any): Promise<any[]>;
    /**
     * Execute parallel analysis for performance engine compatibility
     */
    executeParallelAnalysis(packages: any[], _options: any, _plan: any): Promise<any[]>;
    /**
     * Execute hybrid analysis for performance engine compatibility
     */
    executeHybridAnalysis(packages: any[], _options: any, _plan: any): Promise<any[]>;
}
//# sourceMappingURL=analysis-coordinator.d.ts.map