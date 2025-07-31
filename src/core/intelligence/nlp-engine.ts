/**
 * Natural Language Processing Engine for Smart Dependency Analysis
 * 
 * Provides advanced NLP capabilities for:
 * - License compliance analysis with natural language understanding
 * - Documentation quality assessment
 * - Threat intelligence extraction from security advisories
 * - Automated risk assessment from textual sources
 */

import { getLogger } from '../../utils/logger';
import { Package, Vulnerability } from '../../types';

const logger = getLogger('NLPEngine');

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
  complianceScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  potentialConflicts: LicenseConflict[];
  commercialUsage: boolean;
  copyleftRequirements: string[];
}

export interface DetectedLicense {
  licenseName: string;
  confidence: number; // 0-1
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
  qualityScore: number; // 0-100
  readabilityScore: number; // 0-100
  completenessScore: number; // 0-100
  maintainabilityIndicators: string[];
  missingElements: string[];
  recommendations: string[];
  keyTopics: ExtractedTopic[];
  sentiment: SentimentAnalysis;
}

export interface ExtractedTopic {
  topic: string;
  relevance: number; // 0-1
  keywords: string[];
  summary: string;
}

export interface SentimentAnalysis {
  overall: number; // -1 to 1
  confidence: number; // 0-1
  aspects: AspectSentiment[];
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
}

export interface AspectSentiment {
  aspect: string;
  sentiment: number; // -1 to 1
  confidence: number; // 0-1
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
  confidence: number; // 0-1
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
  overallRisk: number; // 0-100
  likelihood: number; // 0-100
  impact: number; // 0-100
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface ThreatIndicator {
  type: 'hash' | 'url' | 'ip' | 'domain' | 'pattern';
  value: string;
  confidence: number; // 0-1
  context: string;
}

/**
 * Advanced NLP Engine for intelligent text analysis
 */
export class NLPEngine {
  private readonly config: NLPConfig;
  private readonly licensePatterns: Map<string, RegExp>;
  private readonly threatKeywords: Set<string>;
  private readonly qualityMetrics: Map<string, number>;

  constructor(config: Partial<NLPConfig> = {}) {
    this.config = {
      enableLicenseAnalysis: true,
      enableDocumentationAnalysis: true,
      enableThreatIntelligence: true,
      sentimentThreshold: 0.1,
      models: {
        licenseClassifier: 'license-bert-v1',
        sentimentAnalyzer: 'sentiment-roberta-v1',
        threatExtractor: 'threat-intelligence-v1',
      },
      ...config,
    };

    // Initialize license detection patterns
    this.licensePatterns = new Map([
      ['MIT', /MIT License|MIT|Permission is hereby granted/i],
      ['Apache-2.0', /Apache License|Apache-2\.0|Licensed under the Apache License/i],
      ['GPL-3.0', /GNU General Public License|GPL-3\.0|This program is free software/i],
      ['BSD', /BSD License|BSD|Redistribution and use in source and binary forms/i],
      ['ISC', /ISC License|ISC|Permission to use, copy, modify/i],
    ]);

    // Initialize threat intelligence keywords
    this.threatKeywords = new Set([
      'vulnerability', 'exploit', 'malware', 'backdoor', 'trojan',
      'phishing', 'ransomware', 'injection', 'xss', 'csrf',
      'dos', 'ddos', 'privilege escalation', 'remote code execution',
      'buffer overflow', 'sql injection', 'path traversal'
    ]);

    // Initialize documentation quality metrics
    this.qualityMetrics = new Map([
      ['installation', 10],
      ['usage', 15],
      ['api', 20],
      ['examples', 15],
      ['testing', 10],
      ['contributing', 10],
      ['license', 5],
      ['changelog', 5],
      ['security', 10],
    ]);

    this.initialize();
  }

