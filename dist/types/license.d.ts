/**
 * License Intelligence Types
 * Comprehensive type definitions for license analysis, compatibility, and compliance
 */
/**
 * Standard license categories based on legal characteristics
 */
export declare enum LicenseCategory {
    PERMISSIVE = "permissive",
    COPYLEFT = "copyleft",
    WEAK_COPYLEFT = "weak_copyleft",
    PROPRIETARY = "proprietary",
    PUBLIC_DOMAIN = "public_domain",
    CUSTOM = "custom",
    UNKNOWN = "unknown"
}
/**
 * License compatibility levels for mixing different licenses
 */
export declare enum CompatibilityLevel {
    COMPATIBLE = "compatible",
    CONDITIONALLY_COMPATIBLE = "conditionally_compatible",
    INCOMPATIBLE = "incompatible",
    REQUIRES_REVIEW = "requires_review",
    UNKNOWN = "unknown"
}
/**
 * Legal risk levels for license compliance
 */
export declare enum LegalRiskLevel {
    VERY_LOW = "very_low",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    VERY_HIGH = "very_high",
    CRITICAL = "critical"
}
/**
 * License obligation types that must be fulfilled
 */
export declare enum ObligationType {
    ATTRIBUTION = "attribution",
    COPYLEFT = "copyleft",
    DISCLOSE_SOURCE = "disclose_source",
    SAME_LICENSE = "same_license",
    PATENT_GRANT = "patent_grant",
    NO_COMMERCIAL_USE = "no_commercial_use",
    SHARE_ALIKE = "share_alike",
    NOTICE_PRESERVATION = "notice_preservation"
}
/**
 * Core license information
 */
export interface License {
    /** SPDX license identifier (e.g., 'MIT', 'Apache-2.0') */
    spdxId: string;
    /** Human-readable license name */
    name: string;
    /** License category for classification */
    category: LicenseCategory;
    /** Whether this is an OSI-approved license */
    osiApproved: boolean;
    /** Whether this is an FSF-approved license */
    fsfApproved: boolean;
    /** Full license text */
    fullText?: string;
    /** Standard license header/notice */
    standardLicenseHeader?: string;
    /** List of license obligations */
    obligations: ObligationType[];
    /** Whether license allows commercial use */
    allowsCommercialUse: boolean;
    /** Whether license allows modifications */
    allowsModifications: boolean;
    /** Whether license allows distribution */
    allowsDistribution: boolean;
    /** Whether license requires source disclosure */
    requiresSourceDisclosure: boolean;
    /** Official license URL */
    url?: string;
    /** Deprecated license identifiers */
    deprecatedIds?: string[];
    /** License detection confidence (0-1) */
    confidence?: number;
}
/**
 * License obligation with specific requirements
 */
export interface LicenseObligation {
    type: ObligationType;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    scope: 'file' | 'component' | 'project' | 'distribution';
    conditions?: string[];
    exemptions?: string[];
}
/**
 * License analysis result for a package
 */
export interface LicenseAnalysis {
    /** Package being analyzed */
    package: {
        name: string;
        version: string;
    };
    /** Detected licenses */
    licenses: License[];
    /** Primary license (most permissive or declared) */
    primaryLicense?: License;
    /** License detection method used */
    detectionMethod: 'declared' | 'file_analysis' | 'heuristic' | 'manual';
    /** License files found */
    licenseFiles: Array<{
        path: string;
        license: License;
        confidence: number;
    }>;
    /** Copyright statements found */
    copyrightStatements: string[];
    /** License obligations that apply */
    obligations: LicenseObligation[];
    /** Legal risk assessment */
    riskLevel: LegalRiskLevel;
    /** Issues found during analysis */
    issues: Array<{
        type: 'missing_license' | 'conflicting_licenses' | 'deprecated_license' | 'unrecognized_license';
        severity: 'warning' | 'error' | 'critical';
        description: string;
        file?: string;
    }>;
    /** Analysis metadata */
    metadata: {
        analyzedAt: Date;
        analyzer: string;
        version: string;
        scanDuration: number;
    };
}
/**
 * License compatibility analysis between two licenses
 */
export interface CompatibilityAnalysis {
    /** First license in comparison */
    license1: License;
    /** Second license in comparison */
    license2: License;
    /** Compatibility level */
    compatibility: CompatibilityLevel;
    /** Detailed explanation of compatibility */
    explanation: string;
    /** Conditions that must be met for compatibility */
    conditions?: string[];
    /** Warnings about potential issues */
    warnings?: string[];
    /** Recommendations for resolving incompatibilities */
    recommendations?: string[];
    /** Legal risk of combining these licenses */
    riskLevel: LegalRiskLevel;
}
/**
 * Comprehensive compatibility report for a project
 */
