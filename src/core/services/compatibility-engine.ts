/**
 * License Compatibility Engine
 * Advanced license compatibility analysis with legal intelligence
 */

import type { Package } from '../../types';
import type { 
  License, 
  CompatibilityAnalysis, 
  CompatibilityReport, 
  LicenseAnalysis,
  LicenseObligation,
  LicenseScanOptions 
} from '../../types/license';
import { 
  LicenseCategory, 
  CompatibilityLevel, 
  LegalRiskLevel 
} from '../../types/license';
import { getLicenseDatabase } from './license-database';
import { logger } from '../../utils/logger';

/**
 * License compatibility matrix defining relationships between license types
 */
const COMPATIBILITY_MATRIX: Record<string, Record<string, CompatibilityLevel>> = {
  // MIT compatibility
  'MIT': {
    'MIT': CompatibilityLevel.COMPATIBLE,
    'Apache-2.0': CompatibilityLevel.COMPATIBLE,
    'BSD-3-Clause': CompatibilityLevel.COMPATIBLE,
    'BSD-2-Clause': CompatibilityLevel.COMPATIBLE,
    'ISC': CompatibilityLevel.COMPATIBLE,
    'GPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'GPL-2.0-only': CompatibilityLevel.COMPATIBLE,
    'LGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'LGPL-2.1-only': CompatibilityLevel.COMPATIBLE,
    'MPL-2.0': CompatibilityLevel.COMPATIBLE,
    'EPL-2.0': CompatibilityLevel.COMPATIBLE,
    'AGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'CC0-1.0': CompatibilityLevel.COMPATIBLE,
    'UNLICENSED': CompatibilityLevel.INCOMPATIBLE,
    'CC-BY-NC-4.0': CompatibilityLevel.INCOMPATIBLE
  },
  
  // Apache 2.0 compatibility
  'Apache-2.0': {
    'MIT': CompatibilityLevel.COMPATIBLE,
    'Apache-2.0': CompatibilityLevel.COMPATIBLE,
    'BSD-3-Clause': CompatibilityLevel.COMPATIBLE,
    'BSD-2-Clause': CompatibilityLevel.COMPATIBLE,
    'GPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'GPL-2.0-only': CompatibilityLevel.INCOMPATIBLE, // Patent clause incompatibility
    'LGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'LGPL-2.1-only': CompatibilityLevel.CONDITIONALLY_COMPATIBLE,
    'MPL-2.0': CompatibilityLevel.COMPATIBLE,
    'EPL-2.0': CompatibilityLevel.CONDITIONALLY_COMPATIBLE,
    'AGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'UNLICENSED': CompatibilityLevel.INCOMPATIBLE
  },
  
  // GPL 3.0 compatibility
  'GPL-3.0-only': {
    'MIT': CompatibilityLevel.COMPATIBLE,
    'Apache-2.0': CompatibilityLevel.COMPATIBLE,
    'BSD-3-Clause': CompatibilityLevel.COMPATIBLE,
    'BSD-2-Clause': CompatibilityLevel.COMPATIBLE,
    'GPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'GPL-2.0-only': CompatibilityLevel.INCOMPATIBLE, // Version incompatibility
    'LGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'LGPL-2.1-only': CompatibilityLevel.COMPATIBLE,
    'MPL-2.0': CompatibilityLevel.COMPATIBLE,
    'EPL-2.0': CompatibilityLevel.INCOMPATIBLE,
    'AGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'UNLICENSED': CompatibilityLevel.INCOMPATIBLE,
    'CC-BY-NC-4.0': CompatibilityLevel.INCOMPATIBLE
  },
  
  // GPL 2.0 compatibility
  'GPL-2.0-only': {
    'MIT': CompatibilityLevel.COMPATIBLE,
    'Apache-2.0': CompatibilityLevel.INCOMPATIBLE,
    'BSD-3-Clause': CompatibilityLevel.COMPATIBLE,
    'BSD-2-Clause': CompatibilityLevel.COMPATIBLE,
    'GPL-2.0-only': CompatibilityLevel.COMPATIBLE,
    'GPL-3.0-only': CompatibilityLevel.INCOMPATIBLE,
    'LGPL-2.1-only': CompatibilityLevel.COMPATIBLE,
    'LGPL-3.0-only': CompatibilityLevel.INCOMPATIBLE,
    'MPL-2.0': CompatibilityLevel.INCOMPATIBLE,
    'EPL-2.0': CompatibilityLevel.INCOMPATIBLE,
    'UNLICENSED': CompatibilityLevel.INCOMPATIBLE
  },
  
  // LGPL compatibility (more permissive than GPL)
  'LGPL-3.0-only': {
    'MIT': CompatibilityLevel.COMPATIBLE,
    'Apache-2.0': CompatibilityLevel.COMPATIBLE,
    'BSD-3-Clause': CompatibilityLevel.COMPATIBLE,
    'GPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'GPL-2.0-only': CompatibilityLevel.INCOMPATIBLE,
    'LGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'LGPL-2.1-only': CompatibilityLevel.COMPATIBLE,
    'MPL-2.0': CompatibilityLevel.COMPATIBLE,
    'UNLICENSED': CompatibilityLevel.INCOMPATIBLE
  },
  
  // MPL 2.0 compatibility
  'MPL-2.0': {
    'MIT': CompatibilityLevel.COMPATIBLE,
    'Apache-2.0': CompatibilityLevel.COMPATIBLE,
    'BSD-3-Clause': CompatibilityLevel.COMPATIBLE,
    'GPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'GPL-2.0-only': CompatibilityLevel.INCOMPATIBLE,
    'LGPL-3.0-only': CompatibilityLevel.COMPATIBLE,
    'MPL-2.0': CompatibilityLevel.COMPATIBLE,
    'EPL-2.0': CompatibilityLevel.CONDITIONALLY_COMPATIBLE,
    'UNLICENSED': CompatibilityLevel.INCOMPATIBLE
  },
  
  // Proprietary/UNLICENSED
  'UNLICENSED': {
    'MIT': CompatibilityLevel.INCOMPATIBLE,
    'Apache-2.0': CompatibilityLevel.INCOMPATIBLE,
    'GPL-3.0-only': CompatibilityLevel.INCOMPATIBLE,
    'GPL-2.0-only': CompatibilityLevel.INCOMPATIBLE,
    'UNLICENSED': CompatibilityLevel.REQUIRES_REVIEW
  }
};

