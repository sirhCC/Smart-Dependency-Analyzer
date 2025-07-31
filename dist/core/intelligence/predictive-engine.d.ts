/**
 * Predictive Analytics Engine for Smart Dependency Analysis
 *
 * Provides advanced predictive capabilities for:
 * - Future vulnerability prediction using ML models
 * - Maintenance burden forecasting
 * - License risk progression analysis
 * - Dependency ecosystem health predictions
 * - Performance impact predictions
 */
import { Package } from '../../types';
export interface PredictiveConfig {
    /** Enable vulnerability prediction */
    enableVulnerabilityPrediction: boolean;
    /** Enable maintenance forecasting */
    enableMaintenanceForecasting: boolean;
    /** Enable ecosystem health prediction */
    enableEcosystemPrediction: boolean;
    /** Prediction time horizon in days */
    predictionHorizonDays: number;
    /** Confidence threshold for predictions */
    confidenceThreshold: number;
    /** Models configuration */
    models: {
        vulnerabilityPredictor: string;
        maintenancePredictor: string;
        ecosystemPredictor: string;
        performancePredictor: string;
    };
}
export interface VulnerabilityPrediction {
    packageName: string;
    packageVersion: string;
    predictions: VulnerabilityForecast[];
    overallRiskScore: number;
    timeHorizon: number;
    confidence: number;
    riskFactors: RiskFactor[];
    recommendedActions: PredictiveRecommendation[];
}
export interface VulnerabilityForecast {
    timeFrame: string;
    probability: number;
    expectedSeverity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    riskDrivers: string[];
    mitigationWindow: number;
}
export interface RiskFactor {
    factor: string;
    impact: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    description: string;
    dataPoints: HistoricalDataPoint[];
}
export interface HistoricalDataPoint {
    timestamp: Date;
    value: number;
    context?: string;
}
export interface PredictiveRecommendation {
    action: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    timeline: string;
    rationale: string;
    expectedImpact: string;
    confidence: number;
}
export interface MaintenanceForecast {
    packageName: string;
    currentMaintenanceScore: number;
    predictions: MaintenancePrediction[];
    sustainabilityOutlook: 'excellent' | 'good' | 'concerning' | 'critical';
    keyMetrics: MaintenanceMetric[];
    recommendations: MaintenanceRecommendation[];
}
export interface MaintenancePrediction {
    timeFrame: string;
    maintenanceScore: number;
    activityLevel: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
    riskIndicators: MaintenanceRisk[];
    confidence: number;
}
export interface MaintenanceMetric {
    metric: string;
    currentValue: number;
    predictedValue: number;
    trend: 'improving' | 'stable' | 'declining';
    significance: 'low' | 'medium' | 'high';
}
export interface MaintenanceRisk {
    risk: string;
    probability: number;
    impact: string;
    timeframe: string;
}
export interface MaintenanceRecommendation {
    action: string;
    timeframe: string;
    rationale: string;
    alternatives: string[];
}
export interface EcosystemHealthPrediction {
    ecosystem: string;
    healthScore: number;
    predictions: EcosystemForecast[];
    emergingTrends: EmergingTrend[];
    riskAreas: EcosystemRisk[];
    opportunities: EcosystemOpportunity[];
}
export interface EcosystemForecast {
    timeFrame: string;
    healthScore: number;
    growthRate: number;
    securityTrend: 'improving' | 'stable' | 'declining';
    qualityTrend: 'improving' | 'stable' | 'declining';
    confidence: number;
}
export interface EmergingTrend {
    name: string;
    description: string;
    impactLevel: 'low' | 'medium' | 'high';
    timeToMass: string;
    relevanceScore: number;
    keyIndicators: string[];
}
export interface EcosystemRisk {
    riskType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    probability: number;
    affectedPackages: number;
    mitigationStrategies: string[];
}
export interface EcosystemOpportunity {
    type: string;
    description: string;
    potentialImpact: string;
    timeframe: string;
    actionItems: string[];
}
export interface PerformancePrediction {
    packageName: string;
    currentPerformance: PerformanceMetrics;
    predictions: PerformanceForecast[];
    bottlenecks: PredictedBottleneck[];
    optimizations: PerformanceOptimization[];
}
export interface PerformanceMetrics {
    loadTime: number;
    memoryUsage: number;
    cpuUsage: number;
    bundleSize: number;
    dependencies: number;
}
export interface PerformanceForecast {
    timeFrame: string;
    metrics: PerformanceMetrics;
    degradationRisk: number;
    confidence: number;
}
export interface PredictedBottleneck {
    area: string;
    probability: number;
    impact: 'low' | 'medium' | 'high' | 'severe';
    description: string;
    preventionStrategies: string[];
}
export interface PerformanceOptimization {
    optimization: string;
    expectedGain: string;
    effort: 'low' | 'medium' | 'high';
    priority: number;
}
/**
 * Advanced Predictive Analytics Engine
 */
export declare class PredictiveEngine {
    private readonly config;
    private readonly historicalData;
    private readonly modelCache;
    private readonly trendAnalyzer;
    constructor(config?: Partial<PredictiveConfig>);
    /**
     * Initialize the predictive engine
     */
    private initialize;
    /**
     * Predict future vulnerabilities for packages
     */
    predictVulnerabilities(packages: Package[]): Promise<VulnerabilityPrediction[]>;
    /**
     * Forecast maintenance burden and sustainability
     */
    forecastMaintenance(packages: Package[]): Promise<MaintenanceForecast[]>;
    /**
     * Predict ecosystem health and trends
     */
    predictEcosystemHealth(ecosystem: string): Promise<EcosystemHealthPrediction>;
    /**
     * Predict performance impact and bottlenecks
     */
    predictPerformance(packages: Package[]): Promise<PerformancePrediction[]>;
    private loadHistoricalData;
    private loadPredictiveModels;
    private getHistoricalVulnerabilities;
    private analyzeRiskFactors;
    private generateVulnerabilityForecasts;
    private calculateOverallRisk;
    private calculatePredictionConfidence;
    private generateVulnerabilityRecommendations;
    private calculateCurrentMaintenanceScore;
    private generateMaintenancePredictions;
    private analyzeMaintenanceMetrics;
    private assessSustainabilityOutlook;
    private generateMaintenanceRecommendations;
    private calculateEcosystemHealth;
    private generateEcosystemForecasts;
    private identifyEmergingTrends;
    private assessEcosystemRisks;
    private identifyEcosystemOpportunities;
    private measureCurrentPerformance;
    private generatePerformanceForecasts;
    private predictBottlenecks;
    private suggestOptimizations;
    private calculatePackageAge;
    private estimatePackagePopularity;
    private estimatePackageComplexity;
    private parseTimeFrameDays;
    private calculateVulnerabilityProbability;
    private predictSeverity;
    private daysSinceLastUpdate;
    private calculateUpdateFrequency;
    private predictActivityLevel;
    private generateMaintenanceRisks;
}
//# sourceMappingURL=predictive-engine.d.ts.map