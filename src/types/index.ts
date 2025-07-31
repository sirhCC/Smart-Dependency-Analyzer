/**
 * Core type definitions for Smart Dependency Analyzer
 * Enterprise-grade type safety with comprehensive domain modeling
 */

// Package and Dependency Types
export interface Package {
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly license?: string;
  readonly homepage?: string;
  readonly repository?: PackageRepository;
  readonly author?: PackageAuthor;
  readonly maintainers?: PackageAuthor[];
  readonly keywords?: string[];
  readonly dependencies?: Record<string, string>;
  readonly devDependencies?: Record<string, string>;
  readonly peerDependencies?: Record<string, string>;
  readonly optionalDependencies?: Record<string, string>;
  readonly bundledDependencies?: string[];
  readonly engines?: Record<string, string>;
  readonly os?: string[];
  readonly cpu?: string[];
  readonly publishedAt?: Date;
  readonly downloadCount?: number;
  readonly fileSize?: number;
  readonly shasum?: string;
  readonly integrity?: string;
}

export interface PackageRepository {
  readonly type: string;
  readonly url: string;
  readonly directory?: string;
}

export interface PackageAuthor {
  readonly name: string;
  readonly email?: string;
  readonly url?: string;
}

export interface DependencyTree {
  readonly package: Package;
  readonly dependencies: DependencyTree[];
  readonly depth: number;
  readonly isDev: boolean;
  readonly isOptional: boolean;
  readonly isPeer: boolean;
  readonly path: string[];
}

// Vulnerability Types
export interface Vulnerability {
  readonly id: string;
  readonly cveId?: string;
  readonly title: string;
  readonly description: string;
  readonly severity: VulnerabilitySeverity;
  readonly cvssScore?: number;
  readonly cvssVector?: string;
  readonly publishedAt: Date;
  readonly updatedAt: Date;
  readonly affectedVersions: string[];
  readonly patchedVersions: string[];
  readonly references: VulnerabilityReference[];
  readonly cwe?: string[];
  readonly exploitabilityScore?: number;
  readonly impactScore?: number;
  readonly source: VulnerabilitySource;
}

export enum VulnerabilitySeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface VulnerabilityReference {
  readonly type: 'advisory' | 'article' | 'report' | 'fix' | 'package';
  readonly url: string;
  readonly title?: string;
}

export enum VulnerabilitySource {
  GITHUB = 'github',
  SNYK = 'snyk',
  NVD = 'nvd',
  OSV = 'osv',
  NPM = 'npm',
  CUSTOM = 'custom',
}

// License Types
export interface License {
  readonly spdxId?: string;
  readonly name: string;
  readonly text?: string;
  readonly url?: string;
  readonly isOsiApproved?: boolean;
  readonly isFsfLibre?: boolean;
  readonly isDeprecated?: boolean;
  readonly copyleft: CopyleftType;
  readonly commercialUse: boolean;
  readonly attribution: boolean;
  readonly shareAlike: boolean;
  readonly patentGrant: boolean;
}

export enum CopyleftType {
  NONE = 'none',
  WEAK = 'weak',
  STRONG = 'strong',
  NETWORK = 'network',
}

export interface LicenseCompatibility {
  readonly license1: License;
  readonly license2: License;
  readonly compatible: boolean;
  readonly conflicts: LicenseConflict[];
  readonly recommendations: string[];
}

export interface LicenseConflict {
  readonly type: 'copyleft' | 'commercial' | 'attribution' | 'patent';
  readonly description: string;
  readonly severity: 'warning' | 'error';
}

// Analysis Types
export interface AnalysisConfig {
  readonly includeDevDependencies: boolean;
  readonly includeOptionalDependencies: boolean;
  readonly includePeerDependencies: boolean;
  readonly maxDepth: number;
  readonly minSeverity: VulnerabilitySeverity;
  readonly enableLicenseCheck: boolean;
  readonly enablePerformanceAnalysis: boolean;
  readonly enableSupplyChainAnalysis: boolean;
  readonly excludePackages: string[];
  readonly customRules: AnalysisRule[];
}