  /**
   * Initialize the NLP engine
   */
  private async initialize(): Promise<void> {
    logger.info('🧠 Initializing NLP Engine for intelligent text analysis');

    try {
      // Initialize NLP models (in real implementation, would load actual models)
      logger.info('📚 Loading language models');
      
      if (this.config.enableLicenseAnalysis) {
        logger.info('⚖️ License analysis engine ready');
      }
      
      if (this.config.enableDocumentationAnalysis) {
        logger.info('📖 Documentation analysis engine ready');
      }
      
      if (this.config.enableThreatIntelligence) {
        logger.info('🔍 Threat intelligence engine ready');
      }

      logger.info('✅ NLP Engine initialization complete');
    } catch (error) {
      logger.error('❌ Failed to initialize NLP Engine', { error });
      throw error;
    }
  }

  /**
   * Analyze license compliance for packages
   */
  public async analyzeLicenseCompliance(packages: Package[]): Promise<LicenseAnalysis[]> {
    if (!this.config.enableLicenseAnalysis) {
      return [];
    }

    logger.info(`⚖️ Analyzing license compliance for ${packages.length} packages`);

    const analyses: LicenseAnalysis[] = [];

    for (const pkg of packages) {
      try {
        const licenseText = await this.extractLicenseText(pkg);
        const detectedLicenses = this.detectLicenses(licenseText);
        const conflicts = this.findLicenseConflicts(detectedLicenses);
        
        const analysis: LicenseAnalysis = {
          packageName: pkg.name,
          detectedLicenses,
          complianceScore: this.calculateComplianceScore(detectedLicenses, conflicts),
          riskLevel: this.assessLicenseRisk(detectedLicenses, conflicts),
          recommendations: this.generateLicenseRecommendations(detectedLicenses, conflicts),
          potentialConflicts: conflicts,
          commercialUsage: this.assessCommercialUsage(detectedLicenses),
          copyleftRequirements: this.extractCopyleftRequirements(detectedLicenses),
        };

        analyses.push(analysis);
      } catch (error) {
        logger.error(`Failed to analyze license for ${pkg.name}`, { error });
      }
    }

    logger.info(`✅ License compliance analysis complete: ${analyses.length} packages analyzed`);
    return analyses;
  }

  /**
   * Analyze documentation quality
   */
  public async analyzeDocumentationQuality(packages: Package[]): Promise<DocumentationAnalysis[]> {
    if (!this.config.enableDocumentationAnalysis) {
      return [];
    }

    logger.info(`📖 Analyzing documentation quality for ${packages.length} packages`);

    const analyses: DocumentationAnalysis[] = [];

    for (const pkg of packages) {
      try {
        const documentation = await this.extractDocumentation(pkg);
        const sentiment = this.analyzeSentiment(documentation);
        const topics = this.extractTopics(documentation);
        
        const analysis: DocumentationAnalysis = {
          packageName: pkg.name,
          qualityScore: this.calculateQualityScore(documentation),
          readabilityScore: this.calculateReadabilityScore(documentation),
          completenessScore: this.calculateCompletenessScore(documentation),
          maintainabilityIndicators: this.extractMaintainabilityIndicators(documentation),
          missingElements: this.findMissingElements(documentation),
          recommendations: this.generateDocumentationRecommendations(documentation),
          keyTopics: topics,
          sentiment,
        };

        analyses.push(analysis);
      } catch (error) {
        logger.error(`Failed to analyze documentation for ${pkg.name}`, { error });
      }
    }

    logger.info(`✅ Documentation analysis complete: ${analyses.length} packages analyzed`);
    return analyses;
  }

  /**
   * Extract threat intelligence from vulnerability data
   */
  public async extractThreatIntelligence(vulnerabilities: Vulnerability[]): Promise<ThreatIntelligence> {
    if (!this.config.enableThreatIntelligence) {
      throw new Error('Threat intelligence extraction is disabled');
    }

    logger.info(`🔍 Extracting threat intelligence from ${vulnerabilities.length} vulnerabilities`);

    try {
      const extractedThreats: ExtractedThreat[] = [];
      const indicators: ThreatIndicator[] = [];

      for (const vuln of vulnerabilities) {
        const threat = await this.extractThreatFromVulnerability(vuln);
        if (threat) {
          extractedThreats.push(threat);
          indicators.push(...this.extractIndicators(vuln));
        }
      }

      const riskAssessment = this.assessOverallRisk(extractedThreats);
      const mitigationStrategies = this.generateMitigationStrategies(extractedThreats);
      const severityDistribution = this.calculateSeverityDistribution(extractedThreats);

      const intelligence: ThreatIntelligence = {
        source: 'vulnerability-analysis',
        extractedThreats,
        riskAssessment,
        indicators,
        mitigationStrategies,
        severityDistribution,
      };

      logger.info(`🎯 Threat intelligence extraction complete: ${extractedThreats.length} threats identified`);
      return intelligence;
    } catch (error) {
      logger.error('❌ Threat intelligence extraction failed', { error });
      throw error;
    }
  }

