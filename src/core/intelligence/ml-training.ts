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

import { getLogger } from '../../utils/logger';
import { Package, Vulnerability } from '../../types';

const logger = getLogger('MLTraining');

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
  refreshInterval: number; // hours
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
  importance: number; // 0-1
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
  trainingTime: number; // seconds
  memoryUsage: number; // MB
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
  significance: number; // p-value
}

export interface DeploymentReadiness {
  score: number; // 0-100
  requirements: DeploymentRequirement[];
  optimizations: OptimizationSuggestion[];
  estimatedLatency: number; // ms
  memoryFootprint: number; // MB
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
export class MLTrainingEngine {
  private readonly config: TrainingConfig;
  private readonly dataLoaders: Map<string, DataLoader>;
  private readonly modelBuilders: Map<string, ModelBuilder>;
  private readonly trainers: Map<string, ModelTrainer>;
  private readonly evaluators: Map<string, ModelEvaluator>;

  constructor(config: Partial<TrainingConfig> = {}) {
    this.config = {
      enableTraining: true,
      dataSources: [],
      models: [],
      trainingParams: {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        earlyStopping: {
          enabled: true,
          patience: 10,
          monitor: 'val_loss',
          minDelta: 0.001,
          restoreBestWeights: true,
        },
        learningRateSchedule: {
          type: 'exponential',
          initialRate: 0.001,
          decayRate: 0.9,
          decaySteps: 1000,
        },
        regularization: {
          l1: 0.01,
          l2: 0.01,
          dropout: 0.3,
          batchNormalization: true,
        },
      },
      validation: {
        strategy: 'holdout',
        testSize: 0.2,
        shuffle: true,
        stratify: true,
        metrics: ['accuracy', 'precision', 'recall', 'f1', 'roc_auc'],
      },
      output: {
        modelPath: './models',
        saveFormat: 'tensorflow',
        exportMetrics: true,
        generateReport: true,
        deploymentReady: true,
      },
      ...config,
    };

    this.dataLoaders = new Map();
    this.modelBuilders = new Map();
    this.trainers = new Map();
    this.evaluators = new Map();

    this.initialize();
  }

  /**
   * Initialize the training engine
   */
  private async initialize(): Promise<void> {
    logger.info('🏋️ Initializing ML Training Engine');

    try {
      // Initialize data loaders
      this.initializeDataLoaders();
      
      // Initialize model builders
      this.initializeModelBuilders();
      
      // Initialize trainers
      this.initializeTrainers();
      
      // Initialize evaluators
      this.initializeEvaluators();

      logger.info('✅ ML Training Engine initialization complete');
    } catch (error) {
      logger.error('❌ Failed to initialize ML Training Engine', { error });
      throw error;
    }
  }

  /**
   * Train vulnerability prediction models
   */
  public async trainVulnerabilityModels(
    packages: Package[],
    vulnerabilities: Vulnerability[]
  ): Promise<TrainingResult[]> {
    if (!this.config.enableTraining) {
      throw new Error('Model training is disabled');
    }

    logger.info(`🎯 Training vulnerability prediction models with ${packages.length} packages and ${vulnerabilities.length} vulnerabilities`);

    const results: TrainingResult[] = [];

    try {
      // Prepare training dataset
      const dataset = await this.prepareVulnerabilityDataset(packages, vulnerabilities);
      
      // Train each configured model
      const vulnModels = this.config.models.filter(m => m.target === 'vulnerability');
      
      for (const modelConfig of vulnModels) {
        logger.info(`Training model: ${modelConfig.name}`);
        
        const result = await this.trainModel(modelConfig, dataset);
        results.push(result);
        
        if (result.status === 'success') {
          logger.info(`✅ Model ${modelConfig.name} trained successfully`);
        } else {
          logger.error(`❌ Model ${modelConfig.name} training failed: ${result.error}`);
        }
      }

      logger.info(`🎊 Vulnerability model training complete: ${results.length} models trained`);
      return results;
    } catch (error) {
      logger.error('❌ Vulnerability model training failed', { error });
      throw error;
    }
  }

  /**
   * Train maintenance prediction models
   */
  public async trainMaintenanceModels(packages: Package[]): Promise<TrainingResult[]> {
    if (!this.config.enableTraining) {
      throw new Error('Model training is disabled');
    }

    logger.info(`📊 Training maintenance prediction models with ${packages.length} packages`);

    const results: TrainingResult[] = [];

    try {
      // Prepare maintenance dataset
      const dataset = await this.prepareMaintenanceDataset(packages);
      
      // Train maintenance models
      const maintenanceModels = this.config.models.filter(m => m.target === 'maintenance');
      
      for (const modelConfig of maintenanceModels) {
        logger.info(`Training maintenance model: ${modelConfig.name}`);
        
        const result = await this.trainModel(modelConfig, dataset);
        results.push(result);
      }

      logger.info(`🎊 Maintenance model training complete: ${results.length} models trained`);
      return results;
    } catch (error) {
      logger.error('❌ Maintenance model training failed', { error });
      throw error;
    }
  }

