/**
 * AI-Powered Intelligence Engine for Smart Dependency Analysis
 *
 * This module implements advanced machine learning capabilities:
 * - Vulnerability prediction using pattern recognition
 * - Smart dependency recommendations with compatibility scoring
 * - Risk assessment and threat intelligence
 * - Predictive analytics for dependency health
 */
import { EventEmitter } from 'events';
import { Package, Vulnerability, VulnerabilitySeverity } from '../../types';
export interface AIConfig {
    /** Enable vulnerability prediction models */
    enableVulnerabilityPrediction: boolean;
    /** Enable smart recommendations */
    enableSmartRecommendations: boolean;
    /** Enable predictive analytics */
    enablePredictiveAnalytics: boolean;
    /** Confidence threshold for predictions (0-1) */
    confidenceThreshold: number;
    /** Maximum recommendations to generate */
    maxRecommendations: number;
    /** Model update frequency in hours */
    modelUpdateFrequency: number;
    /** Training data retention period in days */
    trainingDataRetention: number;
}
export interface VulnerabilityPrediction {
    packageName: string;
    packageVersion: string;
    predictedSeverity: VulnerabilitySeverity;
    confidence: number;
    reasoningFactors: string[];
    estimatedTimeframe: number;
    preventiveMeasures: string[];
    riskScore: number;
}
export interface SmartRecommendation {
    type: 'alternative' | 'upgrade' | 'removal' | 'security-patch';
    currentPackage: string;
    recommendedAction: string;
    alternativePackages?: AlternativePackage[];
    confidence: number;
    benefits: string[];
    risks: string[];
    estimatedEffort: 'low' | 'medium' | 'high';
    priority: 'low' | 'medium' | 'high' | 'critical';
}
export interface AlternativePackage {
    name: string;
    version: string;
    compatibilityScore: number;
    securityScore: number;
    performanceScore: number;
    maintenanceScore: number;
    overallScore: number;
    migrationComplexity: 'trivial' | 'easy' | 'moderate' | 'complex' | 'difficult';
    breakingChanges: string[];
}
export interface PredictiveAnalytics {
    projectHealthScore: number;
    trendAnalysis: TrendAnalysis;
    riskFactors: RiskFactor[];
    recommendations: string[];
    futureVulnerabilities: VulnerabilityPrediction[];
    dependencyLifecycle: DependencyLifecycle[];
}
export interface TrendAnalysis {
    vulnerabilityTrend: 'improving' | 'stable' | 'degrading';
    maintenanceTrend: 'improving' | 'stable' | 'degrading';
    securityTrend: 'improving' | 'stable' | 'degrading';
    projectedScore6Months: number;
    projectedScore12Months: number;
}
export interface RiskFactor {
    factor: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: number;
    likelihood: number;
    description: string;
    mitigation: string[];
}
export interface DependencyLifecycle {
    packageName: string;
    currentPhase: 'growth' | 'maturity' | 'decline' | 'obsolete';
    estimatedEOL: Date | null;
    replacementSuggestions: string[];
    migrationUrgency: 'low' | 'medium' | 'high' | 'critical';
}
export interface TrainingData {
    packages: Package[];
    vulnerabilities: Vulnerability[];
    historicalData: HistoricalData[];
    userFeedback: UserFeedback[];
}
export interface HistoricalData {
    timestamp: Date;
    packageName: string;
    packageVersion: string;
    vulnerabilities: string[];
    downloads: number;
    issues: number;
    lastUpdate: Date;
    maintainerActivity: number;
}
export interface UserFeedback {
    recommendationId: string;
    accepted: boolean;
    rating: number;
    feedback: string;
    timestamp: Date;
}
export interface MLModelMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    lastTraining: Date;
    trainingDataSize: number;
    predictionLatency: number;
}
/**
 * Advanced AI Engine for intelligent dependency analysis
 */
export declare class AIEngine extends EventEmitter {
    private readonly config;
    private readonly trainingData;
    private readonly modelMetrics;
    private readonly predictionCache;
    private vulnerabilityModel;
    private recommendationModel;
    private analyticsModel;
    private trainingInterval?;
    private metricsInterval?;
    constructor(config?: Partial<AIConfig>);
    /**
     * Initialize the AI engine
     */
    private initialize;
    /**
     * Predict potential vulnerabilities for packages
     */
    predictVulnerabilities(packages: Package[]): Promise<VulnerabilityPrediction[]>;
    /**
     * Generate smart recommendations for dependency improvements with performance optimization
     */
    generateRecommendations(packages: Package[]): Promise<SmartRecommendation[]>;
    /**
     * Perform predictive analytics on project health
     */
    performPredictiveAnalytics(packages: Package[]): Promise<PredictiveAnalytics>;
    /**
     * Add training data from analysis results
     */
    addTrainingData(packages: Package[], vulnerabilities: Vulnerability[], feedback?: UserFeedback[]): Promise<void>;
    /**
     * Get AI engine metrics and model performance
     */
    getMetrics(): {
        modelMetrics: Record<string, MLModelMetrics>;
        trainingDataSize: {
            packages: number;
            vulnerabilities: number;
            historicalData: number;
            userFeedback: number;
        };
        predictionCacheSize: number;
        lastModelUpdate: Date | null;
    };
    /**
     * Retrain models with latest data
     */
    retrainModels(): Promise<void>;
    private loadTrainingData;
    private cleanupOldTrainingData;
    private startContinuousLearning;
    private startMetricsCollection;
    private getLastModelUpdate;
    /**
     * Cleanup resources
     */
    destroy(): void;
}
//# sourceMappingURL=ai-engine.d.ts.map