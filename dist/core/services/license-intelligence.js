"use strict";
/**
 * License Intelligence Service
 * Complete license analysis, compatibility checking, and compliance reporting
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseIntelligenceServiceImpl = void 0;
exports.createLicenseIntelligenceService = createLicenseIntelligenceService;
const license_1 = require("../../types/license");
const license_detector_1 = require("./license-detector");
const compatibility_engine_1 = require("./compatibility-engine");
const logger_1 = require("../../utils/logger");
/**
 * Comprehensive license intelligence service
 */
class LicenseIntelligenceServiceImpl {
    licenseDetector = (0, license_detector_1.createLicenseDetector)();
    compatibilityEngine = (0, compatibility_engine_1.createCompatibilityEngine)();
    constructor() {
        logger_1.logger.info('📜 License Intelligence Service initialized');
    }
    /**
     * Analyze licenses for a single package
     */
    async analyzeLicense(pkg, options) {
        logger_1.logger.info(`🔍 Analyzing license for package: ${pkg.name}@${pkg.version}`);
        try {
            const analysis = await this.licenseDetector.detectLicense(pkg, options);
            logger_1.logger.info(`✅ License analysis completed for ${pkg.name} - Found ${analysis.licenses.length} licenses`);
            return analysis;
        }
        catch (error) {
            logger_1.logger.error(`License analysis failed for ${pkg.name}:`, error);
            throw error;
        }
    }
    /**
     * Analyze licenses for multiple packages
     */
    async analyzeLicenses(packages, options) {
        const startTime = Date.now();
        logger_1.logger.info(`🔍 Starting license analysis for ${packages.length} packages`);
        try {
            const analyses = [];
            // Process packages in parallel for better performance
            const batchSize = 10; // Process in batches to avoid overwhelming the system
            for (let i = 0; i < packages.length; i += batchSize) {
                const batch = packages.slice(i, i + batchSize);
                const batchPromises = batch.map(pkg => this.analyzeLicense(pkg, options));
                const batchResults = await Promise.allSettled(batchPromises);
                for (const result of batchResults) {
                    if (result.status === 'fulfilled') {
                        analyses.push(result.value);
                    }
                    else {
                        logger_1.logger.warn('License analysis failed for package in batch:', result.reason);
                    }
                }
            }
            const scanDuration = Date.now() - startTime;
            logger_1.logger.info(`✅ License analysis completed in ${scanDuration}ms - Analyzed ${analyses.length}/${packages.length} packages`);
            return analyses;
        }
        catch (error) {
            logger_1.logger.error('Batch license analysis failed:', error);
            throw error;
        }
    }
    /**
     * Check compatibility between two licenses
     */
    async checkCompatibility(license1, license2) {
        logger_1.logger.info(`🔍 Checking license compatibility: ${license1.spdxId} vs ${license2.spdxId}`);
        try {
            const analysis = await this.compatibilityEngine.checkCompatibility(license1, license2);
            logger_1.logger.info(`✅ Compatibility analysis completed: ${analysis.compatibility}`);
            return analysis;
        }
        catch (error) {
            logger_1.logger.error('License compatibility check failed:', error);
            throw error;
        }
    }
    /**
     * Generate compatibility report for a project
     */
    async generateCompatibilityReport(packages, options) {
        const startTime = Date.now();
        logger_1.logger.info(`🔍 Generating compatibility report for ${packages.length} packages`);
        try {
            // First, analyze all licenses
            const licenseAnalyses = await this.analyzeLicenses(packages, options);
            // Then generate compatibility report
            const report = await this.compatibilityEngine.generateCompatibilityReport(packages, licenseAnalyses, options);
            const scanDuration = Date.now() - startTime;
            logger_1.logger.info(`✅ Compatibility report generated in ${scanDuration}ms - Overall compatibility: ${report.overallCompatibility}`);
            return report;
        }
        catch (error) {
            logger_1.logger.error('Compatibility report generation failed:', error);
            throw error;
        }
    }
    /**
     * Assess legal risk for a project
     */
    async assessLegalRisk(packages, options) {
        const startTime = Date.now();
        logger_1.logger.info(`🔍 Assessing legal risk for ${packages.length} packages`);
        try {
            // Get license analyses and compatibility report
            const licenseAnalyses = await this.analyzeLicenses(packages, options);
            const compatibilityReport = await this.compatibilityEngine.generateCompatibilityReport(packages, licenseAnalyses, options);
            // Calculate overall risk score
            const riskScore = this.calculateRiskScore(licenseAnalyses, compatibilityReport);
            const overallRisk = this.determineOverallRisk(riskScore);
            // Identify risk factors
            const riskFactors = this.identifyRiskFactors(licenseAnalyses, compatibilityReport);
            // Assess jurisdiction risks (simplified)
            const jurisdictionRisks = this.assessJurisdictionRisks(licenseAnalyses);
            // Assess patent risks
            const patentRisks = this.assessPatentRisks(licenseAnalyses);
            // Generate compliance requirements
            const complianceRequirements = this.generateComplianceRequirements(licenseAnalyses);
            // Determine if legal review is needed
            const legalReview = this.assessLegalReviewNeeds(overallRisk, riskFactors);
            const riskReport = {
                project: {
                    name: packages[0]?.name || 'Unknown Project',
                    ...(packages[0]?.version && { version: packages[0].version })
                },
                overallRisk,
                riskScore,
                riskFactors,
                jurisdictionRisks,
                patentRisks,
                complianceRequirements,
                legalReview
            };
            const scanDuration = Date.now() - startTime;
            logger_1.logger.info(`✅ Legal risk assessment completed in ${scanDuration}ms - Risk level: ${overallRisk}`);
            return riskReport;
        }
        catch (error) {
            logger_1.logger.error('Legal risk assessment failed:', error);
            throw error;
        }
    }
    /**
     * Generate compliance documentation
     */
    async generateComplianceDocument(packages, options) {
        const startTime = Date.now();
        logger_1.logger.info(`📄 Generating compliance document for ${packages.length} packages`);
        try {
            // Get license analyses
            const licenseAnalyses = await this.analyzeLicenses(packages);
            // Generate document based on format
            let document = '';
            switch (options.format) {
                case 'text':
                    document = await this.generateTextDocument(licenseAnalyses, options);
                    break;
                case 'html':
                    document = await this.generateHtmlDocument(licenseAnalyses, options);
                    break;
                case 'markdown':
                    document = await this.generateMarkdownDocument(licenseAnalyses, options);
                    break;
                case 'json':
                    document = await this.generateJsonDocument(licenseAnalyses, options);
                    break;
                default:
                    throw new Error(`Unsupported document format: ${options.format}`);
            }
            const scanDuration = Date.now() - startTime;
            logger_1.logger.info(`✅ Compliance document generated in ${scanDuration}ms - Format: ${options.format}`);
            return document;
        }
        catch (error) {
            logger_1.logger.error('Compliance document generation failed:', error);
            throw error;
        }
    }
    /**
     * Validate project against license policy
     */
    async validatePolicy(packages, policy) {
        const startTime = Date.now();
        logger_1.logger.info(`📋 Validating ${packages.length} packages against policy: ${policy.name}`);
        try {
            // Get license analyses
            const licenseAnalyses = await this.analyzeLicenses(packages);
            const violations = [];
            // Check each package against policy
            for (const analysis of licenseAnalyses) {
                for (const license of analysis.licenses) {
                    // Check if license is prohibited
                    if (policy.prohibitedLicenses.includes(license.spdxId)) {
                        violations.push({
                            package: analysis.package.name,
                            license: license.spdxId,
                            violation: 'License is explicitly prohibited',
                            severity: 'critical'
                        });
                    }
                    // Check if license requires review but not in allowed list
                    if (policy.reviewRequiredLicenses.includes(license.spdxId) &&
                        !policy.allowedLicenses.includes(license.spdxId)) {
                        violations.push({
                            package: analysis.package.name,
                            license: license.spdxId,
                            violation: 'License requires legal review',
                            severity: 'warning'
                        });
                    }
                    // Check category rules
                    const categoryRule = policy.categoryRules.find(rule => rule.category === license.category);
                    if (categoryRule?.action === 'prohibit') {
                        violations.push({
                            package: analysis.package.name,
                            license: license.spdxId,
                            violation: `License category '${license.category}' is prohibited`,
                            severity: 'error'
                        });
                    }
                    // Check risk tolerance
                    if (analysis.riskLevel === license_1.LegalRiskLevel.CRITICAL &&
                        policy.riskTolerance.maximumRiskLevel !== license_1.LegalRiskLevel.CRITICAL) {
                        violations.push({
                            package: analysis.package.name,
                            license: license.spdxId,
                            violation: 'License risk level exceeds policy tolerance',
                            severity: 'critical'
                        });
                    }
                }
            }
            const compliant = violations.length === 0;
            const scanDuration = Date.now() - startTime;
            logger_1.logger.info(`✅ Policy validation completed in ${scanDuration}ms - Compliant: ${compliant}, Violations: ${violations.length}`);
            return { compliant, violations };
        }
        catch (error) {
            logger_1.logger.error('Policy validation failed:', error);
            throw error;
        }
    }
    /**
     * Calculate overall risk score
     */
    calculateRiskScore(licenseAnalyses, compatibilityReport) {
        let riskScore = 0;
        // Risk from individual licenses
        for (const analysis of licenseAnalyses) {
            switch (analysis.riskLevel) {
                case license_1.LegalRiskLevel.CRITICAL:
                    riskScore += 20;
                    break;
                case license_1.LegalRiskLevel.VERY_HIGH:
                    riskScore += 15;
                    break;
                case license_1.LegalRiskLevel.HIGH:
                    riskScore += 10;
                    break;
                case license_1.LegalRiskLevel.MEDIUM:
                    riskScore += 5;
                    break;
                case license_1.LegalRiskLevel.LOW:
                    riskScore += 2;
                    break;
                case license_1.LegalRiskLevel.VERY_LOW:
                    riskScore += 1;
                    break;
            }
        }
        // Additional risk from compatibility issues
        riskScore += compatibilityReport.summary.riskScore;
        // Normalize to 0-100 scale
        return Math.min(Math.round(riskScore / licenseAnalyses.length), 100);
    }
    /**
     * Determine overall risk level from score
     */
    determineOverallRisk(riskScore) {
        if (riskScore >= 80)
            return license_1.LegalRiskLevel.CRITICAL;
        if (riskScore >= 60)
            return license_1.LegalRiskLevel.VERY_HIGH;
        if (riskScore >= 40)
            return license_1.LegalRiskLevel.HIGH;
        if (riskScore >= 20)
            return license_1.LegalRiskLevel.MEDIUM;
        if (riskScore >= 10)
            return license_1.LegalRiskLevel.LOW;
        return license_1.LegalRiskLevel.VERY_LOW;
    }
    /**
     * Identify risk factors
     */
    identifyRiskFactors(licenseAnalyses, compatibilityReport) {
        const riskFactors = [];
        // License compatibility risks
        if (compatibilityReport.conflicts.length > 0) {
            riskFactors.push({
                category: 'license_compatibility',
                description: `${compatibilityReport.conflicts.length} license compatibility conflicts detected`,
                impact: 'critical',
                likelihood: 'high',
                riskScore: compatibilityReport.conflicts.length * 20,
                mitigation: 'Remove conflicting dependencies or find compatible alternatives'
            });
        }
        // Compliance risks
        const copyleftLicenses = licenseAnalyses.filter(a => a.licenses.some(l => l.category === 'copyleft'));
        if (copyleftLicenses.length > 0) {
            riskFactors.push({
                category: 'compliance',
                description: `${copyleftLicenses.length} packages with copyleft licenses requiring compliance`,
                impact: 'high',
                likelihood: 'medium',
                riskScore: copyleftLicenses.length * 10,
                mitigation: 'Implement proper compliance procedures for license obligations'
            });
        }
        // Unknown license risks
        const unknownLicenses = licenseAnalyses.filter(a => a.licenses.length === 0);
        if (unknownLicenses.length > 0) {
            riskFactors.push({
                category: 'governance',
                description: `${unknownLicenses.length} packages with unknown or missing licenses`,
                impact: 'high',
                likelihood: 'high',
                riskScore: unknownLicenses.length * 15,
                mitigation: 'Contact package maintainers to clarify licensing or find alternatives'
            });
        }
        return riskFactors;
    }
    /**
     * Assess jurisdiction-specific risks (simplified)
     */
    assessJurisdictionRisks(licenseAnalyses) {
        const jurisdictionRisks = [];
        // Check for AGPL in jurisdictions with network copyleft concerns
        const hasAGPL = licenseAnalyses.some(a => a.licenses.some(l => l.spdxId.includes('AGPL')));
        if (hasAGPL) {
            jurisdictionRisks.push({
                jurisdiction: 'Global',
                riskLevel: license_1.LegalRiskLevel.HIGH,
                specificRisks: ['AGPL network copyleft obligations for web services']
            });
        }
        return jurisdictionRisks;
    }
    /**
     * Assess patent-related risks
     */
    assessPatentRisks(licenseAnalyses) {
        const patentRisks = [];
        for (const analysis of licenseAnalyses) {
            for (const license of analysis.licenses) {
                if (license.obligations.includes('patent_grant')) {
                    patentRisks.push({
                        license,
                        patentClauses: ['Patent grant and termination clauses'],
                        riskDescription: 'License includes patent provisions that may affect patent strategy',
                        riskLevel: license_1.LegalRiskLevel.MEDIUM
                    });
                }
            }
        }
        return patentRisks;
    }
    /**
     * Generate compliance requirements
     */
    generateComplianceRequirements(licenseAnalyses) {
        const requirements = [];
        const hasAttribution = licenseAnalyses.some(a => a.obligations.some(o => o.type === 'attribution'));
        if (hasAttribution) {
            requirements.push({
                requirement: 'Create and maintain attribution documentation',
                responsible: 'Development Team',
                status: 'pending'
            });
        }
        const hasSourceDisclosure = licenseAnalyses.some(a => a.obligations.some(o => o.type === 'disclose_source'));
        if (hasSourceDisclosure) {
            requirements.push({
                requirement: 'Implement source code disclosure procedures',
                responsible: 'Legal Team',
                status: 'pending'
            });
        }
        return requirements;
    }
    /**
     * Assess if legal review is needed
     */
    assessLegalReviewNeeds(overallRisk, riskFactors) {
        const criticalFactors = riskFactors.filter(f => f.impact === 'critical');
        const compatibilityFactors = riskFactors.filter(f => f.category === 'license_compatibility');
        let required = false;
        let urgency = 'low';
        const scope = [];
        if (overallRisk === license_1.LegalRiskLevel.CRITICAL || criticalFactors.length > 0) {
            required = true;
            urgency = 'urgent';
            scope.push('Critical risk mitigation');
        }
        if (compatibilityFactors.length > 0) {
            required = true;
            urgency = urgency === 'urgent' ? 'urgent' : 'high';
            scope.push('License compatibility analysis');
        }
        if (overallRisk === license_1.LegalRiskLevel.HIGH || overallRisk === license_1.LegalRiskLevel.VERY_HIGH) {
            required = true;
            urgency = urgency === 'urgent' ? 'urgent' : urgency === 'high' ? 'high' : 'medium';
            scope.push('General license compliance review');
        }
        return {
            required,
            urgency,
            scope,
            estimatedHours: scope.length * 4 // Rough estimate: 4 hours per scope area
        };
    }
    /**
     * Generate text format compliance document
     */
    async generateTextDocument(licenseAnalyses, options) {
        let document = '';
        if (options.customHeader) {
            document += `${options.customHeader}\n\n`;
        }
        document += 'LICENSE COMPLIANCE REPORT\n';
        document += `${'='.repeat(24)}\n\n`;
        document += `Generated: ${new Date().toISOString()}\n\n`;
        if (options.groupByLicense) {
            const licenseGroups = this.groupAnalysesByLicense(licenseAnalyses);
            for (const [licenseId, analyses] of licenseGroups) {
                document += `LICENSE: ${licenseId}\n`;
                document += `${'-'.repeat(20)}\n`;
                for (const analysis of analyses) {
                    document += `- ${analysis.package.name}@${analysis.package.version}\n`;
                }
                if (options.includeLicenseTexts && analyses[0]?.licenses[0]?.fullText) {
                    document += '\nLicense Text:\n';
                    document += `${analyses[0].licenses[0].fullText}\n`;
                }
                document += '\n';
            }
        }
        else {
            for (const analysis of licenseAnalyses) {
                document += `Package: ${analysis.package.name}@${analysis.package.version}\n`;
                document += `Licenses: ${analysis.licenses.map(l => l.spdxId).join(', ')}\n`;
                if (options.includeCopyrightNotices && analysis.copyrightStatements.length > 0) {
                    document += `Copyright: ${analysis.copyrightStatements.join('; ')}\n`;
                }
                document += '\n';
            }
        }
        if (options.customFooter) {
            document += options.customFooter;
        }
        return document;
    }
    /**
     * Generate HTML format compliance document
     */
    async generateHtmlDocument(licenseAnalyses, options) {
        let html = '<!DOCTYPE html>\n<html>\n<head>\n';
        html += '<title>License Compliance Report</title>\n';
        html += '<style>body { font-family: Arial, sans-serif; margin: 20px; }</style>\n';
        html += '</head>\n<body>\n';
        if (options.customHeader) {
            html += `${options.customHeader}\n`;
        }
        html += '<h1>License Compliance Report</h1>\n';
        html += `<p>Generated: ${new Date().toISOString()}</p>\n`;
        if (options.groupByLicense) {
            const licenseGroups = this.groupAnalysesByLicense(licenseAnalyses);
            for (const [licenseId, analyses] of licenseGroups) {
                html += `<h2>${licenseId}</h2>\n<ul>\n`;
                for (const analysis of analyses) {
                    html += `<li>${analysis.package.name}@${analysis.package.version}</li>\n`;
                }
                html += '</ul>\n';
            }
        }
        else {
            html += '<table border="1">\n<tr><th>Package</th><th>Version</th><th>License</th></tr>\n';
            for (const analysis of licenseAnalyses) {
                html += `<tr><td>${analysis.package.name}</td><td>${analysis.package.version}</td><td>${analysis.licenses.map(l => l.spdxId).join(', ')}</td></tr>\n`;
            }
            html += '</table>\n';
        }
        if (options.customFooter) {
            html += options.customFooter;
        }
        html += '</body>\n</html>';
        return html;
    }
    /**
     * Generate Markdown format compliance document
     */
    async generateMarkdownDocument(licenseAnalyses, options) {
        let markdown = '';
        if (options.customHeader) {
            markdown += `${options.customHeader}\n\n`;
        }
        markdown += '# License Compliance Report\n\n';
        markdown += `Generated: ${new Date().toISOString()}\n\n`;
        if (options.groupByLicense) {
            const licenseGroups = this.groupAnalysesByLicense(licenseAnalyses);
            for (const [licenseId, analyses] of licenseGroups) {
                markdown += `## ${licenseId}\n\n`;
                for (const analysis of analyses) {
                    markdown += `- ${analysis.package.name}@${analysis.package.version}\n`;
                }
                markdown += '\n';
            }
        }
        else {
            markdown += '| Package | Version | License |\n';
            markdown += '|---------|---------|----------|\n';
            for (const analysis of licenseAnalyses) {
                markdown += `| ${analysis.package.name} | ${analysis.package.version} | ${analysis.licenses.map(l => l.spdxId).join(', ')} |\n`;
            }
        }
        if (options.customFooter) {
            markdown += `\n${options.customFooter}`;
        }
        return markdown;
    }
    /**
     * Generate JSON format compliance document
     */
    async generateJsonDocument(licenseAnalyses, _options) {
        const report = {
            generatedAt: new Date().toISOString(),
            packages: licenseAnalyses.map(analysis => ({
                name: analysis.package.name,
                version: analysis.package.version,
                licenses: analysis.licenses.map(license => ({
                    spdxId: license.spdxId,
                    name: license.name,
                    category: license.category,
                    url: license.url
                })),
                copyrightStatements: analysis.copyrightStatements,
                riskLevel: analysis.riskLevel
            }))
        };
        return JSON.stringify(report, null, 2);
    }
    /**
     * Group license analyses by license type
     */
    groupAnalysesByLicense(licenseAnalyses) {
        const groups = new Map();
        for (const analysis of licenseAnalyses) {
            const primaryLicense = analysis.licenses[0]?.spdxId || 'Unknown';
            if (!groups.has(primaryLicense)) {
                groups.set(primaryLicense, []);
            }
            groups.get(primaryLicense).push(analysis);
        }
        return groups;
    }
}
exports.LicenseIntelligenceServiceImpl = LicenseIntelligenceServiceImpl;
/**
 * Create a license intelligence service instance
 */
function createLicenseIntelligenceService() {
    return new LicenseIntelligenceServiceImpl();
}
//# sourceMappingURL=license-intelligence.js.map