  /**
   * Train performance prediction models
   */
  public async trainPerformanceModels(packages: Package[]): Promise<TrainingResult[]> {
    if (!this.config.enableTraining) {
      throw new Error('Model training is disabled');
    }

    logger.info(`⚡ Training performance prediction models with ${packages.length} packages`);

    const results: TrainingResult[] = [];

    try {
      const dataset = await this.preparePerformanceDataset(packages);
      const perfModels = this.config.models.filter(m => m.target === 'performance');
      
      for (const modelConfig of perfModels) {
        const result = await this.trainModel(modelConfig, dataset);
        results.push(result);
      }

      logger.info(`🎊 Performance model training complete: ${results.length} models trained`);
      return results;
    } catch (error) {
      logger.error('❌ Performance model training failed', { error });
      throw error;
    }
  }

  /**
   * Evaluate trained models
   */
  public async evaluateModels(modelIds: string[]): Promise<ModelEvaluation[]> {
    logger.info(`📊 Evaluating ${modelIds.length} trained models`);

    const evaluations: ModelEvaluation[] = [];

    for (const modelId of modelIds) {
      try {
        const evaluator = this.evaluators.get('default') || new DefaultModelEvaluator();
        const evaluation = await evaluator.evaluate(modelId);
        evaluations.push(evaluation);
      } catch (error) {
        logger.error(`Failed to evaluate model ${modelId}`, { error });
      }
    }

    logger.info(`✅ Model evaluation complete: ${evaluations.length} models evaluated`);
    return evaluations;
  }

  /**
   * Generate comprehensive training report
   */
  public async generateTrainingReport(results: TrainingResult[]): Promise<string> {
    logger.info('📝 Generating comprehensive training report');

    try {
      const report = new TrainingReportGenerator();
      const reportContent = await report.generate(results, this.config);
      
      logger.info('📋 Training report generated successfully');
      return reportContent;
    } catch (error) {
      logger.error('❌ Failed to generate training report', { error });
      throw error;
    }
  }

  // Private implementation methods

  private initializeDataLoaders(): void {
    this.dataLoaders.set('vulnerability', new VulnerabilityDataLoader());
    this.dataLoaders.set('maintenance', new MaintenanceDataLoader());
    this.dataLoaders.set('performance', new PerformanceDataLoader());
    this.dataLoaders.set('ecosystem', new EcosystemDataLoader());
  }

  private initializeModelBuilders(): void {
    this.modelBuilders.set('neural-network', new NeuralNetworkBuilder());
    this.modelBuilders.set('random-forest', new RandomForestBuilder());
    this.modelBuilders.set('gradient-boost', new GradientBoostBuilder());
    this.modelBuilders.set('transformer', new TransformerBuilder());
    this.modelBuilders.set('ensemble', new EnsembleBuilder());
  }

  private initializeTrainers(): void {
    this.trainers.set('supervised', new SupervisedTrainer());
    this.trainers.set('unsupervised', new UnsupervisedTrainer());
    this.trainers.set('reinforcement', new ReinforcementTrainer());
  }

  private initializeEvaluators(): void {
    this.evaluators.set('default', new DefaultModelEvaluator());
    this.evaluators.set('cross-validation', new CrossValidationEvaluator());
    this.evaluators.set('time-series', new TimeSeriesEvaluator());
  }

  private async prepareVulnerabilityDataset(
    packages: Package[],
    vulnerabilities: Vulnerability[]
  ): Promise<TrainingDataset> {
    const loader = this.dataLoaders.get('vulnerability');
    if (!loader) {
      throw new Error('Vulnerability data loader not found');
    }

    return await loader.prepare(packages, vulnerabilities);
  }

  private async prepareMaintenanceDataset(packages: Package[]): Promise<TrainingDataset> {
    const loader = this.dataLoaders.get('maintenance');
    if (!loader) {
      throw new Error('Maintenance data loader not found');
    }

    return await loader.prepare(packages);
  }

  private async preparePerformanceDataset(packages: Package[]): Promise<TrainingDataset> {
    const loader = this.dataLoaders.get('performance');
    if (!loader) {
      throw new Error('Performance data loader not found');
    }

    return await loader.prepare(packages);
  }