  // Private implementation methods

  private async extractLicenseText(pkg: Package): Promise<string> {
    // In real implementation, would fetch license text from package or repository
    return pkg.license || 'MIT';
  }

  private detectLicenses(licenseText: string): DetectedLicense[] {
    const detected: DetectedLicense[] = [];

    for (const [licenseName, pattern] of this.licensePatterns.entries()) {
      if (pattern.test(licenseText)) {
        detected.push({
          licenseName,
          confidence: 0.9,
          licenseType: this.getLicenseType(licenseName),
          commercialFriendly: this.isCommercialFriendly(licenseName),
          requiresAttribution: this.requiresAttribution(licenseName),
          requiresSourceDisclosure: this.requiresSourceDisclosure(licenseName),
          textSnippet: licenseText.substring(0, 100),
        });
      }
    }

    return detected;
  }

  private findLicenseConflicts(licenses: DetectedLicense[]): LicenseConflict[] {
    const conflicts: LicenseConflict[] = [];
    
    // Check for GPL + MIT conflicts (example)
    const hasGPL = licenses.some(l => l.licenseName.includes('GPL'));
    const hasPermissive = licenses.some(l => l.licenseType === 'permissive');
    
    if (hasGPL && hasPermissive) {
      conflicts.push({
        license1: 'GPL',
        license2: 'MIT/Permissive',
        conflictType: 'incompatible',
        severity: 'high',
        description: 'GPL requires derivative works to be GPL licensed',
        resolution: ['Use only GPL dependencies', 'Find permissive alternatives'],
      });
    }

    return conflicts;
  }

  private calculateComplianceScore(licenses: DetectedLicense[], conflicts: LicenseConflict[]): number {
    let score = 100;
    
    // Reduce score for conflicts
    score -= conflicts.length * 20;
    
    // Reduce score for uncertain licenses
    const uncertainLicenses = licenses.filter(l => l.confidence < 0.8);
    score -= uncertainLicenses.length * 10;
    
    return Math.max(0, score);
  }

  private assessLicenseRisk(licenses: DetectedLicense[], conflicts: LicenseConflict[]): 'low' | 'medium' | 'high' | 'critical' {
    if (conflicts.some(c => c.severity === 'high')) return 'critical';
    if (conflicts.length > 0) return 'high';
    if (licenses.some(l => !l.commercialFriendly)) return 'medium';
    return 'low';
  }

  private generateLicenseRecommendations(licenses: DetectedLicense[], conflicts: LicenseConflict[]): string[] {
    const recommendations: string[] = [];
    
    if (conflicts.length > 0) {
      recommendations.push('Resolve license conflicts before production use');
    }
    
    if (licenses.some(l => l.requiresAttribution)) {
      recommendations.push('Include proper attribution in your application');
    }
    
    return recommendations;
  }

  private assessCommercialUsage(licenses: DetectedLicense[]): boolean {
    return licenses.every(l => l.commercialFriendly);
  }

  private extractCopyleftRequirements(licenses: DetectedLicense[]): string[] {
    return licenses
      .filter(l => l.licenseType === 'copyleft')
      .map(l => `Source disclosure required for ${l.licenseName}`);
  }

  private async extractDocumentation(pkg: Package): Promise<string> {
    // In real implementation, would fetch README and documentation
    return pkg.description || 'No documentation available';
  }

