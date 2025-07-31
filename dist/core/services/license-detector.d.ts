/**
 * License Detector Service
 * Advanced license detection using SPDX identifiers, file analysis, and NLP
 */
import type { Package } from '../../types';
import type { LicenseAnalysis, LicenseScanOptions } from '../../types/license';
/**
 * Advanced license detector with multiple detection strategies
 */
export declare class LicenseDetector {
    private licenseDb;
    /**
     * Detect license for a package using multiple strategies
     */
    detectLicense(pkg: Package, options?: LicenseScanOptions): Promise<LicenseAnalysis>;
    /**
     * Detect declared license from package.json
     */
    private detectDeclaredLicense;
    /**
     * Analyze license files in the package
     */
    private analyzeLicenseFiles;
    /**
     * Analyze license text content using pattern matching
     */
    private analyzeLicenseText;
    /**
     * Extract copyright statements from license files
     */
    private extractCopyrightStatements;
    /**
     * Consolidate detected licenses and remove duplicates
     */
    private consolidateLicenses;
    /**
     * Determine the primary license (most permissive or declared)
     */
    private determinePrimaryLicense;
    /**
     * Calculate all obligations from detected licenses
     */
    private calculateObligations;
    /**
     * Create license obligation details
     */
    private createObligation;
    /**
     * Assess legal risk based on licenses and obligations
     */
    private assessLegalRisk;
    /**
     * Detect issues with license analysis
     */
    private detectIssues;
    /**
     * Check if licenses are incompatible
     */
    private hasIncompatibleLicenses;
    /**
     * Determine the detection method used
     */
    private determineDetectionMethod;
    /**
     * Get default scan options
     */
    private getDefaultOptions;
}
/**
 * Create a license detector instance
 */
export declare function createLicenseDetector(): LicenseDetector;
//# sourceMappingURL=license-detector.d.ts.map