/**
 * Advanced license compatibility engine
 */
export class CompatibilityEngine {
  private licenseDb = getLicenseDatabase();

  /**
   * Analyze compatibility between two licenses
   */
  public async checkCompatibility(
    license1: License, 
    license2: License
  ): Promise<CompatibilityAnalysis> {
    logger.info(`🔍 Checking compatibility: ${license1.spdxId} vs ${license2.spdxId}`);

    const compatibility = this.getCompatibilityLevel(license1.spdxId, license2.spdxId);
    const explanation = this.generateExplanation(license1, license2, compatibility);
    const conditions = this.getCompatibilityConditions(license1, license2, compatibility);
    const warnings = this.getCompatibilityWarnings(license1, license2, compatibility);
    const recommendations = this.getCompatibilityRecommendations(license1, license2, compatibility);
    const riskLevel = this.assessCompatibilityRisk(license1, license2, compatibility);

    return {
      license1,
      license2,
      compatibility,
      explanation,
      ...(conditions && { conditions }),
      ...(warnings && { warnings }),
      ...(recommendations && { recommendations }),
      riskLevel
    };
  }

  /**
   * Generate comprehensive compatibility report for a project
   */
  public async generateCompatibilityReport(
    packages: Package[],
    licenseAnalyses: LicenseAnalysis[],
    options: LicenseScanOptions = this.getDefaultOptions()
  ): Promise<CompatibilityReport> {
    const startTime = Date.now();
    logger.info(`🔍 Generating compatibility report for ${packages.length} packages`);

    try {
      // Extract all unique licenses
      const allLicenses = this.extractUniqueLicenses(licenseAnalyses);
      
      // Build compatibility matrix
      const compatibilityMatrix = await this.buildCompatibilityMatrix(allLicenses);
      
      // Analyze overall compatibility
      const overallCompatibility = this.determineOverallCompatibility(compatibilityMatrix);
      
      // Find the highest risk level
      const highestRiskLevel = this.findHighestRiskLevel(compatibilityMatrix);
      
      // Identify conflicts
      const conflicts = this.identifyConflicts(allLicenses, compatibilityMatrix);
      
      // Calculate project obligations
      const projectObligations = this.calculateProjectObligations(licenseAnalyses);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(conflicts, allLicenses, options);
      
      // Calculate summary statistics
      const summary = this.calculateSummaryStatistics(packages, licenseAnalyses, compatibilityMatrix);

      // Determine project license if specified
      const projectLicense = packages[0]?.license ? this.licenseDb.getLicense(packages[0].license) : undefined;

      const scanDuration = Date.now() - startTime;
      
      const report: CompatibilityReport = {
        project: {
          name: packages[0]?.name || 'Unknown Project',
          ...(packages[0]?.version && { version: packages[0].version }),
          ...(projectLicense && { license: projectLicense })
        },
        allLicenses,
        compatibilityMatrix,
        overallCompatibility,
        highestRiskLevel,
        conflicts,
        projectObligations,
        recommendations,
        summary
      };

      logger.info(`✅ Compatibility report generated in ${scanDuration}ms`);
      return report;

    } catch (error) {
      logger.error('Compatibility analysis failed:', error);
      throw new Error(`Compatibility analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get compatibility level between two licenses
   */
  private getCompatibilityLevel(spdxId1: string, spdxId2: string): CompatibilityLevel {
    // Check direct compatibility
    const direct = COMPATIBILITY_MATRIX[spdxId1]?.[spdxId2];
    if (direct) return direct;

    // Check reverse compatibility
    const reverse = COMPATIBILITY_MATRIX[spdxId2]?.[spdxId1];
    if (reverse) return reverse;

    // Fallback to category-based compatibility
    const license1 = this.licenseDb.getLicense(spdxId1);
    const license2 = this.licenseDb.getLicense(spdxId2);

    if (!license1 || !license2) return CompatibilityLevel.UNKNOWN;

    return this.getCategoryCompatibility(license1.category, license2.category);
  }

  /**
   * Get compatibility based on license categories
   */
  private getCategoryCompatibility(
    category1: LicenseCategory, 
    category2: LicenseCategory
  ): CompatibilityLevel {
    // Permissive licenses are generally compatible with everything
    if (category1 === LicenseCategory.PERMISSIVE || category2 === LicenseCategory.PERMISSIVE) {
      if (category1 === LicenseCategory.PROPRIETARY || category2 === LicenseCategory.PROPRIETARY) {
        return CompatibilityLevel.INCOMPATIBLE;
      }
      return CompatibilityLevel.COMPATIBLE;
    }

    // Copyleft compatibility
    if (category1 === LicenseCategory.COPYLEFT && category2 === LicenseCategory.COPYLEFT) {
      return CompatibilityLevel.REQUIRES_REVIEW; // Same copyleft might be compatible
    }

    if (category1 === LicenseCategory.COPYLEFT || category2 === LicenseCategory.COPYLEFT) {
      return CompatibilityLevel.CONDITIONALLY_COMPATIBLE;
    }

    // Proprietary licenses
    if (category1 === LicenseCategory.PROPRIETARY || category2 === LicenseCategory.PROPRIETARY) {
      return CompatibilityLevel.INCOMPATIBLE;
    }

    // Public domain is compatible with everything
    if (category1 === LicenseCategory.PUBLIC_DOMAIN || category2 === LicenseCategory.PUBLIC_DOMAIN) {
      return CompatibilityLevel.COMPATIBLE;
    }

    // Default case
    return CompatibilityLevel.REQUIRES_REVIEW;
  }

  /**
   * Generate human-readable explanation of compatibility
   */
  private generateExplanation(
    license1: License, 
    license2: License, 
    compatibility: CompatibilityLevel
  ): string {
    const l1Name = license1.name;
    const l2Name = license2.name;

    switch (compatibility) {
      case CompatibilityLevel.COMPATIBLE:
        return `${l1Name} and ${l2Name} are fully compatible and can be used together without restrictions.`;
      
      case CompatibilityLevel.CONDITIONALLY_COMPATIBLE:
        return `${l1Name} and ${l2Name} can be used together under certain conditions. Review the specific terms and obligations.`;
      
      case CompatibilityLevel.INCOMPATIBLE:
        return `${l1Name} and ${l2Name} are incompatible and cannot be legally combined in the same project.`;
      
      case CompatibilityLevel.REQUIRES_REVIEW:
        return `The compatibility between ${l1Name} and ${l2Name} requires legal review to determine if they can be used together.`;
      
      case CompatibilityLevel.UNKNOWN:
        return `The compatibility between ${l1Name} and ${l2Name} cannot be determined automatically. Legal review is recommended.`;
      
      default:
        return `Compatibility status unknown between ${l1Name} and ${l2Name}.`;
    }
  }

  /**
   * Get compatibility conditions for compatibility
   */
  private getCompatibilityConditions(
    license1: License, 
    license2: License, 
    compatibility: CompatibilityLevel
  ): string[] | undefined {
    if (compatibility !== CompatibilityLevel.CONDITIONALLY_COMPATIBLE) return undefined;

    const conditions: string[] = [];

    // Check for copyleft obligations
    if (license1.category === LicenseCategory.COPYLEFT || license2.category === LicenseCategory.COPYLEFT) {
      conditions.push('Must comply with copyleft obligations of the stricter license');
      conditions.push('May need to release entire work under compatible copyleft license');
    }

    // Check for attribution requirements
    if (license1.obligations.includes('attribution' as any) || license2.obligations.includes('attribution' as any)) {
      conditions.push('Must include proper attribution for both licenses');
    }

    // Check for source disclosure requirements
    if (license1.requiresSourceDisclosure || license2.requiresSourceDisclosure) {
      conditions.push('Must make source code available if distributing');
    }

    return conditions.length > 0 ? conditions : undefined;
  }

  /**
   * Get compatibility warnings
   */
  private getCompatibilityWarnings(
    license1: License, 
    license2: License, 
    compatibility: CompatibilityLevel
  ): string[] | undefined {
    const warnings: string[] = [];

    if (compatibility === CompatibilityLevel.INCOMPATIBLE) {
      warnings.push('These licenses cannot be legally combined');
      warnings.push('Consider removing one of the dependencies or finding alternatives');
    }

    if (compatibility === CompatibilityLevel.REQUIRES_REVIEW) {
      warnings.push('Legal review is strongly recommended before proceeding');
      warnings.push('Document the legal analysis and decision rationale');
    }

    // Check for specific license warnings
    if (license1.spdxId === 'GPL-2.0-only' && license2.spdxId === 'Apache-2.0') {
      warnings.push('GPL-2.0 and Apache-2.0 have known patent clause incompatibilities');
    }

    if (license1.spdxId.includes('AGPL') || license2.spdxId.includes('AGPL')) {
      warnings.push('AGPL has network copyleft implications for web services');
    }

    return warnings.length > 0 ? warnings : undefined;
  }

  /**
   * Get compatibility recommendations
   */
  private getCompatibilityRecommendations(
    _license1: License, 
    _license2: License, 
    compatibility: CompatibilityLevel
  ): string[] | undefined {
    const recommendations: string[] = [];

    if (compatibility === CompatibilityLevel.INCOMPATIBLE) {
      recommendations.push('Find alternative dependencies with compatible licenses');
      recommendations.push('Consider dual-licensing if you control one of the components');
      recommendations.push('Seek legal counsel for specific use case guidance');
    }

    if (compatibility === CompatibilityLevel.CONDITIONALLY_COMPATIBLE) {
      recommendations.push('Document the specific conditions that must be met');
      recommendations.push('Implement compliance procedures for license obligations');
      recommendations.push('Consider the long-term implications of license obligations');
    }

    return recommendations.length > 0 ? recommendations : undefined;
  }

  /**
   * Assess compatibility risk level
   */
  private assessCompatibilityRisk(
    _license1: License, 
    _license2: License, 
    compatibility: CompatibilityLevel
  ): LegalRiskLevel {
    switch (compatibility) {
      case CompatibilityLevel.COMPATIBLE:
        return LegalRiskLevel.VERY_LOW;
      
      case CompatibilityLevel.CONDITIONALLY_COMPATIBLE:
        return LegalRiskLevel.MEDIUM;
      
      case CompatibilityLevel.INCOMPATIBLE:
        return LegalRiskLevel.CRITICAL;
      
      case CompatibilityLevel.REQUIRES_REVIEW:
        return LegalRiskLevel.HIGH;
      
      case CompatibilityLevel.UNKNOWN:
        return LegalRiskLevel.VERY_HIGH;
      
      default:
        return LegalRiskLevel.HIGH;
    }
  }

  /**
   * Extract unique licenses from analysis results
   */
  private extractUniqueLicenses(licenseAnalyses: LicenseAnalysis[]): License[] {
    const licenseMap = new Map<string, License>();

    for (const analysis of licenseAnalyses) {
      for (const license of analysis.licenses) {
        licenseMap.set(license.spdxId, license);
      }
    }

    return Array.from(licenseMap.values());
  }

  /**
   * Build compatibility matrix for all license combinations
   */
  private async buildCompatibilityMatrix(licenses: License[]): Promise<Array<{
    license1: string;
    license2: string;
    compatibility: CompatibilityLevel;
    riskLevel: LegalRiskLevel;
  }>> {
    const matrix: Array<{
      license1: string;
      license2: string;
      compatibility: CompatibilityLevel;
      riskLevel: LegalRiskLevel;
    }> = [];

    for (let i = 0; i < licenses.length; i++) {
      for (let j = i + 1; j < licenses.length; j++) {
        const license1 = licenses[i];
        const license2 = licenses[j];
        
        if (license1 && license2) {
          const compatibility = this.getCompatibilityLevel(license1.spdxId, license2.spdxId);
          const riskLevel = this.assessCompatibilityRisk(license1, license2, compatibility);
          
          matrix.push({
            license1: license1.spdxId,
            license2: license2.spdxId,
            compatibility,
            riskLevel
          });
        }
      }
    }

    return matrix;
  }

  /**
   * Determine overall project compatibility
   */
  private determineOverallCompatibility(matrix: Array<{
    license1: string;
    license2: string;
    compatibility: CompatibilityLevel;
    riskLevel: LegalRiskLevel;
  }>): CompatibilityLevel {
    if (matrix.length === 0) return CompatibilityLevel.COMPATIBLE;

    const incompatible = matrix.some(m => m.compatibility === CompatibilityLevel.INCOMPATIBLE);
    if (incompatible) return CompatibilityLevel.INCOMPATIBLE;

    const requiresReview = matrix.some(m => m.compatibility === CompatibilityLevel.REQUIRES_REVIEW);
    if (requiresReview) return CompatibilityLevel.REQUIRES_REVIEW;

    const conditional = matrix.some(m => m.compatibility === CompatibilityLevel.CONDITIONALLY_COMPATIBLE);
    if (conditional) return CompatibilityLevel.CONDITIONALLY_COMPATIBLE;

    const unknown = matrix.some(m => m.compatibility === CompatibilityLevel.UNKNOWN);
    if (unknown) return CompatibilityLevel.UNKNOWN;

    return CompatibilityLevel.COMPATIBLE;
  }

  /**
   * Find highest risk level in compatibility matrix
   */
  private findHighestRiskLevel(matrix: Array<{
    license1: string;
    license2: string;
    compatibility: CompatibilityLevel;
    riskLevel: LegalRiskLevel;
  }>): LegalRiskLevel {
    if (matrix.length === 0) return LegalRiskLevel.VERY_LOW;

    const riskLevels = matrix.map(m => m.riskLevel);
    
    if (riskLevels.includes(LegalRiskLevel.CRITICAL)) return LegalRiskLevel.CRITICAL;
    if (riskLevels.includes(LegalRiskLevel.VERY_HIGH)) return LegalRiskLevel.VERY_HIGH;
    if (riskLevels.includes(LegalRiskLevel.HIGH)) return LegalRiskLevel.HIGH;
    if (riskLevels.includes(LegalRiskLevel.MEDIUM)) return LegalRiskLevel.MEDIUM;
    if (riskLevels.includes(LegalRiskLevel.LOW)) return LegalRiskLevel.LOW;
    
    return LegalRiskLevel.VERY_LOW;
  }

  /**
   * Identify license conflicts
   */
  private identifyConflicts(
    licenses: License[],
    matrix: Array<{
      license1: string;
      license2: string;
      compatibility: CompatibilityLevel;
      riskLevel: LegalRiskLevel;
    }>
  ): Array<{
    conflictingLicenses: License[];
    description: string;
    severity: 'warning' | 'error' | 'critical';
    resolution?: string;
  }> {
    const conflicts: Array<{
      conflictingLicenses: License[];
      description: string;
      severity: 'warning' | 'error' | 'critical';
      resolution?: string;
    }> = [];

    const licenseMap = new Map(licenses.map(l => [l.spdxId, l]));

    for (const entry of matrix) {
      if (entry.compatibility === CompatibilityLevel.INCOMPATIBLE) {
        const license1 = licenseMap.get(entry.license1);
        const license2 = licenseMap.get(entry.license2);
        
        if (license1 && license2) {
          conflicts.push({
            conflictingLicenses: [license1, license2],
            description: `${license1.name} and ${license2.name} are incompatible`,
            severity: 'critical',
            resolution: 'Remove one of the conflicting dependencies or find compatible alternatives'
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Calculate project-wide license obligations
   */
  private calculateProjectObligations(licenseAnalyses: LicenseAnalysis[]): LicenseObligation[] {
    const obligationMap = new Map<string, LicenseObligation>();

    for (const analysis of licenseAnalyses) {
      for (const obligation of analysis.obligations) {
        const key = `${obligation.type}-${obligation.scope}`;
        if (!obligationMap.has(key)) {
          obligationMap.set(key, obligation);
        }
      }
    }

    return Array.from(obligationMap.values());
  }

  /**
   * Generate recommendations for resolving compatibility issues
   */
  private generateRecommendations(
    conflicts: Array<{ conflictingLicenses: License[]; description: string; severity: string }>,
    licenses: License[],
    _options: LicenseScanOptions
  ): Array<{
    type: 'license_change' | 'dual_license' | 'remove_dependency' | 'seek_legal_review';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedPackages?: string[];
  }> {
    const recommendations: Array<{
      type: 'license_change' | 'dual_license' | 'remove_dependency' | 'seek_legal_review';
      priority: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      affectedPackages?: string[];
    }> = [];

    // Critical conflicts need immediate attention
    for (const conflict of conflicts) {
      if (conflict.severity === 'critical') {
        recommendations.push({
          type: 'remove_dependency',
          priority: 'critical',
          description: `Remove or replace dependencies with incompatible licenses: ${conflict.conflictingLicenses.map(l => l.name).join(', ')}`,
          affectedPackages: conflict.conflictingLicenses.map(l => l.spdxId)
        });
      }
    }

    // General recommendations based on license mix
    const hasGPL = licenses.some(l => l.spdxId.includes('GPL'));
    const hasProprietaryFriendly = licenses.some(l => l.category === LicenseCategory.PERMISSIVE);

    if (hasGPL && hasProprietaryFriendly) {
      recommendations.push({
        type: 'seek_legal_review',
        priority: 'medium',
        description: 'Project mixes GPL and permissive licenses. Consider legal review for compliance strategy.'
      });
    }

    return recommendations;
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummaryStatistics(
    packages: Package[],
    licenseAnalyses: LicenseAnalysis[],
    matrix: Array<{ compatibility: CompatibilityLevel }>
  ): {
    totalPackages: number;
    uniqueLicenses: number;
    compatiblePackages: number;
    incompatiblePackages: number;
    unknownLicensePackages: number;
    riskScore: number;
  } {
    const uniqueLicenses = new Set();
    let unknownLicensePackages = 0;

    for (const analysis of licenseAnalyses) {
      if (analysis.licenses.length === 0) {
        unknownLicensePackages++;
      } else {
        for (const license of analysis.licenses) {
          uniqueLicenses.add(license.spdxId);
        }
      }
    }

    const incompatiblePairs = matrix.filter(m => m.compatibility === CompatibilityLevel.INCOMPATIBLE).length;
    const totalPairs = matrix.length;
    const compatiblePackages = packages.length - unknownLicensePackages;
    const incompatiblePackages = Math.min(incompatiblePairs * 2, packages.length); // Estimate

    // Calculate risk score (0-100)
    let riskScore = 0;
    if (totalPairs > 0) {
      riskScore = Math.round((incompatiblePairs / totalPairs) * 100);
    }
    riskScore += (unknownLicensePackages / packages.length) * 50; // Add risk for unknown licenses

    return {
      totalPackages: packages.length,
      uniqueLicenses: uniqueLicenses.size,
      compatiblePackages,
      incompatiblePackages,
      unknownLicensePackages,
      riskScore: Math.min(Math.round(riskScore), 100)
    };
  }

  /**
   * Get default scan options
   */
  private getDefaultOptions(): LicenseScanOptions {
    return {
      scanDepth: 'direct',
      includeDevDependencies: true,
      scanPatterns: ['LICENSE*', 'COPYING*', 'COPYRIGHT*'],
      ignorePatterns: ['node_modules/**', '.git/**'],
      confidenceThreshold: 0.7,
      useCache: true,
      failOnPolicyViolation: false
    };
  }
}

/**
 * Create a compatibility engine instance
 */
export function createCompatibilityEngine(): CompatibilityEngine {
  return new CompatibilityEngine();
}
