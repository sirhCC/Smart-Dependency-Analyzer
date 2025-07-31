/**
 * Machine Learning Model Training Infrastructure
 *
 * Provides comprehensive ML training capabilities for:
 * - Vulnerability prediction models
 * - Maintenance forecasting models
 * - Performance prediction models
 * - Natural language processing models
 * - Ensemble model combinations
 */
import { Package, Vulnerability } from '../../types';
export interface TrainingConfig {
    /** Enable model training */
    enableTraining: boolean;
    /** Training data sources */
    dataSources: DataSource[];
    /** Model configurations */
    models: ModelConfig[];
    /** Training parameters */
    trainingParams: TrainingParameters;
    /** Validation settings */
    validation: ValidationConfig;
    /** Output settings */
    output: OutputConfig;
}
export interface DataSource {
    name: string;
    type: 'vulnerability' | 'maintenance' | 'performance' | 'ecosystem';
    format: 'json' | 'csv' | 'sql' | 'api';
    connection: string;
    refreshInterval: number;
    preprocessing: PreprocessingConfig;
}
export interface PreprocessingConfig {
    normalization: boolean;
    standardization: boolean;
    outlierRemoval: boolean;
    missingValueStrategy: 'drop' | 'mean' | 'median' | 'forward-fill';
    featureScaling: 'min-max' | 'z-score' | 'robust' | 'none';
    categoricalEncoding: 'one-hot' | 'label' | 'target' | 'embedding';
}
export interface ModelConfig {
    name: string;
    type: 'neural-network' | 'random-forest' | 'gradient-boost' | 'transformer' | 'ensemble';
    target: 'vulnerability' | 'maintenance' | 'performance' | 'nlp';
    architecture: ModelArchitecture;
    hyperparameters: Record<string, any>;
    features: FeatureConfig[];
}
export interface ModelArchitecture {
    layers?: LayerConfig[];
    inputDimension?: number;
    outputDimension?: number;
    hiddenUnits?: number[];
    dropoutRate?: number;
    activationFunction?: string;
    optimizer?: string;
    learningRate?: number;
}
export interface LayerConfig {
    type: 'dense' | 'lstm' | 'conv1d' | 'attention' | 'dropout';
    units?: number;
    activation?: string;
    dropout?: number;
    kernelSize?: number;
    filters?: number;
}
export interface FeatureConfig {
    name: string;
    type: 'categorical' | 'numerical' | 'text' | 'temporal';
    source: string;
    transformation: 'normalize' | 'standardize' | 'encode' | 'embed' | 'none';
    importance: number;
}
export interface TrainingParameters {
    epochs: number;
    batchSize: number;
    validationSplit: number;
    earlyStopping: EarlyStoppingConfig;
    learningRateSchedule: LearningRateConfig;
    regularization: RegularizationConfig;
}
export interface EarlyStoppingConfig {
    enabled: boolean;
    patience: number;
    monitor: string;
    minDelta: number;
    restoreBestWeights: boolean;
}
export interface LearningRateConfig {
    type: 'constant' | 'exponential' | 'step' | 'cosine';
    initialRate: number;
    decayRate?: number;
    decaySteps?: number;
}
export interface RegularizationConfig {
    l1: number;
    l2: number;
    dropout: number;
    batchNormalization: boolean;
}
export interface ValidationConfig {
    strategy: 'holdout' | 'cross-validation' | 'time-series-split';
    testSize: number;
    folds?: number;
    shuffle: boolean;
    stratify: boolean;
    metrics: string[];
}
export interface OutputConfig {
    modelPath: string;
    saveFormat: 'tensorflow' | 'pytorch' | 'onnx' | 'json';
    exportMetrics: boolean;
    generateReport: boolean;
    deploymentReady: boolean;
}
export interface TrainingResult {
    modelId: string;
    modelName: string;
    trainingMetrics: TrainingMetrics;
    validationMetrics: ValidationMetrics;
    featureImportance: FeatureImportance[];
    modelPath: string;
    trainingTime: number;
    memoryUsage: number;
    status: 'success' | 'failed' | 'stopped';
    error?: string;
}
export interface TrainingMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    roc_auc: number;
    loss: number;
    trainingHistory: MetricHistory[];
}
export interface ValidationMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    roc_auc: number;
    loss: number;
    confusionMatrix: number[][];
    classificationReport: ClassificationReport;
}
export interface MetricHistory {
    epoch: number;
    loss: number;
    accuracy: number;
    valLoss: number;
    valAccuracy: number;
    learningRate: number;
}
export interface ClassificationReport {
    classes: string[];
    precision: Record<string, number>;
    recall: Record<string, number>;
    f1Score: Record<string, number>;
    support: Record<string, number>;
}
export interface FeatureImportance {
    feature: string;
    importance: number;
    rank: number;
    description: string;
}
export interface TrainingDataset {
    name: string;
    features: any[][];
    labels: any[];
    metadata: DatasetMetadata;
    splits: DataSplit;
}
export interface DatasetMetadata {
    totalSamples: number;
    featureCount: number;
    classDistribution: Record<string, number>;
    missingValues: Record<string, number>;
    dataTypes: Record<string, string>;
    timeRange?: DateRange;
}
export interface DateRange {
    start: Date;
    end: Date;
}
export interface DataSplit {
    train: TrainingSample[];
    validation: TrainingSample[];
    test: TrainingSample[];
}
export interface TrainingSample {
    features: any[];
    label: any;
    weight?: number;
    metadata?: Record<string, any>;
}
export interface ModelEvaluation {
    modelId: string;
    performance: PerformanceMetrics;
    predictions: PredictionResult[];
    benchmark: BenchmarkComparison;
    deployment: DeploymentReadiness;
}
export interface PerformanceMetrics {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    prAuc: number;
    mse?: number;
    mae?: number;
    rmse?: number;
}
export interface PredictionResult {
    input: any[];
    prediction: any;
    confidence: number;
    actualValue?: any;
    correct?: boolean;
}
export interface BenchmarkComparison {
    baselineModel: string;
    improvementPercent: number;
    performanceGains: Record<string, number>;
    comparisonMetrics: ComparisonMetric[];
}
export interface ComparisonMetric {
    metric: string;
    ourModel: number;
    baseline: number;
    improvement: number;
    significance: number;
}
export interface DeploymentReadiness {
    score: number;
    requirements: DeploymentRequirement[];
    optimizations: OptimizationSuggestion[];
    estimatedLatency: number;
    memoryFootprint: number;
}
export interface DeploymentRequirement {
    requirement: string;
    status: 'met' | 'not-met' | 'partial';
    description: string;
    actionItems: string[];
}
export interface OptimizationSuggestion {
    type: 'quantization' | 'pruning' | 'distillation' | 'caching';
    description: string;
    expectedGain: string;
    effort: 'low' | 'medium' | 'high';
}
/**
 * Advanced ML Training Engine
 */
