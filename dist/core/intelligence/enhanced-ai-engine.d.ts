/**
 * Enhanced AI Engine with Advanced Malicious Pattern Detection
 *
 * This enhanced version incorporates proven manual detection patterns
 * to dramatically improve malicious package detection accuracy.
 */
import { Package } from '../../types';
import { AIConfig, VulnerabilityPrediction, SmartRecommendation, PredictiveAnalytics } from './ai-engine';
/**
 * Enhanced AI Engine with advanced malicious pattern detection
 */
export declare class EnhancedAIEngine {
    constructor(_config?: Partial<AIConfig>);
    /**
     * Enhanced vulnerability prediction with malicious pattern detection
     */
    predictVulnerabilities(packages: Package[]): Promise<VulnerabilityPrediction[]>;
    /**
     * Comprehensive threat analysis for a single package
     */
    private analyzePackageForThreats;
    /**
     * Analyze package scripts for malicious patterns
     */
    private analyzeScripts;
    /**
     * Analyze author and maintainer patterns for suspicious activity
     */
    private analyzeAuthors;
    /**
     * Check for typosquatting attacks
     */
    private analyzeTyposquatting;
    /**
     * Analyze package metadata for suspicious patterns
     */
    private analyzeMetadata;
    /**
     * Analyze dependencies for malicious injection patterns
     */
    private analyzeDependencies;
    /**
     * Original ML-based analysis (simplified for demonstration)
     */
    private performMLAnalysis;
    /**
     * Calculate Levenshtein distance between two strings
     */
    private levenshteinDistance;
    /**
     * Check for character substitution attacks (e.g., 'lodash' vs 'l0dash')
     */
    private hasCharacterSubstitution;
    /**
     * Generate enhanced recommendations with security focus
     */
    generateRecommendations(packages: Package[]): Promise<SmartRecommendation[]>;
    /**
     * Enhanced predictive analytics (simplified implementation)
     */
    performPredictiveAnalytics(packages: Package[]): Promise<PredictiveAnalytics>;
}
//# sourceMappingURL=enhanced-ai-engine.d.ts.map