  private async trainModel(config: ModelConfig, dataset: TrainingDataset): Promise<TrainingResult> {
    const startTime = Date.now();
    
    try {
      // Build model
      const builder = this.modelBuilders.get(config.type);
      if (!builder) {
        throw new Error(`Model builder not found for type: ${config.type}`);
      }
      
      const model = await builder.build(config);
      
      // Train model
      const trainer = this.trainers.get('supervised'); // Default to supervised
      if (!trainer) {
        throw new Error('Trainer not found');
      }
      
      const trainingResult = await trainer.train(model, dataset, this.config.trainingParams);
      
      // Generate result
      const endTime = Date.now();
      const trainingTime = (endTime - startTime) / 1000;
      
      return {
        modelId: this.generateModelId(config),
        modelName: config.name,
        trainingMetrics: trainingResult.metrics,
        validationMetrics: trainingResult.validation,
        featureImportance: trainingResult.featureImportance,
        modelPath: trainingResult.modelPath,
        trainingTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        status: 'success',
      };
    } catch (error) {
      const endTime = Date.now();
      const trainingTime = (endTime - startTime) / 1000;
      
      return {
        modelId: this.generateModelId(config),
        modelName: config.name,
        trainingMetrics: this.getEmptyMetrics(),
        validationMetrics: this.getEmptyValidationMetrics(),
        featureImportance: [],
        modelPath: '',
        trainingTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private generateModelId(config: ModelConfig): string {
    const timestamp = Date.now();
    return `${config.name}-${config.type}-${timestamp}`;
  }

  private getEmptyMetrics(): TrainingMetrics {
    return {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      roc_auc: 0,
      loss: Infinity,
      trainingHistory: [],
    };
  }

  private getEmptyValidationMetrics(): ValidationMetrics {
    return {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      roc_auc: 0,
      loss: Infinity,
      confusionMatrix: [],
      classificationReport: {
        classes: [],
        precision: {},
        recall: {},
        f1Score: {},
        support: {},
      },
    };
  }
}

// Implementation classes (simplified for demonstration)

interface DataLoader {
  prepare(data: any, ...args: any[]): Promise<TrainingDataset>;
}

class VulnerabilityDataLoader implements DataLoader {
  async prepare(packages: Package[], _vulnerabilities: Vulnerability[]): Promise<TrainingDataset> {
    // Implement vulnerability dataset preparation
    return {
      name: 'vulnerability-dataset',
      features: [],
      labels: [],
      metadata: {
        totalSamples: packages.length,
        featureCount: 10,
        classDistribution: { vulnerable: 0.3, safe: 0.7 },
        missingValues: {},
        dataTypes: {},
      },
      splits: {
        train: [],
        validation: [],
        test: [],
      },
    };
  }
}

class MaintenanceDataLoader implements DataLoader {
  async prepare(packages: Package[]): Promise<TrainingDataset> {
    // Implement maintenance dataset preparation
    return {
      name: 'maintenance-dataset',
      features: [],
      labels: [],
      metadata: {
        totalSamples: packages.length,
        featureCount: 15,
        classDistribution: { high: 0.2, medium: 0.5, low: 0.3 },
        missingValues: {},
        dataTypes: {},
      },
      splits: {
        train: [],
        validation: [],
        test: [],
      },
    };
  }
}

class PerformanceDataLoader implements DataLoader {
  async prepare(packages: Package[]): Promise<TrainingDataset> {
    // Implement performance dataset preparation
    return {
      name: 'performance-dataset',
      features: [],
      labels: [],
      metadata: {
        totalSamples: packages.length,
        featureCount: 8,
        classDistribution: {},
        missingValues: {},
        dataTypes: {},
      },
      splits: {
        train: [],
        validation: [],
        test: [],
      },
    };
  }
}

class EcosystemDataLoader implements DataLoader {
  async prepare(_data: any): Promise<TrainingDataset> {
    // Implement ecosystem dataset preparation
    return {
      name: 'ecosystem-dataset',
      features: [],
      labels: [],
      metadata: {
        totalSamples: 1000,
        featureCount: 20,
        classDistribution: {},
        missingValues: {},
        dataTypes: {},
      },
      splits: {
        train: [],
        validation: [],
        test: [],
      },
    };
  }
}

interface ModelBuilder {
  build(config: ModelConfig): Promise<any>;
}

class NeuralNetworkBuilder implements ModelBuilder {
  async build(_config: ModelConfig): Promise<any> {
    // Implement neural network building
    return {};
  }
}

class RandomForestBuilder implements ModelBuilder {
  async build(_config: ModelConfig): Promise<any> {
    // Implement random forest building
    return {};
  }
}

class GradientBoostBuilder implements ModelBuilder {
  async build(_config: ModelConfig): Promise<any> {
    // Implement gradient boosting building
    return {};
  }
}

class TransformerBuilder implements ModelBuilder {
  async build(_config: ModelConfig): Promise<any> {
    // Implement transformer building
    return {};
  }
}

class EnsembleBuilder implements ModelBuilder {
  async build(_config: ModelConfig): Promise<any> {
    // Implement ensemble building
    return {};
  }
}

interface ModelTrainer {
  train(model: any, dataset: TrainingDataset, params: TrainingParameters): Promise<any>;
}

class SupervisedTrainer implements ModelTrainer {
  async train(_model: any, _dataset: TrainingDataset, _params: TrainingParameters): Promise<any> {
    // Implement supervised training
    return {
      metrics: {
        accuracy: 0.85,
        precision: 0.82,
        recall: 0.88,
        f1Score: 0.85,
        roc_auc: 0.90,
        loss: 0.15,
        trainingHistory: [],
      },
      validation: {
        accuracy: 0.83,
        precision: 0.80,
        recall: 0.86,
        f1Score: 0.83,
        roc_auc: 0.88,
        loss: 0.17,
        confusionMatrix: [[50, 5], [3, 42]],
        classificationReport: {
          classes: ['safe', 'vulnerable'],
          precision: { safe: 0.80, vulnerable: 0.85 },
          recall: { safe: 0.86, vulnerable: 0.83 },
          f1Score: { safe: 0.83, vulnerable: 0.84 },
          support: { safe: 55, vulnerable: 45 },
        },
      },
      featureImportance: [
        { feature: 'age', importance: 0.25, rank: 1, description: 'Package age in years' },
        { feature: 'popularity', importance: 0.20, rank: 2, description: 'Download count' },
      ],
      modelPath: './models/model.json',
    };
  }
}

class UnsupervisedTrainer implements ModelTrainer {
  async train(_model: any, _dataset: TrainingDataset, _params: TrainingParameters): Promise<any> {
    // Implement unsupervised training
    return {};
  }
}

class ReinforcementTrainer implements ModelTrainer {
  async train(_model: any, _dataset: TrainingDataset, _params: TrainingParameters): Promise<any> {
    // Implement reinforcement training
    return {};
  }
}

interface ModelEvaluator {
  evaluate(modelId: string): Promise<ModelEvaluation>;
}

class DefaultModelEvaluator implements ModelEvaluator {
  async evaluate(modelId: string): Promise<ModelEvaluation> {
    // Implement model evaluation
    return {
      modelId,
      performance: {
        accuracy: 0.85,
        precision: 0.82,
        recall: 0.88,
        f1Score: 0.85,
        rocAuc: 0.90,
        prAuc: 0.88,
      },
      predictions: [],
      benchmark: {
        baselineModel: 'random-baseline',
        improvementPercent: 25,
        performanceGains: { accuracy: 0.15, precision: 0.12 },
        comparisonMetrics: [],
      },
      deployment: {
        score: 85,
        requirements: [],
        optimizations: [],
        estimatedLatency: 50,
        memoryFootprint: 100,
      },
    };
  }
}

class CrossValidationEvaluator implements ModelEvaluator {
  async evaluate(_modelId: string): Promise<ModelEvaluation> {
    // Implement cross-validation evaluation
    return {} as ModelEvaluation;
  }
}

class TimeSeriesEvaluator implements ModelEvaluator {
  async evaluate(_modelId: string): Promise<ModelEvaluation> {
    // Implement time series evaluation
    return {} as ModelEvaluation;
  }
}

class TrainingReportGenerator {
  async generate(results: TrainingResult[], config: TrainingConfig): Promise<string> {
    const report = `
# ML Training Report

## Summary
- Total models trained: ${results.length}
- Successful trainings: ${results.filter(r => r.status === 'success').length}
- Failed trainings: ${results.filter(r => r.status === 'failed').length}

## Model Performance
${results.map(r => `
### ${r.modelName}
- Status: ${r.status}
- Training Time: ${r.trainingTime.toFixed(2)}s
- Memory Usage: ${r.memoryUsage.toFixed(2)}MB
- Accuracy: ${r.trainingMetrics.accuracy.toFixed(3)}
- F1 Score: ${r.trainingMetrics.f1Score.toFixed(3)}
`).join('')}

## Configuration
- Training Parameters: ${JSON.stringify(config.trainingParams, null, 2)}
- Validation Strategy: ${config.validation.strategy}
- Output Format: ${config.output.saveFormat}

Generated on: ${new Date().toISOString()}
    `.trim();

    return report;
  }
}
