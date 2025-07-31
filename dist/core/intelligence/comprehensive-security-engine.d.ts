/**
 * Comprehensive Security Detection Engine
 *
 * World-class AI that detects ALL known attack vectors including:
 * - Unicode homograph attacks
 * - Version confusion
 * - Brand jacking
 * - Dependency confusion
 * - Social engineering
 * - Subdomain takeover
 * - Supply chain injection
 * - Steganography
 * - Maintainer compromise
 * - And many more...
 */
import { Package } from '../../types';
import { AIConfig, VulnerabilityPrediction, SmartRecommendation, PredictiveAnalytics } from './ai-engine';
/**
 * Comprehensive Security Detection Engine with full attack vector coverage
 */
export declare class ComprehensiveSecurityEngine {
    private readonly popularPackages;
    private readonly suspiciousTlds;
    private readonly brandNames;
    private readonly temporaryEmailDomains;
    constructor(_config?: Partial<AIConfig>);
    /**
     * Comprehensive vulnerability prediction with all attack vector detection
     */
    predictVulnerabilities(packages: Package[]): Promise<VulnerabilityPrediction[]>;
    /**
     * Comprehensive threat analysis covering all attack vectors
     */
    private performComprehensiveAnalysis;
    /**
     * 1. Unicode Homograph Attack Detection
     */
    private detectUnicodeHomographs;
    /**
     * 2. Version Confusion Attack Detection
     */
    private detectVersionConfusion;
    /**
     * 3. Brand Jacking Detection
     */
    private detectBrandJacking;
    /**
     * 4. Dependency Confusion Detection
     */
    private detectDependencyConfusion;
    /**
     * 5. Social Engineering Detection
     */
    private detectSocialEngineering;
    /**
     * 6. Subdomain Takeover Detection
     */
    private detectSubdomainTakeover;
    /**
     * 7. Supply Chain Injection Detection
     */
    private detectSupplyChainInjection;
    /**
     * 8. Steganography Detection
     */
    private detectSteganography;
    /**
     * 9. Maintainer Compromise Detection
     */
    private detectMaintainerCompromise;
    /**
     * 10. Advanced Typosquatting Detection
     */
    private detectAdvancedTyposquatting;
    /**
     * 11. Script-based Attack Detection (Enhanced)
     */
    private detectScriptAttacks;
    /**
     * 12. Behavioral Anomaly Detection
     */
    private detectBehavioralAnomalies;
    private normalizeUnicode;
    private levenshteinDistance;
    private hasCharacterSubstitution;
    private hasAdditionRemovalAttack;
    private hasSeparatorConfusion;
    /**
     * Generate comprehensive security recommendations
     */
    generateRecommendations(packages: Package[]): Promise<SmartRecommendation[]>;
    /**
     * Comprehensive predictive analytics
     */
    performPredictiveAnalytics(packages: Package[]): Promise<PredictiveAnalytics>;
}
//# sourceMappingURL=comprehensive-security-engine.d.ts.map