export interface CompatibilityReport {
    /** Project metadata */
    project: {
        name: string;
        version?: string;
        license?: License;
    };
    /** All unique licenses found in project */
    allLicenses: License[];
    /** License compatibility matrix */
    compatibilityMatrix: Array<{
        license1: string;
        license2: string;
        compatibility: CompatibilityLevel;
        riskLevel: LegalRiskLevel;
    }>;
    /** Overall project compatibility status */
    overallCompatibility: CompatibilityLevel;
    /** Highest risk level found */
    highestRiskLevel: LegalRiskLevel;
    /** License conflicts that need resolution */
    conflicts: Array<{
        conflictingLicenses: License[];
        description: string;
        severity: 'warning' | 'error' | 'critical';
        resolution?: string;
    }>;
    /** Required obligations for the entire project */
    projectObligations: LicenseObligation[];
    /** Recommendations for resolving issues */
    recommendations: Array<{
        type: 'license_change' | 'dual_license' | 'remove_dependency' | 'seek_legal_review';
        priority: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        affectedPackages?: string[];
    }>;
    /** Analysis summary */
    summary: {
        totalPackages: number;
        uniqueLicenses: number;
        compatiblePackages: number;
        incompatiblePackages: number;
        unknownLicensePackages: number;
        riskScore: number;
    };
}
/**
 * Legal risk assessment for a project
 */
export interface LegalRiskReport {
    /** Project being assessed */
    project: {
        name: string;
        version?: string;
    };
    /** Overall risk level */
    overallRisk: LegalRiskLevel;
    /** Risk score (0-100) */
    riskScore: number;
    /** Risk factors identified */
    riskFactors: Array<{
        category: 'license_compatibility' | 'patent_risk' | 'compliance' | 'litigation' | 'governance';
        description: string;
        impact: 'low' | 'medium' | 'high' | 'critical';
        likelihood: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
        riskScore: number;
        mitigation?: string;
    }>;
    /** Jurisdiction-specific risks */
    jurisdictionRisks: Array<{
        jurisdiction: string;
        riskLevel: LegalRiskLevel;
        specificRisks: string[];
    }>;
    /** Patent-related risks */
    patentRisks: Array<{
        license: License;
        patentClauses: string[];
        riskDescription: string;
        riskLevel: LegalRiskLevel;
    }>;
    /** Compliance requirements */
    complianceRequirements: Array<{
        requirement: string;
        deadline?: Date;
        responsible: string;
        status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    }>;
    /** Legal review recommendations */
    legalReview: {
        required: boolean;
        urgency: 'low' | 'medium' | 'high' | 'urgent';
        scope: string[];
        estimatedHours?: number;
    };
}
/**
 * License policy configuration for organizations
 */
export interface LicensePolicy {
    /** Policy metadata */
    name: string;
    version: string;
    description: string;
    effectiveDate: Date;
    /** Allowed licenses */
    allowedLicenses: string[];
    /** Prohibited licenses */
    prohibitedLicenses: string[];
    /** Licenses requiring review */
    reviewRequiredLicenses: string[];
    /** Category-based rules */
    categoryRules: Array<{
        category: LicenseCategory;
        action: 'allow' | 'prohibit' | 'review';
        conditions?: string[];
    }>;
    /** Risk tolerance levels */
    riskTolerance: {
        maximumRiskLevel: LegalRiskLevel;
        allowHighRiskWithApproval: boolean;
        autoApproveRiskLevel: LegalRiskLevel;
    };
    /** Compliance requirements */
    complianceSettings: {
        requireAttribution: boolean;
        attributionFormat: 'notice_file' | 'about_dialog' | 'both';
        requireSourceDisclosure: boolean;
        copyleftPolicy: 'strict' | 'permissive' | 'case_by_case';
    };
    /** Approval workflows */
    approvalWorkflows: Array<{
        trigger: string;
        approvers: string[];
        timeoutDays: number;
        escalation?: string[];
    }>;
}
/**
 * Compliance document generation options
 */
export interface ComplianceDocumentOptions {
    /** Document format */
    format: 'text' | 'html' | 'markdown' | 'pdf' | 'json';
    /** Include license texts */
    includeLicenseTexts: boolean;
    /** Include copyright notices */
    includeCopyrightNotices: boolean;
    /** Include source code references */
    includeSourceReferences: boolean;
    /** Group by license type */
    groupByLicense: boolean;
    /** Template to use for generation */
    template?: string;
    /** Custom header/footer */
    customHeader?: string;
    customFooter?: string;
}
/**
 * License scanning options
 */
export interface LicenseScanOptions {
    /** Scan depth for dependencies */
    scanDepth: 'direct' | 'all' | number;
    /** Include development dependencies */
    includeDevDependencies: boolean;
    /** File patterns to scan for licenses */
    scanPatterns: string[];
    /** File patterns to ignore */
    ignorePatterns: string[];
    /** Minimum confidence threshold for detection */
    confidenceThreshold: number;
    /** Use cached results when available */
    useCache: boolean;
    /** Policy to apply during scanning */
    policy?: LicensePolicy;
    /** Fail scan on policy violations */
    failOnPolicyViolation: boolean;
}
/**
 * License intelligence service interface
 */
export interface LicenseIntelligenceService {
    /**
     * Analyze licenses for a single package
     */
    analyzeLicense(pkg: Package, options?: LicenseScanOptions): Promise<LicenseAnalysis>;
    /**
     * Analyze licenses for multiple packages
     */
    analyzeLicenses(packages: Package[], options?: LicenseScanOptions): Promise<LicenseAnalysis[]>;
    /**
     * Check compatibility between licenses
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
}
import type { Package } from './index';
//# sourceMappingURL=license.d.ts.map