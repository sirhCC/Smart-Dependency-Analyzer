/**
 * Natural Language Processing Engine for Smart Dependency Analysis
 *
 * Provides advanced NLP capabilities for:
 * - License compliance analysis with natural language understanding
 * - Documentation quality assessment
 * - Threat intelligence extraction from security advisories
 * - Automated risk assessment from textual sources
 */
import { Package, Vulnerability } from '../../types';
export interface NLPConfig {
    /** Enable license text analysis */
    enableLicenseAnalysis: boolean;
    /** Enable documentation quality scoring */
    enableDocumentationAnalysis: boolean;
    /** Enable threat intelligence extraction */
    enableThreatIntelligence: boolean;
    /** Sentiment analysis threshold (-1 to 1) */
    sentimentThreshold: number;
    /** Language models to use */
    models: {
        licenseClassifier: string;
        sentimentAnalyzer: string;
        threatExtractor: string;
    };
}
export interface LicenseAnalysis {
    packageName: string;
    detectedLicenses: DetectedLicense[];
    complianceScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
    potentialConflicts: LicenseConflict[];
    commercialUsage: boolean;
    copyleftRequirements: string[];
}
export interface DetectedLicense {
    licenseName: string;
    confidence: number;
    licenseType: 'permissive' | 'copyleft' | 'proprietary' | 'unknown';
    commercialFriendly: boolean;
    requiresAttribution: boolean;
    requiresSourceDisclosure: boolean;
    textSnippet: string;
}
export interface LicenseConflict {
    license1: string;
    license2: string;
    conflictType: 'incompatible' | 'restrictive' | 'unclear';
    severity: 'low' | 'medium' | 'high';
    description: string;
    resolution: string[];
}
export interface DocumentationAnalysis {
    packageName: string;
    qualityScore: number;
    readabilityScore: number;
    completenessScore: number;
    maintainabilityIndicators: string[];
    missingElements: string[];
    recommendations: string[];
    keyTopics: ExtractedTopic[];
    sentiment: SentimentAnalysis;
}
export interface ExtractedTopic {
    topic: string;
    relevance: number;
    keywords: string[];
    summary: string;
}
export interface SentimentAnalysis {
    overall: number;
    confidence: number;
    aspects: AspectSentiment[];
    emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
}
export interface AspectSentiment {
    aspect: string;
    sentiment: number;
    confidence: number;
}
export interface ThreatIntelligence {
    source: string;
    extractedThreats: ExtractedThreat[];
    riskAssessment: RiskAssessment;
    indicators: ThreatIndicator[];
    mitigationStrategies: string[];
    severityDistribution: Record<string, number>;
}
export interface ExtractedThreat {
    id: string;
    type: 'vulnerability' | 'malware' | 'social-engineering' | 'supply-chain' | 'other';
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    affectedComponents: string[];
    indicators: string[];
    timeline: ThreatTimeline;
}
export interface ThreatTimeline {
    discovered: Date;
    disclosed: Date;
    patched?: Date;
    exploited?: Date;
}
export interface RiskAssessment {
    overallRisk: number;
    likelihood: number;
    impact: number;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
}
export interface ThreatIndicator {
    type: 'hash' | 'url' | 'ip' | 'domain' | 'pattern';
    value: string;
    confidence: number;
    context: string;
}
/**
 * Advanced NLP Engine for intelligent text analysis
 */
export declare class NLPEngine {
    private readonly config;
    private readonly licensePatterns;
    private readonly threatKeywords;
    private readonly qualityMetrics;
    constructor(config?: Partial<NLPConfig>);
    /**
     * Initialize the NLP engine
     */
    private initialize;
    /**
     * Analyze license compliance for packages
     */
    analyzeLicenseCompliance(packages: Package[]): Promise<LicenseAnalysis[]>;
    /**
     * Analyze documentation quality
     */
    analyzeDocumentationQuality(packages: Package[]): Promise<DocumentationAnalysis[]>;
    /**
     * Extract threat intelligence from vulnerability data
     */
    extractThreatIntelligence(vulnerabilities: Vulnerability[]): Promise<ThreatIntelligence>;
    private extractLicenseText;
    private detectLicenses;
    private findLicenseConflicts;
    private calculateComplianceScore;
    private assessLicenseRisk;
    private generateLicenseRecommendations;
    private assessCommercialUsage;
    private extractCopyleftRequirements;
    private extractDocumentation;
    private analyzeSentiment;
    private extractTopics;
    private calculateQualityScore;
    private calculateReadabilityScore;
    private calculateCompletenessScore;
    private extractMaintainabilityIndicators;
    private findMissingElements;
    private generateDocumentationRecommendations;
    private extractThreatFromVulnerability;
    private classifyThreatType;
    private extractThreatIndicators;
    private extractIndicators;
    private assessOverallRisk;
    private generateMitigationStrategies;
    private generateRiskRecommendations;
    private calculateSeverityDistribution;
    private getLicenseType;
    private isCommercialFriendly;
    private requiresAttribution;
    private requiresSourceDisclosure;
}
//# sourceMappingURL=nlp-engine.d.ts.map