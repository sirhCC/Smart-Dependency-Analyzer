"use strict";
/**
 * License Compatibility Engine
 * Advanced license compatibility analysis with legal intelligence
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompatibilityEngine = void 0;
exports.createCompatibilityEngine = createCompatibilityEngine;
const license_1 = require("../../types/license");
const license_database_1 = require("./license-database");
const logger_1 = require("../../utils/logger");
/**
 * License compatibility matrix defining relationships between license types
 */
const COMPATIBILITY_MATRIX = {
    // MIT compatibility
    'MIT': {
        'MIT': license_1.CompatibilityLevel.COMPATIBLE,
        'Apache-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-3-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-2-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'ISC': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-2.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'LGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'LGPL-2.1-only': license_1.CompatibilityLevel.COMPATIBLE,
        'MPL-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'EPL-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'AGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'CC0-1.0': license_1.CompatibilityLevel.COMPATIBLE,
        'UNLICENSED': license_1.CompatibilityLevel.INCOMPATIBLE,
        'CC-BY-NC-4.0': license_1.CompatibilityLevel.INCOMPATIBLE
    },
    // Apache 2.0 compatibility
    'Apache-2.0': {
        'MIT': license_1.CompatibilityLevel.COMPATIBLE,
        'Apache-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-3-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-2-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-2.0-only': license_1.CompatibilityLevel.INCOMPATIBLE, // Patent clause incompatibility
        'LGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'LGPL-2.1-only': license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE,
        'MPL-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'EPL-2.0': license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE,
        'AGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'UNLICENSED': license_1.CompatibilityLevel.INCOMPATIBLE
    },
    // GPL 3.0 compatibility
    'GPL-3.0-only': {
        'MIT': license_1.CompatibilityLevel.COMPATIBLE,
        'Apache-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-3-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-2-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-2.0-only': license_1.CompatibilityLevel.INCOMPATIBLE, // Version incompatibility
        'LGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'LGPL-2.1-only': license_1.CompatibilityLevel.COMPATIBLE,
        'MPL-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'EPL-2.0': license_1.CompatibilityLevel.INCOMPATIBLE,
        'AGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'UNLICENSED': license_1.CompatibilityLevel.INCOMPATIBLE,
        'CC-BY-NC-4.0': license_1.CompatibilityLevel.INCOMPATIBLE
    },
    // GPL 2.0 compatibility
    'GPL-2.0-only': {
        'MIT': license_1.CompatibilityLevel.COMPATIBLE,
        'Apache-2.0': license_1.CompatibilityLevel.INCOMPATIBLE,
        'BSD-3-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-2-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-2.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-3.0-only': license_1.CompatibilityLevel.INCOMPATIBLE,
        'LGPL-2.1-only': license_1.CompatibilityLevel.COMPATIBLE,
        'LGPL-3.0-only': license_1.CompatibilityLevel.INCOMPATIBLE,
        'MPL-2.0': license_1.CompatibilityLevel.INCOMPATIBLE,
        'EPL-2.0': license_1.CompatibilityLevel.INCOMPATIBLE,
        'UNLICENSED': license_1.CompatibilityLevel.INCOMPATIBLE
    },
    // LGPL compatibility (more permissive than GPL)
    'LGPL-3.0-only': {
        'MIT': license_1.CompatibilityLevel.COMPATIBLE,
        'Apache-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-3-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-2.0-only': license_1.CompatibilityLevel.INCOMPATIBLE,
        'LGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'LGPL-2.1-only': license_1.CompatibilityLevel.COMPATIBLE,
        'MPL-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'UNLICENSED': license_1.CompatibilityLevel.INCOMPATIBLE
    },
    // MPL 2.0 compatibility
    'MPL-2.0': {
        'MIT': license_1.CompatibilityLevel.COMPATIBLE,
        'Apache-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'BSD-3-Clause': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'GPL-2.0-only': license_1.CompatibilityLevel.INCOMPATIBLE,
        'LGPL-3.0-only': license_1.CompatibilityLevel.COMPATIBLE,
        'MPL-2.0': license_1.CompatibilityLevel.COMPATIBLE,
        'EPL-2.0': license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE,
        'UNLICENSED': license_1.CompatibilityLevel.INCOMPATIBLE
    },
    // Proprietary/UNLICENSED
    'UNLICENSED': {
        'MIT': license_1.CompatibilityLevel.INCOMPATIBLE,
        'Apache-2.0': license_1.CompatibilityLevel.INCOMPATIBLE,
        'GPL-3.0-only': license_1.CompatibilityLevel.INCOMPATIBLE,
        'GPL-2.0-only': license_1.CompatibilityLevel.INCOMPATIBLE,
        'UNLICENSED': license_1.CompatibilityLevel.REQUIRES_REVIEW
    }
};
/**
 * Advanced license compatibility engine
 */
