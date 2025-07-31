/**
 * License Compatibility Engine
 * Advanced license compatibility analysis with legal intelligence
 */
import type { Package } from '../../types';
import type { License, CompatibilityAnalysis, CompatibilityReport, LicenseAnalysis, LicenseScanOptions } from '../../types/license';
/**
 * Advanced license compatibility engine
 */
export declare class CompatibilityEngine {
    private licenseDb;
    /**
     * Analyze compatibility between two licenses
     */
    checkCompatibility(license1: License, license2: License): Promise<CompatibilityAnalysis>;
    /**
     * Generate comprehensive compatibility report for a project
     */
    generateCompatibilityReport(packages: Package[], licenseAnalyses: LicenseAnalysis[], options?: LicenseScanOptions): Promise<CompatibilityReport>;
    /**
     * Get compatibility level between two licenses
     */
    private getCompatibilityLevel;
    /**
     * Get compatibility based on license categories
     */
    private getCategoryCompatibility;
    /**
     * Generate human-readable explanation of compatibility
     */
    private generateExplanation;
    /**
     * Get compatibility conditions for compatibility
     */
    private getCompatibilityConditions;
    /**
     * Get compatibility warnings
     */
    private getCompatibilityWarnings;
    /**
     * Get compatibility recommendations
     */
    private getCompatibilityRecommendations;
    /**
     * Assess compatibility risk level
     */
    private assessCompatibilityRisk;
    /**
     * Extract unique licenses from analysis results
     */
    private extractUniqueLicenses;
    /**
     * Build compatibility matrix for all license combinations
     */
    private buildCompatibilityMatrix;
    /**
     * Determine overall project compatibility
     */
    private determineOverallCompatibility;
    /**
     * Find highest risk level in compatibility matrix
     */
    private findHighestRiskLevel;
    /**
     * Identify license conflicts
     */
    private identifyConflicts;
    /**
     * Calculate project-wide license obligations
     */
    private calculateProjectObligations;
    /**
     * Generate recommendations for resolving compatibility issues
     */
    private generateRecommendations;
    /**
     * Calculate summary statistics
     */
    private calculateSummaryStatistics;
    /**
     * Get default scan options
     */
    private getDefaultOptions;
}
/**
 * Create a compatibility engine instance
 */
export declare function createCompatibilityEngine(): CompatibilityEngine;
//# sourceMappingURL=compatibility-engine.d.ts.map