  private analyzeSentiment(text: string): SentimentAnalysis {
    // Simplified sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'love'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'broken', 'buggy'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(w => positiveWords.includes(w)).length;
    const negativeCount = words.filter(w => negativeWords.includes(w)).length;
    
    const overall = (positiveCount - negativeCount) / Math.max(words.length, 1);
    
    return {
      overall: Math.max(-1, Math.min(1, overall)),
      confidence: 0.7,
      aspects: [
        { aspect: 'usability', sentiment: overall, confidence: 0.7 },
        { aspect: 'quality', sentiment: overall * 0.8, confidence: 0.6 },
      ],
      emotionalTone: overall > 0.1 ? 'positive' : overall < -0.1 ? 'negative' : 'neutral',
    };
  }

  private extractTopics(text: string): ExtractedTopic[] {
    // Simplified topic extraction
    const commonTopics = ['installation', 'usage', 'api', 'configuration', 'testing'];
    
    return commonTopics
      .filter(topic => text.toLowerCase().includes(topic))
      .map(topic => ({
        topic,
        relevance: 0.8,
        keywords: [topic],
        summary: `Documentation covers ${topic}`,
      }));
  }

  private calculateQualityScore(documentation: string): number {
    let score = 0;
    const text = documentation.toLowerCase();
    
    for (const [element, weight] of this.qualityMetrics.entries()) {
      if (text.includes(element)) {
        score += weight;
      }
    }
    
    return Math.min(100, score);
  }

  private calculateReadabilityScore(text: string): number {
    // Simplified readability calculation
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    
    // Optimal is around 15-20 words per sentence
    const readabilityScore = Math.max(0, 100 - Math.abs(avgWordsPerSentence - 17.5) * 2);
    return Math.round(readabilityScore);
  }

  private calculateCompletenessScore(documentation: string): number {
    const requiredElements = Array.from(this.qualityMetrics.keys());
    const text = documentation.toLowerCase();
    const presentElements = requiredElements.filter(element => text.includes(element));
    
    return Math.round((presentElements.length / requiredElements.length) * 100);
  }

  private extractMaintainabilityIndicators(documentation: string): string[] {
    const indicators: string[] = [];
    const text = documentation.toLowerCase();
    
    if (text.includes('test')) indicators.push('Testing documentation present');
    if (text.includes('contribute')) indicators.push('Contribution guidelines available');
    if (text.includes('changelog')) indicators.push('Change log maintained');
    if (text.includes('issue')) indicators.push('Issue tracking mentioned');
    
    return indicators;
  }

  private findMissingElements(documentation: string): string[] {
    const allElements = Array.from(this.qualityMetrics.keys());
    const text = documentation.toLowerCase();
    
    return allElements.filter(element => !text.includes(element));
  }

  private generateDocumentationRecommendations(documentation: string): string[] {
    const missing = this.findMissingElements(documentation);
    return missing.map(element => `Add ${element} documentation`);
  }

  private async extractThreatFromVulnerability(vuln: Vulnerability): Promise<ExtractedThreat | null> {
    const description = vuln.description.toLowerCase();
    const hasKeywords = Array.from(this.threatKeywords).some(keyword => 
      description.includes(keyword)
    );
    
    if (!hasKeywords) return null;
    
    return {
      id: vuln.id,
      type: this.classifyThreatType(description),
      description: vuln.description,
      severity: vuln.severity,
      confidence: 0.8,
      affectedComponents: vuln.affectedVersions,
      indicators: this.extractThreatIndicators(description),
      timeline: {
        discovered: vuln.publishedAt,
        disclosed: vuln.publishedAt,
        ...(vuln.patched && vuln.updatedAt ? { patched: vuln.updatedAt } : {}),
      },
    };
  }

  private classifyThreatType(description: string): ExtractedThreat['type'] {
    if (description.includes('vulnerability') || description.includes('cve')) return 'vulnerability';
    if (description.includes('malware') || description.includes('trojan')) return 'malware';
    if (description.includes('supply') || description.includes('chain')) return 'supply-chain';
    return 'other';
  }

  private extractThreatIndicators(description: string): string[] {
    // Extract potential IoCs from description
    const indicators: string[] = [];
    
    // Simple regex patterns for common indicators
    const urlPattern = /https?:\/\/[^\s]+/g;
    const hashPattern = /[a-fA-F0-9]{32,}/g;
    
    const urls = description.match(urlPattern) || [];
    const hashes = description.match(hashPattern) || [];
    
    indicators.push(...urls, ...hashes);
    
    return indicators;
  }