export declare class MLTrainingEngine {
    private readonly config;
    private readonly dataLoaders;
    private readonly modelBuilders;
    private readonly trainers;
    private readonly evaluators;
    constructor(config?: Partial<TrainingConfig>);
    /**
     * Initialize the training engine
     */
    private initialize;
    /**
     * Train vulnerability prediction models
     */
    trainVulnerabilityModels(packages: Package[], vulnerabilities: Vulnerability[]): Promise<TrainingResult[]>;
    /**
     * Train maintenance prediction models
     */
    trainMaintenanceModels(packages: Package[]): Promise<TrainingResult[]>;
    /**
     * Train performance prediction models
     */
    trainPerformanceModels(packages: Package[]): Promise<TrainingResult[]>;
    /**
     * Evaluate trained models
     */
    evaluateModels(modelIds: string[]): Promise<ModelEvaluation[]>;
    /**
     * Generate comprehensive training report
     */
    generateTrainingReport(results: TrainingResult[]): Promise<string>;
    private initializeDataLoaders;
    private initializeModelBuilders;
    private initializeTrainers;
    private initializeEvaluators;
    private prepareVulnerabilityDataset;
    private prepareMaintenanceDataset;
    private preparePerformanceDataset;
    private trainModel;
    private generateModelId;
    private getEmptyMetrics;
    private getEmptyValidationMetrics;
}
//# sourceMappingURL=ml-training.d.ts.map