export interface AnalysisRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly severity: VulnerabilitySeverity;
  readonly enabled: boolean;
  readonly pattern: string | RegExp;
  readonly action: 'warn' | 'error' | 'ignore';
}

export interface AnalysisResult {
  readonly projectPath: string;
  readonly packageName: string;
  readonly packageVersion: string;
  readonly analyzedAt: Date;
  readonly duration: number;
  readonly summary: AnalysisSummary;
  readonly vulnerabilities: VulnerabilityFinding[];
  readonly licenses: LicenseFinding[];
  readonly performance: PerformanceFinding[];
  readonly supplyChain: SupplyChainFinding[];
  readonly recommendations: Recommendation[];
}

export interface AnalysisSummary {
  readonly totalPackages: number;
  readonly directDependencies: number;
  readonly transitiveDependencies: number;
  readonly vulnerabilityCount: Record<VulnerabilitySeverity, number>;
  readonly licenseCount: Record<string, number>;
  readonly riskScore: number;
  readonly grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

// Finding Types
export interface Finding {
  readonly id: string;
  readonly type: FindingType;
  readonly severity: VulnerabilitySeverity;
  readonly title: string;
  readonly description: string;
  readonly affectedPackage: Package;
  readonly location: FindingLocation;
  readonly remediation?: Remediation;
}

export enum FindingType {
  VULNERABILITY = 'vulnerability',
  LICENSE = 'license',
  PERFORMANCE = 'performance',
  SUPPLY_CHAIN = 'supply_chain',
  POLICY = 'policy',
  QUALITY = 'quality',
}

export interface FindingLocation {
  readonly filePath: string;
  readonly dependencyPath: string[];
  readonly isDirect: boolean;
  readonly depth: number;
}

export interface VulnerabilityFinding extends Finding {
  readonly vulnerability: Vulnerability;
  readonly exploitProbability?: number;
  readonly attackVector?: string[];
  readonly dataExposureRisk?: boolean;
}

export interface LicenseFinding extends Finding {
  readonly license: License;
  readonly compatibility: LicenseCompatibility[];
  readonly compliance: ComplianceStatus;
  readonly obligations: LicenseObligation[];
}

export interface PerformanceFinding extends Finding {
  readonly bundleSize: number;
  readonly loadTime?: number;
  readonly memoryUsage?: number;
  readonly alternatives: PackageAlternative[];
}

export interface SupplyChainFinding extends Finding {
  readonly trustScore: number;
  readonly maintainerRisk: MaintainerRisk;
  readonly typosquatting?: TyposquattingRisk;
  readonly indicators: SupplyChainIndicator[];
}

// Support Types
export interface Remediation {
  readonly type: 'update' | 'patch' | 'replace' | 'remove' | 'configure';
  readonly description: string;
  readonly effort: 'low' | 'medium' | 'high';
  readonly impact: 'low' | 'medium' | 'high';
  readonly steps: RemediationStep[];
  readonly automatable: boolean;
}

export interface RemediationStep {
  readonly order: number;
  readonly description: string;
  readonly command?: string;
  readonly risk: 'low' | 'medium' | 'high';
}

export interface Recommendation {
  readonly id: string;
  readonly type: 'security' | 'performance' | 'license' | 'maintenance';
  readonly priority: 'low' | 'medium' | 'high' | 'critical';
  readonly title: string;
  readonly description: string;
  readonly rationale: string;
  readonly implementation: RecommendationImplementation;
  readonly impact: RecommendationImpact;
}

export interface RecommendationImplementation {
  readonly difficulty: 'easy' | 'moderate' | 'hard';
  readonly timeEstimate: string;
  readonly prerequisites: string[];
  readonly steps: string[];
}

export interface RecommendationImpact {
  readonly security: number; // 0-10 scale
  readonly performance: number; // 0-10 scale
  readonly maintainability: number; // 0-10 scale
  readonly cost: number; // 0-10 scale
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  REQUIRES_REVIEW = 'requires_review',
  UNKNOWN = 'unknown',
}

export interface LicenseObligation {
  readonly type: 'attribution' | 'copyleft' | 'patent' | 'trademark' | 'warranty';
  readonly description: string;
  readonly required: boolean;
  readonly fulfilled: boolean;
}

export interface PackageAlternative {
  readonly package: Package;
  readonly reason: string;
  readonly benefits: string[];
  readonly tradeoffs: string[];
  readonly migrationComplexity: 'low' | 'medium' | 'high';
}

export interface MaintainerRisk {
  readonly score: number; // 0-10 scale
  readonly factors: MaintainerRiskFactor[];
  readonly history: MaintainerHistory[];
}

export interface MaintainerRiskFactor {
  readonly type: 'experience' | 'activity' | 'reputation' | 'verification';
  readonly score: number; // 0-10 scale
  readonly description: string;
}

export interface MaintainerHistory {
  readonly event: 'created' | 'transferred' | 'abandoned' | 'compromised';
  readonly date: Date;
  readonly description: string;
  readonly impact: 'low' | 'medium' | 'high';
}

export interface TyposquattingRisk {
  readonly score: number; // 0-10 scale
  readonly suspiciousPackages: SuspiciousPackage[];
  readonly confidence: number; // 0-1 probability
}

export interface SuspiciousPackage {
  readonly name: string;
  readonly similarity: number; // 0-1 similarity score
  readonly indicators: string[];
  readonly verified: boolean;
}

export interface SupplyChainIndicator {
  readonly type: 'behavioral' | 'metadata' | 'temporal' | 'network';
  readonly severity: VulnerabilitySeverity;
  readonly description: string;
  readonly evidence: string[];
  readonly confidence: number; // 0-1 probability
}

// Configuration Types
export interface ProjectConfig {
  readonly projectPath: string;
  readonly packageManager: 'npm' | 'yarn' | 'pnpm';
  readonly lockFileExists: boolean;
  readonly monorepo: boolean;
  readonly workspaces?: string[];
  readonly nodeVersion?: string;
  readonly registry?: string;
}

export interface SDAConfig {
  readonly version: string;
  readonly analysis: AnalysisConfig;
  readonly reporting: ReportingConfig;
  readonly integrations: IntegrationsConfig;
  readonly policies: PolicyConfig[];
}

export interface ReportingConfig {
  readonly formats: ReportFormat[];
  readonly outputDirectory: string;
  readonly includeRemediation: boolean;
  readonly includeMetrics: boolean;
  readonly groupByType: boolean;
  readonly sortBySeverity: boolean;
}

export enum ReportFormat {
  JSON = 'json',
  HTML = 'html',
  PDF = 'pdf',
  CSV = 'csv',
  MARKDOWN = 'markdown',
  SARIF = 'sarif',
}

export interface IntegrationsConfig {
  readonly github?: GitHubConfig;
  readonly slack?: SlackConfig;
  readonly jira?: JiraConfig;
  readonly email?: EmailConfig;
}

export interface GitHubConfig {
  readonly token: string;
  readonly owner: string;
  readonly repo: string;
  readonly createIssues: boolean;
  readonly issueLabels: string[];
}

export interface SlackConfig {
  readonly webhookUrl: string;
  readonly channel: string;
  readonly mentionUsers: string[];
  readonly severityThreshold: VulnerabilitySeverity;
}

export interface JiraConfig {
  readonly url: string;
  readonly username: string;
  readonly token: string;
  readonly project: string;
  readonly issueType: string;
}

export interface EmailConfig {
  readonly smtp: SMTPConfig;
  readonly recipients: string[];
  readonly template: string;
  readonly severityThreshold: VulnerabilitySeverity;
}

export interface SMTPConfig {
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly auth: {
    readonly user: string;
    readonly pass: string;
  };
}

export interface PolicyConfig {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly enabled: boolean;
  readonly rules: PolicyRule[];
}

export interface PolicyRule {
  readonly type: 'vulnerability' | 'license' | 'performance' | 'supply_chain';
  readonly condition: PolicyCondition;
  readonly action: PolicyAction;
}

export interface PolicyCondition {
  readonly field: string;
  readonly operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'regex';
  readonly value: string | number | string[] | number[];
}

export interface PolicyAction {
  readonly type: 'allow' | 'warn' | 'fail';
  readonly message?: string;
  readonly notify?: boolean;
}
