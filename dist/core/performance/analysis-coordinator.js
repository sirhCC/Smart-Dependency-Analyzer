"use strict";
/**
 * Analysis coordination engine for intelligent dependency analysis orchestration
 *
 * Coordinates complex analysis workflows with:
 * - Intelligent analysis planning and prioritization
 * - Dynamic resource allocation and optimization
 * - Cross-package dependency resolution
 * - Real-time progress tracking and adaptive scheduling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisCoordinator = void 0;
const events_1 = require("events");
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.getLogger)('AnalysisCoordinator');
/**
 * Intelligent analysis coordinator for enterprise-scale dependency analysis
 */
class AnalysisCoordinator extends events_1.EventEmitter {
    config;
    processor;
    cache;
    memoryOptimizer;
    activeRequests = new Map();
    requestProgress = new Map();
    requestResults = new Map();
    analysisPlans = new Map();
    progressInterval;
    optimizationInterval;
    requestIdCounter = 0;
    constructor(processor, cache, memoryOptimizer, config = {}) {
        super();
        this.processor = processor;
        this.cache = cache;
        this.memoryOptimizer = memoryOptimizer;
        this.config = {
            maxConcurrentRequests: 50,
            defaultTimeout: 300000, // 5 minutes
            enableIntelligentScheduling: true,
            resourceLimits: {
                maxCpuUsage: 90,
                maxMemoryUsage: 85,
                maxDiskUsage: 80,
            },
            progressUpdateInterval: 1000,
            enableAdaptiveOptimization: true,
            ...config,
        };
        this.initialize();
    }
    /**
     * Initialize the analysis coordinator
     */
    initialize() {
        this.startProgressTracking();
        if (this.config.enableAdaptiveOptimization) {
            this.startAdaptiveOptimization();
        }
        logger.info('Analysis coordinator initialized', {
            maxConcurrentRequests: this.config.maxConcurrentRequests,
            intelligentScheduling: this.config.enableIntelligentScheduling,
            adaptiveOptimization: this.config.enableAdaptiveOptimization,
        });
    }
    /**
     * Submit an analysis request for processing
     */
    async submitAnalysis(request) {
        // Check capacity
        if (this.activeRequests.size >= this.config.maxConcurrentRequests) {
            throw new Error('Maximum concurrent requests limit reached');
        }
        const requestId = this.generateRequestId();
        const fullRequest = {
            ...request,
            id: requestId,
        };
        try {
            // Generate analysis plan
            const analysisPlans = await this.generateAnalysisPlan(fullRequest);
            this.analysisPlans.set(requestId, analysisPlans);
            // Initialize progress tracking
            this.requestProgress.set(requestId, {
                requestId,
                totalSteps: analysisPlans.length,
                completedSteps: 0,
                estimatedCompletion: this.estimateCompletion(analysisPlans),
                processingRate: 0,
                errors: [],
            });
            // Start analysis execution
            this.activeRequests.set(requestId, fullRequest);
            this.executeAnalysisPlan(requestId, analysisPlans);
            logger.info('Analysis request submitted', {
                requestId,
                type: fullRequest.type,
                targets: fullRequest.targets.length,
                steps: analysisPlans.length,
            });
            return requestId;
        }
        catch (error) {
            logger.error('Failed to submit analysis request', { error });
            throw error;
        }
    }
    /**
     * Get analysis progress for a request
     */
    getProgress(requestId) {
        return this.requestProgress.get(requestId) || null;
    }
    /**
     * Get analysis results for a completed request
     */
    getResults(requestId) {
        return this.requestResults.get(requestId) || null;
    }
    /**
     * Cancel an active analysis request
     */
    async cancelAnalysis(requestId) {
        const request = this.activeRequests.get(requestId);
        if (!request) {
            return false;
        }
        try {
            // Mark as cancelled and clean up
            this.activeRequests.delete(requestId);
            this.requestProgress.delete(requestId);
            this.analysisPlans.delete(requestId);
            this.emit('analysisCancelled', { requestId });
            logger.info('Analysis request cancelled', { requestId });
            return true;
        }
        catch (error) {
            logger.error('Failed to cancel analysis request', { requestId, error });
            return false;
        }
    }
    /**
     * Get coordinator statistics and metrics
     */
    getMetrics() {
        const cacheStats = this.cache.getStats();
        return {
            activeRequests: this.activeRequests.size,
            totalCompleted: this.requestResults.size,
            averageCompletionTime: this.calculateAverageCompletionTime(),
            successRate: this.calculateSuccessRate(),
            resourceUtilization: {
                cpu: this.calculateCpuUtilization(),
                memory: this.calculateMemoryUtilization(),
                cache: cacheStats,
            },
        };
    }
    // Private implementation methods
    async generateAnalysisPlan(request) {
        const steps = [];
        try {
            switch (request.type) {
                case 'package':
                    steps.push(...await this.generatePackageAnalysisSteps(request));
                    break;
                case 'vulnerability':
                    steps.push(...await this.generateVulnerabilitySteps(request));
                    break;
                case 'license':
                    steps.push(...await this.generateLicenseSteps(request));
                    break;
                case 'dependency-tree':
                    steps.push(...await this.generateDependencyTreeSteps(request));
                    break;
                case 'comprehensive':
                    steps.push(...await this.generateComprehensiveSteps(request));
                    break;
            }
            // Optimize step order for dependencies and resource usage
            const optimizedSteps = this.optimizeStepOrder(steps);
            logger.debug('Analysis plan generated', {
                requestId: request.id,
                stepCount: optimizedSteps.length,
                estimatedDuration: optimizedSteps.reduce((sum, step) => sum + step.estimatedDuration, 0),
            });
            return optimizedSteps;
        }
        catch (error) {
            logger.error('Failed to generate analysis plan', { requestId: request.id, error });
            throw error;
        }
    }
    async generatePackageAnalysisSteps(request) {
        const steps = [];
        for (const target of request.targets) {
            // Package metadata extraction
            steps.push({
                id: `package-metadata-${target}`,
                type: 'package-metadata',
                dependencies: [],
                estimatedDuration: 100,
                resourceRequirements: { cpu: 0.1, memory: 50, disk: 10, network: true },
                canCache: true,
                priority: request.priority,
            });
            // Dependency resolution
            steps.push({
                id: `dependency-resolution-${target}`,
                type: 'dependency-resolution',
                dependencies: [`package-metadata-${target}`],
                estimatedDuration: 200,
                resourceRequirements: { cpu: 0.2, memory: 100, disk: 20, network: true },
                canCache: true,
                priority: request.priority,
            });
            // Size analysis
            steps.push({
                id: `size-analysis-${target}`,
                type: 'size-analysis',
                dependencies: [`dependency-resolution-${target}`],
                estimatedDuration: 150,
                resourceRequirements: { cpu: 0.1, memory: 75, disk: 15, network: false },
                canCache: true,
                priority: request.priority,
            });
        }
        return steps;
    }
    async generateVulnerabilitySteps(request) {
        const steps = [];
        for (const target of request.targets) {
            steps.push({
                id: `vulnerability-scan-${target}`,
                type: 'vulnerability-scan',
                dependencies: [],
                estimatedDuration: 500,
                resourceRequirements: { cpu: 0.3, memory: 200, disk: 50, network: true },
                canCache: true,
                priority: request.priority,
            });
        }
        return steps;
    }
    async generateLicenseSteps(request) {
        const steps = [];
        for (const target of request.targets) {
            steps.push({
                id: `license-analysis-${target}`,
                type: 'license-analysis',
                dependencies: [],
                estimatedDuration: 100,
                resourceRequirements: { cpu: 0.1, memory: 50, disk: 10, network: true },
                canCache: true,
                priority: request.priority,
            });
        }
        return steps;
    }
    async generateDependencyTreeSteps(request) {
        const steps = [];
        for (const target of request.targets) {
            steps.push({
                id: `dependency-tree-${target}`,
                type: 'dependency-tree',
                dependencies: [],
                estimatedDuration: 300,
                resourceRequirements: { cpu: 0.2, memory: 150, disk: 30, network: true },
                canCache: true,
                priority: request.priority,
            });
        }
        return steps;
    }
    async generateComprehensiveSteps(request) {
        const steps = [];
        // Combine all analysis types
        steps.push(...await this.generatePackageAnalysisSteps(request));
        steps.push(...await this.generateVulnerabilitySteps(request));
        steps.push(...await this.generateLicenseSteps(request));
        steps.push(...await this.generateDependencyTreeSteps(request));
        // Add aggregation step
        steps.push({
            id: `comprehensive-aggregation-${request.id}`,
            type: 'comprehensive-aggregation',
            dependencies: steps.map(step => step.id),
            estimatedDuration: 200,
            resourceRequirements: { cpu: 0.2, memory: 100, disk: 20, network: false },
            canCache: false,
            priority: request.priority,
        });
        return steps;
    }
    optimizeStepOrder(steps) {
        // Topological sort considering dependencies and resource optimization
        const sorted = [];
        const visited = new Set();
        const visiting = new Set();
        const stepMap = new Map();
        steps.forEach(step => stepMap.set(step.id, step));
        const visit = (stepId) => {
            if (visited.has(stepId))
                return;
            if (visiting.has(stepId)) {
                throw new Error(`Circular dependency detected: ${stepId}`);
            }
            visiting.add(stepId);
            const step = stepMap.get(stepId);
            if (step) {
                step.dependencies.forEach(depId => visit(depId));
                visited.add(stepId);
                visiting.delete(stepId);
                sorted.push(step);
            }
        };
        steps.forEach(step => visit(step.id));
        return sorted;
    }
    async executeAnalysisPlan(requestId, steps) {
        try {
            const stepResults = new Map();
            const completedSteps = new Set();
            for (const step of steps) {
                // Wait for dependencies
                for (const depId of step.dependencies) {
                    while (!completedSteps.has(depId)) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                // Check if result is cached
                let result = null;
                if (step.canCache) {
                    result = await this.cache.get(this.generateCacheKey(step));
                }
                if (!result) {
                    // Execute step
                    const task = {
                        id: step.id,
                        type: step.type,
                        data: { step, previousResults: stepResults },
                        priority: step.priority,
                        timeout: step.estimatedDuration * 2,
                    };
                    const taskResult = await this.processor.processTask(task);
                    if (taskResult.success) {
                        result = taskResult.result;
                        // Cache result if appropriate
                        if (step.canCache) {
                            await this.cache.set(this.generateCacheKey(step), result);
                        }
                    }
                    else {
                        throw taskResult.error || new Error(`Step ${step.id} failed`);
                    }
                }
                stepResults.set(step.id, result);
                completedSteps.add(step.id);
                // Update progress
                this.updateProgress(requestId, completedSteps.size, steps.length);
            }
            // Store final results
            this.requestResults.set(requestId, this.aggregateResults(stepResults));
            this.activeRequests.delete(requestId);
            this.emit('analysisCompleted', { requestId, results: stepResults });
            logger.info('Analysis completed', { requestId });
        }
        catch (error) {
            this.handleAnalysisError(requestId, error);
        }
    }
    updateProgress(requestId, completedSteps, totalSteps) {
        const progress = this.requestProgress.get(requestId);
        if (progress) {
            progress.completedSteps = completedSteps;
            progress.processingRate = completedSteps / totalSteps;
            const remainingSteps = totalSteps - completedSteps;
            const avgStepTime = progress.estimatedCompletion / totalSteps;
            progress.estimatedCompletion = remainingSteps * avgStepTime;
            this.emit('progressUpdate', progress);
        }
    }
    handleAnalysisError(requestId, error) {
        const progress = this.requestProgress.get(requestId);
        if (progress) {
            progress.errors.push({
                step: 'unknown',
                error,
                timestamp: Date.now(),
                severity: 'high',
                retryable: false,
            });
        }
        this.activeRequests.delete(requestId);
        this.emit('analysisError', { requestId, error });
        logger.error('Analysis failed', { requestId, error });
    }
    generateCacheKey(step) {
        return `analysis-step:${step.type}:${step.id}`;
    }
    aggregateResults(stepResults) {
        // Combine step results into final analysis result
        return {
            timestamp: Date.now(),
            steps: Object.fromEntries(stepResults),
            summary: this.generateAnalysisSummary(stepResults),
        };
    }
    generateAnalysisSummary(stepResults) {
        // Generate high-level summary from step results
        return {
            totalSteps: stepResults.size,
            processingTime: Date.now(), // This would be calculated properly
            cacheHitRate: 0.85, // This would be calculated from actual cache usage
        };
    }
    estimateCompletion(steps) {
        return steps.reduce((sum, step) => sum + step.estimatedDuration, 0);
    }
    generateRequestId() {
        return `analysis-${++this.requestIdCounter}-${Date.now()}`;
    }
    calculateAverageCompletionTime() {
        // Calculate from historical data
        return 5000; // Placeholder
    }
    calculateSuccessRate() {
        // Calculate from historical data
        return 0.95; // Placeholder
    }
    calculateCpuUtilization() {
        // Get from system metrics
        return 0.65; // Placeholder
    }
    calculateMemoryUtilization() {
        // Get current memory utilization
        return this.memoryOptimizer.getAvailableMemory() / 1024; // Convert to ratio
    }
    startProgressTracking() {
        this.progressInterval = setInterval(() => {
            // Update progress for all active requests
            for (const [requestId, progress] of this.requestProgress.entries()) {
                if (this.activeRequests.has(requestId)) {
                    this.emit('progressUpdate', progress);
                }
            }
        }, this.config.progressUpdateInterval);
    }
    startAdaptiveOptimization() {
        this.optimizationInterval = setInterval(() => {
            this.performAdaptiveOptimization();
        }, 30000); // Every 30 seconds
    }
    performAdaptiveOptimization() {
        // Analyze current performance and adjust parameters
        const metrics = this.getMetrics();
        if (metrics.resourceUtilization.memory > 0.9) {
            // Trigger memory optimization
            this.memoryOptimizer.forceGarbageCollection();
        }
        if (metrics.activeRequests > this.config.maxConcurrentRequests * 0.8) {
            // Consider scaling up resources
            logger.info('High load detected, consider scaling resources');
        }
    }
    /**
     * Cleanup resources
     */
    destroy() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        if (this.optimizationInterval) {
            clearInterval(this.optimizationInterval);
        }
        this.activeRequests.clear();
        this.requestProgress.clear();
        this.requestResults.clear();
        this.analysisPlans.clear();
        logger.info('Analysis coordinator destroyed');
    }
    /**
     * Execute streaming analysis for performance engine compatibility
     */
    async executeStreamingAnalysis(packages, _options, _plan) {
        // Placeholder implementation for performance engine integration
        return packages.map((pkg, index) => ({
            packageName: pkg.name || `package-${index}`,
            analysisTime: Math.random() * 100,
            success: true,
            results: { optimized: true },
        }));
    }
    /**
     * Execute batch analysis for performance engine compatibility
     */
    async executeBatchAnalysis(packages, _options, _plan) {
        // Placeholder implementation for performance engine integration
        return packages.map((pkg, index) => ({
            packageName: pkg.name || `package-${index}`,
            analysisTime: Math.random() * 50,
            success: true,
            results: { optimized: true, batched: true },
        }));
    }
    /**
     * Execute parallel analysis for performance engine compatibility
     */
    async executeParallelAnalysis(packages, _options, _plan) {
        // Placeholder implementation for performance engine integration
        return packages.map((pkg, index) => ({
            packageName: pkg.name || `package-${index}`,
            analysisTime: Math.random() * 25,
            success: true,
            results: { optimized: true, parallel: true },
        }));
    }
    /**
     * Execute hybrid analysis for performance engine compatibility
     */
    async executeHybridAnalysis(packages, _options, _plan) {
        // Placeholder implementation for performance engine integration  
        return packages.map((pkg, index) => ({
            packageName: pkg.name || `package-${index}`,
            analysisTime: Math.random() * 35,
            success: true,
            results: { optimized: true, hybrid: true },
        }));
    }
}
exports.AnalysisCoordinator = AnalysisCoordinator;
//# sourceMappingURL=analysis-coordinator.js.map