class CompatibilityEngine {
    licenseDb = (0, license_database_1.getLicenseDatabase)();
    /**
     * Analyze compatibility between two licenses
     */
    async checkCompatibility(license1, license2) {
        logger_1.logger.info(`🔍 Checking compatibility: ${license1.spdxId} vs ${license2.spdxId}`);
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
    async generateCompatibilityReport(packages, licenseAnalyses, options = this.getDefaultOptions()) {
        const startTime = Date.now();
        logger_1.logger.info(`🔍 Generating compatibility report for ${packages.length} packages`);
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
            const report = {
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
            logger_1.logger.info(`✅ Compatibility report generated in ${scanDuration}ms`);
            return report;
        }
        catch (error) {
            logger_1.logger.error('Compatibility analysis failed:', error);
            throw new Error(`Compatibility analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Get compatibility level between two licenses
     */
    getCompatibilityLevel(spdxId1, spdxId2) {
        // Check direct compatibility
        const direct = COMPATIBILITY_MATRIX[spdxId1]?.[spdxId2];
        if (direct)
            return direct;
        // Check reverse compatibility
        const reverse = COMPATIBILITY_MATRIX[spdxId2]?.[spdxId1];
        if (reverse)
            return reverse;
        // Fallback to category-based compatibility
        const license1 = this.licenseDb.getLicense(spdxId1);
        const license2 = this.licenseDb.getLicense(spdxId2);
        if (!license1 || !license2)
            return license_1.CompatibilityLevel.UNKNOWN;
        return this.getCategoryCompatibility(license1.category, license2.category);
    }
    /**
     * Get compatibility based on license categories
     */
    getCategoryCompatibility(category1, category2) {
        // Permissive licenses are generally compatible with everything
        if (category1 === license_1.LicenseCategory.PERMISSIVE || category2 === license_1.LicenseCategory.PERMISSIVE) {
            if (category1 === license_1.LicenseCategory.PROPRIETARY || category2 === license_1.LicenseCategory.PROPRIETARY) {
                return license_1.CompatibilityLevel.INCOMPATIBLE;
            }
            return license_1.CompatibilityLevel.COMPATIBLE;
        }
        // Copyleft compatibility
        if (category1 === license_1.LicenseCategory.COPYLEFT && category2 === license_1.LicenseCategory.COPYLEFT) {
            return license_1.CompatibilityLevel.REQUIRES_REVIEW; // Same copyleft might be compatible
        }
        if (category1 === license_1.LicenseCategory.COPYLEFT || category2 === license_1.LicenseCategory.COPYLEFT) {
            return license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE;
        }
        // Proprietary licenses
        if (category1 === license_1.LicenseCategory.PROPRIETARY || category2 === license_1.LicenseCategory.PROPRIETARY) {
            return license_1.CompatibilityLevel.INCOMPATIBLE;
        }
        // Public domain is compatible with everything
        if (category1 === license_1.LicenseCategory.PUBLIC_DOMAIN || category2 === license_1.LicenseCategory.PUBLIC_DOMAIN) {
            return license_1.CompatibilityLevel.COMPATIBLE;
        }
        // Default case
        return license_1.CompatibilityLevel.REQUIRES_REVIEW;
    }
    /**
     * Generate human-readable explanation of compatibility
     */
    generateExplanation(license1, license2, compatibility) {
        const l1Name = license1.name;
        const l2Name = license2.name;
        switch (compatibility) {
            case license_1.CompatibilityLevel.COMPATIBLE:
                return `${l1Name} and ${l2Name} are fully compatible and can be used together without restrictions.`;
            case license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE:
                return `${l1Name} and ${l2Name} can be used together under certain conditions. Review the specific terms and obligations.`;
            case license_1.CompatibilityLevel.INCOMPATIBLE:
                return `${l1Name} and ${l2Name} are incompatible and cannot be legally combined in the same project.`;
            case license_1.CompatibilityLevel.REQUIRES_REVIEW:
                return `The compatibility between ${l1Name} and ${l2Name} requires legal review to determine if they can be used together.`;
            case license_1.CompatibilityLevel.UNKNOWN:
                return `The compatibility between ${l1Name} and ${l2Name} cannot be determined automatically. Legal review is recommended.`;
            default:
                return `Compatibility status unknown between ${l1Name} and ${l2Name}.`;
        }
    }
    /**
     * Get compatibility conditions for compatibility
     */
    getCompatibilityConditions(license1, license2, compatibility) {
        if (compatibility !== license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE)
            return undefined;
        const conditions = [];
        // Check for copyleft obligations
        if (license1.category === license_1.LicenseCategory.COPYLEFT || license2.category === license_1.LicenseCategory.COPYLEFT) {
            conditions.push('Must comply with copyleft obligations of the stricter license');
            conditions.push('May need to release entire work under compatible copyleft license');
        }
        // Check for attribution requirements
        if (license1.obligations.includes('attribution') || license2.obligations.includes('attribution')) {
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
    getCompatibilityWarnings(license1, license2, compatibility) {
        const warnings = [];
        if (compatibility === license_1.CompatibilityLevel.INCOMPATIBLE) {
            warnings.push('These licenses cannot be legally combined');
            warnings.push('Consider removing one of the dependencies or finding alternatives');
        }
        if (compatibility === license_1.CompatibilityLevel.REQUIRES_REVIEW) {
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
    getCompatibilityRecommendations(_license1, _license2, compatibility) {
        const recommendations = [];
        if (compatibility === license_1.CompatibilityLevel.INCOMPATIBLE) {
            recommendations.push('Find alternative dependencies with compatible licenses');
            recommendations.push('Consider dual-licensing if you control one of the components');
            recommendations.push('Seek legal counsel for specific use case guidance');
        }
        if (compatibility === license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE) {
            recommendations.push('Document the specific conditions that must be met');
            recommendations.push('Implement compliance procedures for license obligations');
            recommendations.push('Consider the long-term implications of license obligations');
        }
        return recommendations.length > 0 ? recommendations : undefined;
    }
    /**
     * Assess compatibility risk level
     */
    assessCompatibilityRisk(_license1, _license2, compatibility) {
        switch (compatibility) {
            case license_1.CompatibilityLevel.COMPATIBLE:
                return license_1.LegalRiskLevel.VERY_LOW;
            case license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE:
                return license_1.LegalRiskLevel.MEDIUM;
            case license_1.CompatibilityLevel.INCOMPATIBLE:
                return license_1.LegalRiskLevel.CRITICAL;
            case license_1.CompatibilityLevel.REQUIRES_REVIEW:
                return license_1.LegalRiskLevel.HIGH;
            case license_1.CompatibilityLevel.UNKNOWN:
                return license_1.LegalRiskLevel.VERY_HIGH;
            default:
                return license_1.LegalRiskLevel.HIGH;
        }
    }
    /**
     * Extract unique licenses from analysis results
     */
    extractUniqueLicenses(licenseAnalyses) {
        const licenseMap = new Map();
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
    async buildCompatibilityMatrix(licenses) {
        const matrix = [];
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
    determineOverallCompatibility(matrix) {
        if (matrix.length === 0)
            return license_1.CompatibilityLevel.COMPATIBLE;
        const incompatible = matrix.some(m => m.compatibility === license_1.CompatibilityLevel.INCOMPATIBLE);
        if (incompatible)
            return license_1.CompatibilityLevel.INCOMPATIBLE;
        const requiresReview = matrix.some(m => m.compatibility === license_1.CompatibilityLevel.REQUIRES_REVIEW);
        if (requiresReview)
            return license_1.CompatibilityLevel.REQUIRES_REVIEW;
        const conditional = matrix.some(m => m.compatibility === license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE);
        if (conditional)
            return license_1.CompatibilityLevel.CONDITIONALLY_COMPATIBLE;
        const unknown = matrix.some(m => m.compatibility === license_1.CompatibilityLevel.UNKNOWN);
        if (unknown)
            return license_1.CompatibilityLevel.UNKNOWN;
        return license_1.CompatibilityLevel.COMPATIBLE;
    }
    /**
     * Find highest risk level in compatibility matrix
     */
    findHighestRiskLevel(matrix) {
        if (matrix.length === 0)
            return license_1.LegalRiskLevel.VERY_LOW;
        const riskLevels = matrix.map(m => m.riskLevel);
        if (riskLevels.includes(license_1.LegalRiskLevel.CRITICAL))
            return license_1.LegalRiskLevel.CRITICAL;
        if (riskLevels.includes(license_1.LegalRiskLevel.VERY_HIGH))
            return license_1.LegalRiskLevel.VERY_HIGH;
        if (riskLevels.includes(license_1.LegalRiskLevel.HIGH))
            return license_1.LegalRiskLevel.HIGH;
        if (riskLevels.includes(license_1.LegalRiskLevel.MEDIUM))
            return license_1.LegalRiskLevel.MEDIUM;
        if (riskLevels.includes(license_1.LegalRiskLevel.LOW))
            return license_1.LegalRiskLevel.LOW;
        return license_1.LegalRiskLevel.VERY_LOW;
    }
    /**
     * Identify license conflicts
     */
    identifyConflicts(licenses, matrix) {
        const conflicts = [];
        const licenseMap = new Map(licenses.map(l => [l.spdxId, l]));
        for (const entry of matrix) {
            if (entry.compatibility === license_1.CompatibilityLevel.INCOMPATIBLE) {
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
    calculateProjectObligations(licenseAnalyses) {
        const obligationMap = new Map();
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
    generateRecommendations(conflicts, licenses, _options) {
        const recommendations = [];
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
        const hasProprietaryFriendly = licenses.some(l => l.category === license_1.LicenseCategory.PERMISSIVE);
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
    calculateSummaryStatistics(packages, licenseAnalyses, matrix) {
        const uniqueLicenses = new Set();
        let unknownLicensePackages = 0;
        for (const analysis of licenseAnalyses) {
            if (analysis.licenses.length === 0) {
                unknownLicensePackages++;
            }
            else {
                for (const license of analysis.licenses) {
                    uniqueLicenses.add(license.spdxId);
                }
            }
        }
        const incompatiblePairs = matrix.filter(m => m.compatibility === license_1.CompatibilityLevel.INCOMPATIBLE).length;
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
    getDefaultOptions() {
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
exports.CompatibilityEngine = CompatibilityEngine;
/**
 * Create a compatibility engine instance
 */
function createCompatibilityEngine() {
    return new CompatibilityEngine();
}
//# sourceMappingURL=compatibility-engine.js.map