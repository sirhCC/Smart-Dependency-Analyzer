"use strict";
/**
 * Enhanced AI Engine with Advanced Malicious Pattern Detection
 *
 * This enhanced version incorporates proven manual detection patterns
 * to dramatically improve malicious package detection accuracy.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedAIEngine = void 0;
const logger_1 = require("../../utils/logger");
const types_1 = require("../../types");
const logger = (0, logger_1.getLogger)('EnhancedAIEngine');
/**
 * Enhanced AI Engine with advanced malicious pattern detection
 */
class EnhancedAIEngine {
    constructor(_config = {}) {
        logger.info('🛡️ Initializing Enhanced AI Engine with advanced threat detection');
    }
    /**
     * Enhanced vulnerability prediction with malicious pattern detection
     */
    async predictVulnerabilities(packages) {
        logger.info(`🕵️ Analyzing ${packages.length} packages for vulnerabilities and malicious patterns`);
        const predictions = [];
        for (const pkg of packages) {
            const prediction = await this.analyzePackageForThreats(pkg);
            predictions.push(prediction);
        }
        logger.info(`✅ Generated ${predictions.length} enhanced vulnerability predictions`);
        return predictions;
    }
    /**
     * Comprehensive threat analysis for a single package
     */
    async analyzePackageForThreats(pkg) {
        const risks = [];
        const preventiveMeasures = [];
        let riskScore = 20; // Base risk score
        let confidence = 0.8;
        // 1. Analyze install scripts for malicious patterns
        const scriptRisk = this.analyzeScripts(pkg);
        riskScore += scriptRisk.score;
        risks.push(...scriptRisk.factors);
        preventiveMeasures.push(...scriptRisk.mitigations);
        // 2. Analyze author and maintainer patterns
        const authorRisk = this.analyzeAuthors(pkg);
        riskScore += authorRisk.score;
        risks.push(...authorRisk.factors);
        preventiveMeasures.push(...authorRisk.mitigations);
        // 3. Check for typosquatting
        const typosquatRisk = this.analyzeTyposquatting(pkg);
        riskScore += typosquatRisk.score;
        risks.push(...typosquatRisk.factors);
        preventiveMeasures.push(...typosquatRisk.mitigations);
        // 4. Analyze package metadata for suspicious patterns
        const metadataRisk = this.analyzeMetadata(pkg);
        riskScore += metadataRisk.score;
        risks.push(...metadataRisk.factors);
        preventiveMeasures.push(...metadataRisk.mitigations);
        // 5. Check for dependency injection attacks
        const dependencyRisk = this.analyzeDependencies(pkg);
        riskScore += dependencyRisk.score;
        risks.push(...dependencyRisk.factors);
        preventiveMeasures.push(...dependencyRisk.mitigations);
        // 6. Advanced ML analysis (original AI logic)
        const mlRisk = this.performMLAnalysis(pkg);
        riskScore += mlRisk.score * 0.3; // Weight ML analysis less than pattern matching
        // Normalize risk score (0-100)
        riskScore = Math.min(100, Math.max(0, riskScore));
        // Adjust confidence based on number of risk factors
        if (risks.length > 5)
            confidence = 0.95;
        else if (risks.length > 3)
            confidence = 0.90;
        else if (risks.length > 1)
            confidence = 0.85;
        // Determine severity
        let severity = types_1.VulnerabilitySeverity.LOW;
        if (riskScore >= 80)
            severity = types_1.VulnerabilitySeverity.CRITICAL;
        else if (riskScore >= 60)
            severity = types_1.VulnerabilitySeverity.HIGH;
        else if (riskScore >= 40)
            severity = types_1.VulnerabilitySeverity.MEDIUM;
        return {
            packageName: pkg.name,
            packageVersion: pkg.version,
            predictedSeverity: severity,
            confidence,
            reasoningFactors: risks.length > 0 ? risks : ['Standard security analysis completed'],
            estimatedTimeframe: riskScore > 70 ? 1 : 30, // High risk = immediate concern
            preventiveMeasures: preventiveMeasures.length > 0 ? preventiveMeasures : ['Regular security updates recommended'],
            riskScore,
        };
    }
    /**
     * Analyze package scripts for malicious patterns
     */
    analyzeScripts(pkg) {
        const factors = [];
        const mitigations = [];
        let score = 0;
        if (!pkg.scripts) {
            return { score, factors, mitigations };
        }
        const dangerousPatterns = [
            { pattern: /curl\s+.*https?:\/\/[^\/]*(?:evil|malicious|steal|hack|attack)/i, score: 40, description: 'Suspicious external HTTP request' },
            { pattern: /wget\s+.*https?:\/\/[^\/]*(?:evil|malicious|steal|hack|attack)/i, score: 40, description: 'Suspicious external download' },
            { pattern: /child_process|exec\(|spawn\(/i, score: 25, description: 'Executes system commands' },
            { pattern: /process\.env/i, score: 20, description: 'Accesses environment variables' },
            { pattern: /steal|mining|mine|hack|backdoor|malicious/i, score: 35, description: 'Contains suspicious keywords' },
            { pattern: /rm\s+-rf|rmdir\s+\/|del\s+\/s/i, score: 30, description: 'Destructive file operations' },
            { pattern: /eval\(|Function\(/i, score: 25, description: 'Dynamic code execution' },
            { pattern: /require\(['"]https?:/i, score: 30, description: 'Remote code loading' },
            { pattern: /\$\(.*\)|`.*`/i, score: 15, description: 'Command substitution' },
            { pattern: /base64|atob|btoa/i, score: 15, description: 'Encoded data handling' }
        ];
        const suspiciousScripts = ['postinstall', 'preinstall', 'install', 'prestart', 'start'];
        Object.entries(pkg.scripts).forEach(([scriptName, scriptContent]) => {
            const isLifecycleScript = suspiciousScripts.includes(scriptName);
            dangerousPatterns.forEach(({ pattern, score: patternScore, description }) => {
                if (pattern.test(scriptContent)) {
                    const adjustedScore = isLifecycleScript ? patternScore * 1.5 : patternScore; // Lifecycle scripts are more dangerous
                    score += adjustedScore;
                    factors.push(`Dangerous ${scriptName} script: ${description}`);
                    if (adjustedScore >= 30) {
                        mitigations.push(`Review and sandbox ${scriptName} script execution`);
                    }
                }
            });
            // Check for obfuscated scripts
            if (scriptContent.length > 200 && /[^a-zA-Z0-9\s\-_\.\(\)='"\/]/.test(scriptContent)) {
                score += 25;
                factors.push(`Potentially obfuscated ${scriptName} script`);
                mitigations.push('Manually review script for obfuscated code');
            }
        });
        return { score, factors, mitigations };
    }
    /**
     * Analyze author and maintainer patterns for suspicious activity
     */
    analyzeAuthors(pkg) {
        const factors = [];
        const mitigations = [];
        let score = 0;
        // Analyze author
        if (pkg.author) {
            const suspiciousEmailPatterns = [
                /(?:temp|temporary|fake|evil|steal|hack|malicious|anon|anonymous).*@/i,
                /.*@(?:tempmail|10minute|guerrilla|mailinator|evil|steal|hack).*\./i,
                /@protonmail\.com$/i, // Often used by attackers for anonymity
                /@gmail\.com$/i, // Combined with suspicious names
            ];
            const suspiciousNamePatterns = [
                /(?:fake|evil|steal|hack|malicious|anon|anonymous|attacker|miner|crypto.*miner)/i,
                /(?:new|temp).*(?:2023|2024|2025)/i, // Recent accounts
                /^[a-z]+\d+$/i, // Simple name + number pattern
            ];
            suspiciousEmailPatterns.forEach(pattern => {
                if (pkg.author?.email && pattern.test(pkg.author.email)) {
                    score += 30;
                    factors.push(`Suspicious author email pattern: ${pkg.author.email}`);
                    mitigations.push('Verify author authenticity through official channels');
                }
            });
            suspiciousNamePatterns.forEach(pattern => {
                if (pkg.author?.name && pattern.test(pkg.author.name)) {
                    score += 25;
                    factors.push(`Suspicious author name pattern: ${pkg.author.name}`);
                    mitigations.push('Research author reputation and history');
                }
            });
        }
        // Analyze maintainers
        if (pkg.maintainers && pkg.maintainers.length > 0) {
            const suspiciousMaintainers = pkg.maintainers.filter(maintainer => {
                return (maintainer.email?.includes('temp') ||
                    maintainer.email?.includes('new') ||
                    maintainer.email?.includes('anon') ||
                    maintainer.name?.includes('2023') ||
                    maintainer.name?.includes('2024') ||
                    maintainer.name?.includes('new-'));
            });
            if (suspiciousMaintainers.length > 0) {
                score += 20 * suspiciousMaintainers.length;
                factors.push(`${suspiciousMaintainers.length} suspicious maintainer(s) detected`);
                mitigations.push('Verify all maintainer accounts are legitimate');
            }
            // Check for recently added maintainers (simulate based on naming patterns)
            const recentMaintainers = pkg.maintainers.filter(m => m.name?.match(/(?:new|recent|2023|2024|2025)/i));
            if (recentMaintainers.length > 0) {
                score += 15;
                factors.push('Recently added maintainers detected');
                mitigations.push('Monitor new maintainer activity closely');
            }
        }
        return { score, factors, mitigations };
    }
    /**
     * Check for typosquatting attacks
     */
    analyzeTyposquatting(pkg) {
        const factors = [];
        const mitigations = [];
        let score = 0;
        const popularPackages = [
            'react', 'lodash', 'axios', 'express', 'moment', 'colors', 'chalk', 'commander',
            'request', 'underscore', 'jquery', 'bootstrap', 'angular', 'vue', 'typescript',
            'webpack', 'babel', 'eslint', 'prettier', 'jest', 'mocha', 'sinon', 'karma'
        ];
        popularPackages.forEach(popular => {
            if (pkg.name !== popular) {
                const distance = this.levenshteinDistance(pkg.name, popular);
                // Check for close matches (1-2 character differences)
                if (distance <= 2 && distance > 0) {
                    score += 40 - (distance * 10); // Closer = higher score
                    factors.push(`Potential typosquatting of popular package: ${popular} (distance: ${distance})`);
                    mitigations.push(`Verify this is not a typosquat of ${popular}`);
                }
                // Check for character substitution attacks
                if (this.hasCharacterSubstitution(pkg.name, popular)) {
                    score += 35;
                    factors.push(`Possible character substitution attack targeting: ${popular}`);
                    mitigations.push(`Compare carefully with legitimate ${popular} package`);
                }
            }
        });
        return { score, factors, mitigations };
    }
    /**
     * Analyze package metadata for suspicious patterns
     */
    analyzeMetadata(pkg) {
        const factors = [];
        const mitigations = [];
        let score = 0;
        // Check description for suspicious content
        if (pkg.description) {
            const suspiciousDescWords = [
                'steal', 'mining', 'crypto', 'backdoor', 'hack', 'exploit', 'malicious',
                'credentials', 'tokens', 'passwords', 'keylogger', 'botnet'
            ];
            suspiciousDescWords.forEach(word => {
                if (pkg.description?.toLowerCase().includes(word)) {
                    score += 20;
                    factors.push(`Suspicious keyword in description: ${word}`);
                    mitigations.push('Carefully review package functionality claims');
                }
            });
        }
        // Check for suspicious keywords
        if (pkg.keywords) {
            const suspiciousKeywords = ['mining', 'steal', 'hack', 'exploit', 'malicious', 'backdoor'];
            const foundSuspicious = pkg.keywords.filter(kw => suspiciousKeywords.some(suspicious => kw.toLowerCase().includes(suspicious)));
            if (foundSuspicious.length > 0) {
                score += 25;
                factors.push(`Suspicious keywords: ${foundSuspicious.join(', ')}`);
                mitigations.push('Question why package includes suspicious keywords');
            }
        }
        // Check download count vs. age (new packages with high downloads are suspicious)
        if (pkg.downloadCount && pkg.publishedAt) {
            const ageInDays = (Date.now() - pkg.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
            const downloadsPerDay = pkg.downloadCount / Math.max(ageInDays, 1);
            // Very high download rate for new packages
            if (ageInDays < 30 && downloadsPerDay > 1000) {
                score += 20;
                factors.push('Unusually high download rate for new package');
                mitigations.push('Investigate sudden popularity increase');
            }
        }
        // Check repository URL
        if (pkg.repository?.url) {
            const suspiciousRepoPatterns = [
                /github\.com\/(?:fake|evil|steal|hack|malicious|attacker|typosquat)/i,
                /(?:evil|steal|hack|malicious).*\.git$/i,
            ];
            suspiciousRepoPatterns.forEach(pattern => {
                if (pattern.test(pkg.repository.url)) {
                    score += 30;
                    factors.push('Suspicious repository URL pattern');
                    mitigations.push('Verify repository legitimacy');
                }
            });
        }
        return { score, factors, mitigations };
    }
    /**
     * Analyze dependencies for malicious injection patterns
     */
    analyzeDependencies(pkg) {
        const factors = [];
        const mitigations = [];
        let score = 0;
        if (!pkg.dependencies) {
            return { score, factors, mitigations };
        }
        const suspiciousDependencies = [
            'malicious', 'evil', 'steal', 'hack', 'backdoor', 'mining', 'crypto-miner',
            'data-collector', 'analytics', 'tracker', 'keylogger', 'botnet'
        ];
        Array.from(pkg.dependencies.keys()).forEach(depName => {
            suspiciousDependencies.forEach(suspicious => {
                if (depName.toLowerCase().includes(suspicious)) {
                    score += 35;
                    factors.push(`Suspicious dependency: ${depName}`);
                    mitigations.push(`Investigate dependency: ${depName}`);
                }
            });
        });
        return { score, factors, mitigations };
    }
    /**
     * Original ML-based analysis (simplified for demonstration)
     */
    performMLAnalysis(pkg) {
        // Simulate ML analysis - in real implementation, this would use trained models
        let score = 20; // Base ML score
        // Factor in package age
        if (pkg.publishedAt) {
            const ageInDays = (Date.now() - pkg.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (ageInDays < 30)
                score += 10; // New packages are riskier
        }
        // Factor in popularity
        if (pkg.downloadCount) {
            if (pkg.downloadCount < 1000)
                score += 15; // Unpopular packages are riskier
            if (pkg.downloadCount > 10000000)
                score -= 10; // Very popular packages are generally safer
        }
        return { score };
    }
    /**
     * Calculate Levenshtein distance between two strings
     */
    levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));
        for (let i = 0; i <= str1.length; i += 1) {
            matrix[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            matrix[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, // deletion
                matrix[j - 1][i] + 1, // insertion
                matrix[j - 1][i - 1] + indicator // substitution
                );
            }
        }
        return matrix[str2.length][str1.length];
    }
    /**
     * Check for character substitution attacks (e.g., 'lodash' vs 'l0dash')
     */
    hasCharacterSubstitution(str1, str2) {
        if (Math.abs(str1.length - str2.length) > 0)
            return false;
        const substitutions = [
            ['0', 'o'], ['1', 'l'], ['1', 'i'], ['5', 's'], ['3', 'e'], ['@', 'a'],
            ['rn', 'm'], ['vv', 'w'], ['cl', 'd']
        ];
        for (const [char1, char2] of substitutions) {
            const modified = str2.replace(new RegExp(char2, 'g'), char1);
            if (modified === str1)
                return true;
        }
        return false;
    }
    /**
     * Generate enhanced recommendations with security focus
     */
    async generateRecommendations(packages) {
        const recommendations = [];
        for (const pkg of packages) {
            const prediction = await this.analyzePackageForThreats(pkg);
            if (prediction.riskScore > 70) {
                recommendations.push({
                    type: 'removal',
                    currentPackage: pkg.name,
                    recommendedAction: `CRITICAL: Remove ${pkg.name} immediately - high risk of malicious activity detected`,
                    confidence: prediction.confidence,
                    benefits: ['Eliminates security risk', 'Protects sensitive data', 'Prevents system compromise'],
                    risks: ['May break functionality that depends on this package'],
                    estimatedEffort: 'high',
                    priority: 'critical',
                });
            }
            else if (prediction.riskScore > 50) {
                recommendations.push({
                    type: 'security-patch',
                    currentPackage: pkg.name,
                    recommendedAction: `WARNING: Monitor ${pkg.name} closely and consider alternatives`,
                    confidence: prediction.confidence,
                    benefits: ['Reduces security risk', 'Maintains functionality'],
                    risks: ['Potential security vulnerabilities remain'],
                    estimatedEffort: 'medium',
                    priority: 'high',
                });
            }
        }
        logger.info(`Generated ${recommendations.length} security-focused recommendations`);
        return recommendations;
    }
    /**
     * Enhanced predictive analytics (simplified implementation)
     */
    async performPredictiveAnalytics(packages) {
        const highRiskPackages = packages.filter(async (pkg) => {
            const prediction = await this.analyzePackageForThreats(pkg);
            return prediction.riskScore > 60;
        });
        const projectHealthScore = Math.max(0, 100 - (highRiskPackages.length * 20));
        return {
            projectHealthScore,
            trendAnalysis: {
                vulnerabilityTrend: highRiskPackages.length > 2 ? 'degrading' : 'stable',
                maintenanceTrend: 'stable',
                securityTrend: highRiskPackages.length > 1 ? 'degrading' : 'improving',
                projectedScore6Months: projectHealthScore - 5,
                projectedScore12Months: projectHealthScore - 10,
            },
            riskFactors: [],
            recommendations: [],
            futureVulnerabilities: [],
            dependencyLifecycle: [],
        };
    }
}
exports.EnhancedAIEngine = EnhancedAIEngine;
//# sourceMappingURL=enhanced-ai-engine.js.map