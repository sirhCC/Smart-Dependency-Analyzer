/**
 * License Intelligence Service
 * Complete license analysis, compatibility checking, and compliance reporting
 */
import type { Package } from '../../types';
import type { LicenseIntelligenceService, LicenseAnalysis, CompatibilityAnalysis, CompatibilityReport, LegalRiskReport, LicensePolicy, License, LicenseScanOptions, ComplianceDocumentOptions } from '../../types/license';
/**
 * Comprehensive license intelligence service
 */
export declare class LicenseIntelligenceServiceImpl implements LicenseIntelligenceService {
    private licenseDetector;
    private compatibilityEngine;
    constructor();
    /**
     * Analyze licenses for a single package
     */
    analyzeLicense(pkg: Package, options?: LicenseScanOptions): Promise<LicenseAnalysis>;
    /**
     * Analyze licenses for multiple packages
     */
    analyzeLicenses(packages: Package[], options?: LicenseScanOptions): Promise<LicenseAnalysis[]>;
    /**
     * Check compatibility between two licenses
     */
    checkCompatibility(license1: License, license2: License): Promise<CompatibilityAnalysis>;
    /**
     * Generate compatibility report for a project
     */
    generateCompatibilityReport(packages: Package[], options?: LicenseScanOptions): Promise<CompatibilityReport>;
    /**
     * Assess legal risk for a project
     */
    assessLegalRisk(packages: Package[], options?: LicenseScanOptions): Promise<LegalRiskReport>;
    /**
     * Generate compliance documentation
     */
    generateComplianceDocument(packages: Package[], options: ComplianceDocumentOptions): Promise<string>;
    /**
     * Validate project against license policy
     */
    validatePolicy(packages: Package[], policy: LicensePolicy): Promise<{
        compliant: boolean;
        violations: Array<{
            package: string;
            license: string;
            violation: string;
            severity: 'warning' | 'error' | 'critical';
        }>;
    }>;
    /**
     * Calculate overall risk score
     */
    private calculateRiskScore;
    /**
     * Determine overall risk level from score
     */
    private determineOverallRisk;
    /**
     * Identify risk factors
     */
    private identifyRiskFactors;
    /**
     * Assess jurisdiction-specific risks (simplified)
     */
    private assessJurisdictionRisks;
    /**
     * Assess patent-related risks
     */
    private assessPatentRisks;
    /**
     * Generate compliance requirements
     */
    private generateComplianceRequirements;
    /**
     * Assess if legal review is needed
     */
    private assessLegalReviewNeeds;
    /**
     * Generate text format compliance document
     */
    private generateTextDocument;
    /**
     * Generate HTML format compliance document
     */
    private generateHtmlDocument;
    /**
     * Generate Markdown format compliance document
     */
    private generateMarkdownDocument;
    /**
     * Generate JSON format compliance document
     */
    private generateJsonDocument;
    /**
     * Group license analyses by license type
     */
    private groupAnalysesByLicense;
}
/**
 * Create a license intelligence service instance
 */
export declare function createLicenseIntelligenceService(): LicenseIntelligenceService;
//# sourceMappingURL=license-intelligence.d.ts.map