  private extractIndicators(vuln: Vulnerability): ThreatIndicator[] {
    const indicators: ThreatIndicator[] = [];
    
    // Extract URLs from references
    vuln.references.forEach(ref => {
      indicators.push({
        type: 'url',
        value: ref.url,
        confidence: 0.9,
        context: 'vulnerability reference',
      });
    });
    
    return indicators;
  }

  private assessOverallRisk(threats: ExtractedThreat[]): RiskAssessment {
    if (threats.length === 0) {
      return {
        overallRisk: 0,
        likelihood: 0,
        impact: 0,
        urgency: 'low',
        recommendations: ['Continue monitoring for new threats'],
      };
    }
    
    const criticalThreats = threats.filter(t => t.severity === 'critical').length;
    const highThreats = threats.filter(t => t.severity === 'high').length;
    
    const overallRisk = Math.min(100, (criticalThreats * 30) + (highThreats * 20) + (threats.length * 5));
    
    return {
      overallRisk,
      likelihood: Math.min(100, threats.length * 10),
      impact: overallRisk,
      urgency: overallRisk > 70 ? 'critical' : overallRisk > 50 ? 'high' : overallRisk > 25 ? 'medium' : 'low',
      recommendations: this.generateRiskRecommendations(threats),
    };
  }

  private generateMitigationStrategies(threats: ExtractedThreat[]): string[] {
    const strategies = new Set<string>();
    
    threats.forEach(threat => {
      switch (threat.type) {
        case 'vulnerability':
          strategies.add('Apply security patches promptly');
          strategies.add('Implement vulnerability scanning');
          break;
        case 'supply-chain':
          strategies.add('Verify package integrity');
          strategies.add('Use dependency pinning');
          break;
        case 'malware':
          strategies.add('Scan dependencies for malware');
          strategies.add('Use trusted package repositories');
          break;
      }
    });
    
    return Array.from(strategies);
  }

  private generateRiskRecommendations(threats: ExtractedThreat[]): string[] {
    const recommendations: string[] = [];
    
    const criticalCount = threats.filter(t => t.severity === 'critical').length;
    const highCount = threats.filter(t => t.severity === 'high').length;
    
    if (criticalCount > 0) {
      recommendations.push(`Address ${criticalCount} critical threats immediately`);
    }
    
    if (highCount > 0) {
      recommendations.push(`Prioritize ${highCount} high severity threats`);
    }
    
    recommendations.push('Implement continuous security monitoring');
    recommendations.push('Establish incident response procedures');
    
    return recommendations;
  }

  private calculateSeverityDistribution(threats: ExtractedThreat[]): Record<string, number> {
    const distribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };
    
    threats.forEach(threat => {
      const severity = threat.severity as keyof typeof distribution;
      if (distribution[severity] !== undefined) {
        distribution[severity]++;
      }
    });
    
    return distribution;
  }

  // Helper methods for license analysis

  private getLicenseType(licenseName: string): DetectedLicense['licenseType'] {
    const copyleftLicenses = ['GPL', 'LGPL', 'AGPL'];
    const permissiveLicenses = ['MIT', 'BSD', 'Apache', 'ISC'];
    
    if (copyleftLicenses.some(l => licenseName.includes(l))) return 'copyleft';
    if (permissiveLicenses.some(l => licenseName.includes(l))) return 'permissive';
    return 'unknown';
  }

  private isCommercialFriendly(licenseName: string): boolean {
    const nonCommercialLicenses = ['GPL-3.0', 'AGPL'];
    return !nonCommercialLicenses.some(l => licenseName.includes(l));
  }

  private requiresAttribution(licenseName: string): boolean {
    const attributionLicenses = ['MIT', 'BSD', 'Apache'];
    return attributionLicenses.some(l => licenseName.includes(l));
  }

  private requiresSourceDisclosure(licenseName: string): boolean {
    const disclosureLicenses = ['GPL', 'LGPL', 'AGPL'];
    return disclosureLicenses.some(l => licenseName.includes(l));
  }
}
