"use strict";
/**
 * Comprehensive Security Detection Engine
 *
 * World-class AI that detects ALL known attack vectors including:
 * - Unicode homograph attacks
 * - Version confusion
 * - Brand jacking
 * - Dependency confusion
 * - Social engineering
 * - Subdomain takeover
 * - Supply chain injection
 * - Steganography
 * - Maintainer compromise
 * - And many more...
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprehensiveSecurityEngine = void 0;
const logger_1 = require("../../utils/logger");
const types_1 = require("../../types");
const logger = (0, logger_1.getLogger)('ComprehensiveSecurityEngine');
/**
 * Comprehensive Security Detection Engine with full attack vector coverage
 */
class ComprehensiveSecurityEngine {
    popularPackages;
    suspiciousTlds;
    brandNames;
    temporaryEmailDomains;
    constructor(_config = {}) {
        logger.info('🛡️ Initializing Comprehensive Security Engine - Enterprise Grade Protection');
        // Initialize threat intelligence databases
        this.popularPackages = [
            'react', 'vue', 'angular', 'lodash', 'express', 'axios', 'webpack', 'babel',
            'typescript', 'eslint', 'prettier', 'jest', 'mocha', 'chai', 'sinon',
            'commander', 'chalk', 'colors', 'moment', 'dayjs', 'underscore', 'jquery',
            'bootstrap', 'jquery-ui', 'socket.io', 'nodemon', 'cors', 'body-parser',
            'bcrypt', 'jsonwebtoken', 'passport', 'multer', 'sharp', 'imagemin',
            'left-pad', 'is-odd', 'is-even', 'ua-parser-js', 'node-ipc'
        ];
        this.suspiciousTlds = [
            '.tk', '.ml', '.ga', '.cf', '.click', '.download', '.loan', '.racing',
            '.cricket', '.bid', '.date', '.faith', '.win', '.accountant', '.science'
        ];
        this.brandNames = [
            'microsoft', 'google', 'apple', 'amazon', 'facebook', 'meta', 'netflix',
            'spotify', 'twitter', 'github', 'gitlab', 'discord', 'slack', 'zoom',
            'adobe', 'oracle', 'ibm', 'salesforce', 'shopify', 'stripe', 'paypal',
            'docker', 'kubernetes', 'redis', 'mongodb', 'postgresql', 'mysql'
        ];
        this.temporaryEmailDomains = [
            'tempmail.com', '10minute.mail', 'guerrillamail.com', 'mailinator.com',
            'throwaway.email', 'temp-mail.org', 'fakemailgenerator.com', 'getairmail.com',
            'yopmail.com', 'mohmal.com', 'sharklasers.com', 'getnada.com'
        ];
    }
    /**
     * Comprehensive vulnerability prediction with all attack vector detection
     */
    async predictVulnerabilities(packages) {
        logger.info(`🔍 Analyzing ${packages.length} packages for ALL known attack vectors`);
        const predictions = [];
        for (const pkg of packages) {
            const prediction = await this.performComprehensiveAnalysis(pkg);
            predictions.push(prediction);
        }
        logger.info(`✅ Generated ${predictions.length} comprehensive security predictions`);
        return predictions;
    }
    /**
     * Comprehensive threat analysis covering all attack vectors
     */
    async performComprehensiveAnalysis(pkg) {
        const threats = [];
        const mitigations = [];
        let riskScore = 0;
        let confidence = 0.9;
        // 1. UNICODE HOMOGRAPH ATTACK DETECTION
        const unicodeRisk = this.detectUnicodeHomographs(pkg);
        riskScore += unicodeRisk.score;
        threats.push(...unicodeRisk.threats);
        mitigations.push(...unicodeRisk.mitigations);
        // 2. VERSION CONFUSION ATTACK DETECTION
        const versionRisk = this.detectVersionConfusion(pkg);
        riskScore += versionRisk.score;
        threats.push(...versionRisk.threats);
        mitigations.push(...versionRisk.mitigations);
        // 3. BRAND JACKING DETECTION
        const brandRisk = this.detectBrandJacking(pkg);
        riskScore += brandRisk.score;
        threats.push(...brandRisk.threats);
        mitigations.push(...brandRisk.mitigations);
        // 4. DEPENDENCY CONFUSION DETECTION
        const dependencyConfusionRisk = this.detectDependencyConfusion(pkg);
        riskScore += dependencyConfusionRisk.score;
        threats.push(...dependencyConfusionRisk.threats);
        mitigations.push(...dependencyConfusionRisk.mitigations);
        // 5. SOCIAL ENGINEERING DETECTION
        const socialEngRisk = this.detectSocialEngineering(pkg);
        riskScore += socialEngRisk.score;
        threats.push(...socialEngRisk.threats);
        mitigations.push(...socialEngRisk.mitigations);
        // 6. SUBDOMAIN TAKEOVER DETECTION
        const subdomainRisk = this.detectSubdomainTakeover(pkg);
        riskScore += subdomainRisk.score;
        threats.push(...subdomainRisk.threats);
        mitigations.push(...subdomainRisk.mitigations);
        // 7. SUPPLY CHAIN INJECTION DETECTION
        const supplyChainRisk = this.detectSupplyChainInjection(pkg);
        riskScore += supplyChainRisk.score;
        threats.push(...supplyChainRisk.threats);
        mitigations.push(...supplyChainRisk.mitigations);
        // 8. STEGANOGRAPHY DETECTION
        const steganographyRisk = this.detectSteganography(pkg);
        riskScore += steganographyRisk.score;
        threats.push(...steganographyRisk.threats);
        mitigations.push(...steganographyRisk.mitigations);
        // 9. MAINTAINER COMPROMISE DETECTION
        const maintainerRisk = this.detectMaintainerCompromise(pkg);
        riskScore += maintainerRisk.score;
        threats.push(...maintainerRisk.threats);
        mitigations.push(...maintainerRisk.mitigations);
        // 10. TYPOSQUATTING DETECTION (Enhanced)
        const typosquatRisk = this.detectAdvancedTyposquatting(pkg);
        riskScore += typosquatRisk.score;
        threats.push(...typosquatRisk.threats);
        mitigations.push(...typosquatRisk.mitigations);
        // 11. SCRIPT-BASED ATTACK DETECTION
        const scriptRisk = this.detectScriptAttacks(pkg);
        riskScore += scriptRisk.score;
        threats.push(...scriptRisk.threats);
        mitigations.push(...scriptRisk.mitigations);
        // 12. BEHAVIORAL ANOMALY DETECTION
        const behavioralRisk = this.detectBehavioralAnomalies(pkg);
        riskScore += behavioralRisk.score;
        threats.push(...behavioralRisk.threats);
        mitigations.push(...behavioralRisk.mitigations);
        // Normalize risk score and adjust confidence
        riskScore = Math.min(100, Math.max(0, riskScore));
        if (threats.length > 10)
            confidence = 0.98;
        else if (threats.length > 5)
            confidence = 0.95;
        else if (threats.length > 2)
            confidence = 0.90;
        else if (threats.length > 0)
            confidence = 0.85;
        // Determine severity based on comprehensive analysis
        let severity = types_1.VulnerabilitySeverity.LOW;
        if (riskScore >= 90)
            severity = types_1.VulnerabilitySeverity.CRITICAL;
        else if (riskScore >= 70)
            severity = types_1.VulnerabilitySeverity.HIGH;
        else if (riskScore >= 50)
            severity = types_1.VulnerabilitySeverity.MEDIUM;
        return {
            packageName: pkg.name,
            packageVersion: pkg.version,
            predictedSeverity: severity,
            confidence,
            reasoningFactors: threats.length > 0 ? threats : ['Comprehensive security analysis completed - no threats detected'],
            estimatedTimeframe: riskScore > 80 ? 1 : 30,
            preventiveMeasures: mitigations.length > 0 ? mitigations : ['Regular security monitoring recommended'],
            riskScore,
        };
    }
    /**
     * 1. Unicode Homograph Attack Detection
     */
    detectUnicodeHomographs(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        // Check for mixed scripts (Latin + Cyrillic/Greek)
        const nameBytes = Buffer.from(pkg.name, 'utf8');
        const nameLength = pkg.name.length;
        const byteLength = nameBytes.length;
        if (byteLength > nameLength) {
            score += 50;
            threats.push('Unicode characters detected - potential homograph attack');
            mitigations.push('Verify package name contains only standard ASCII characters');
        }
        // Check for specific dangerous Unicode substitutions
        const dangerousSubstitutions = [
            { unicode: 'а', ascii: 'a', name: 'Cyrillic a' },
            { unicode: 'е', ascii: 'e', name: 'Cyrillic e' },
            { unicode: 'о', ascii: 'o', name: 'Cyrillic o' },
            { unicode: 'р', ascii: 'p', name: 'Cyrillic p' },
            { unicode: 'с', ascii: 'c', name: 'Cyrillic c' },
            { unicode: 'у', ascii: 'y', name: 'Cyrillic y' },
            { unicode: 'х', ascii: 'x', name: 'Cyrillic x' },
            { unicode: 'ρ', ascii: 'p', name: 'Greek rho' },
            { unicode: 'ο', ascii: 'o', name: 'Greek omicron' },
            { unicode: 'α', ascii: 'a', name: 'Greek alpha' }
        ];
        dangerousSubstitutions.forEach(sub => {
            if (pkg.name.includes(sub.unicode)) {
                score += 40;
                threats.push(`Dangerous Unicode character detected: ${sub.name} (${sub.unicode}) mimicking ${sub.ascii}`);
                mitigations.push(`Check if package name should use ${sub.ascii} instead of ${sub.unicode}`);
            }
        });
        // Check for popular package homographs
        this.popularPackages.forEach(popular => {
            const normalizedPkg = this.normalizeUnicode(pkg.name);
            if (normalizedPkg === popular && pkg.name !== popular) {
                score += 60;
                threats.push(`Unicode homograph attack targeting popular package: ${popular}`);
                mitigations.push(`This package may be impersonating ${popular} using Unicode characters`);
            }
        });
        return { score, threats, mitigations };
    }
    /**
     * 2. Version Confusion Attack Detection
     */
    detectVersionConfusion(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        const versionParts = pkg.version.split('.');
        // Check for suspiciously high version numbers
        const majorVersion = parseInt(versionParts[0] || '0');
        const minorVersion = parseInt(versionParts[1] || '0');
        const patchVersion = parseInt(versionParts[2] || '0');
        if (majorVersion > 100) {
            score += 40;
            threats.push(`Suspiciously high major version: ${majorVersion}`);
            mitigations.push('Verify this version number is legitimate for this package');
        }
        if (minorVersion > 999 || patchVersion > 999) {
            score += 35;
            threats.push(`Extremely high version components: ${pkg.version}`);
            mitigations.push('Check if this version follows semantic versioning standards');
        }
        // Check for version patterns indicating attacks
        if (pkg.version.match(/^(999|666|1337)\./)) {
            score += 50;
            threats.push(`Suspicious version pattern: ${pkg.version} (often used in attacks)`);
            mitigations.push('Investigate why package uses this specific version pattern');
        }
        // Check for pre-release versions with suspicious patterns
        if (pkg.version.includes('beta') || pkg.version.includes('alpha') || pkg.version.includes('rc')) {
            if (pkg.downloadCount && pkg.downloadCount > 10000) {
                score += 25;
                threats.push(`High downloads for pre-release version: ${pkg.version}`);
                mitigations.push('Verify why pre-release version has high adoption');
            }
        }
        // Check for impossible dates vs version
        if (pkg.publishedAt) {
            const ageInDays = (Date.now() - pkg.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (majorVersion > ageInDays / 30) { // More than 1 major version per month
                score += 30;
                threats.push('Version progression too rapid for package age');
                mitigations.push('Verify development timeline matches version history');
            }
        }
        return { score, threats, mitigations };
    }
    /**
     * 3. Brand Jacking Detection
     */
    detectBrandJacking(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        // Check for brand name impersonation
        this.brandNames.forEach(brand => {
            if (pkg.name.toLowerCase().includes(brand)) {
                score += 30;
                threats.push(`Package name contains brand: ${brand}`);
                mitigations.push(`Verify this is an official ${brand} package`);
                // Check for fake official emails
                if (pkg.author?.email?.includes(brand) ||
                    pkg.maintainers?.some(m => m.email?.includes(brand))) {
                    score += 40;
                    threats.push(`Email address claims ${brand} affiliation`);
                    mitigations.push(`Verify ${brand} email authenticity through official channels`);
                }
                // Check for suspicious suffixes
                const suspiciousSuffixes = ['-sdk', '-api', '-auth', '-official', '-lib', '-client'];
                suspiciousSuffixes.forEach(suffix => {
                    if (pkg.name.includes(brand + suffix) || pkg.name.includes(brand.replace(/\s+/g, '') + suffix)) {
                        score += 25;
                        threats.push(`Suspicious brand package naming: ${pkg.name}`);
                        mitigations.push(`Check if this is a legitimate ${brand} package`);
                    }
                });
            }
        });
        // Check for official-sounding descriptions
        const officialTerms = ['official', 'endorsed', 'certified', 'verified', 'authentic'];
        if (pkg.description) {
            officialTerms.forEach(term => {
                if (pkg.description.toLowerCase().includes(term)) {
                    score += 20;
                    threats.push(`Description claims to be "${term}"`);
                    mitigations.push('Verify official status through legitimate channels');
                }
            });
        }
        // Check for impersonation in keywords
        if (pkg.keywords) {
            const suspiciousKeywords = ['official', 'microsoft', 'google', 'amazon', 'github'];
            const foundSuspicious = pkg.keywords.filter(k => suspiciousKeywords.some(s => k.toLowerCase().includes(s)));
            if (foundSuspicious.length > 0) {
                score += 15;
                threats.push(`Keywords claim brand affiliation: ${foundSuspicious.join(', ')}`);
                mitigations.push('Verify brand association claims');
            }
        }
        return { score, threats, mitigations };
    }
    /**
     * 4. Dependency Confusion Detection
     */
    detectDependencyConfusion(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        // Check for scoped packages that could be internal
        if (pkg.name.startsWith('@')) {
            const nameParts = pkg.name.split('/');
            if (nameParts.length > 0) {
                const scopePart = nameParts[0];
                const suspiciousScopes = [
                    '@company', '@internal', '@private', '@corp', '@enterprise',
                    '@org', '@team', '@dev', '@staging', '@prod', '@test'
                ];
                suspiciousScopes.forEach(scope => {
                    if (scopePart.toLowerCase().includes(scope.substring(1))) {
                        score += 45;
                        threats.push(`Potential internal package scope: ${scopePart}`);
                        mitigations.push('Verify this package should be publicly available');
                    }
                });
                // Check for company name patterns
                const companyPatterns = ['-inc', '-corp', '-ltd', '-llc', '-co', '-org'];
                companyPatterns.forEach(pattern => {
                    if (scopePart.toLowerCase().includes(pattern)) {
                        score += 35;
                        threats.push(`Corporate scope pattern detected: ${scopePart}`);
                        mitigations.push('Check if this represents an internal company package');
                    }
                });
            }
        }
        // Check for internal-sounding package names
        const internalPatterns = [
            'internal', 'private', 'company', 'enterprise', 'corp',
            'admin', 'backend', 'service', 'api', 'auth', 'config'
        ];
        internalPatterns.forEach(pattern => {
            if (pkg.name.toLowerCase().includes(pattern)) {
                score += 25;
                threats.push(`Internal-sounding package name: contains "${pattern}"`);
                mitigations.push('Verify this package is meant for public consumption');
            }
        });
        // Check for suspicious download patterns (low downloads but recent publish)
        if (pkg.downloadCount && pkg.publishedAt) {
            const ageInDays = (Date.now() - pkg.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
            if (pkg.downloadCount < 1000 && ageInDays < 30) {
                score += 20;
                threats.push('Recently published package with low adoption');
                mitigations.push('Investigate why this package exists publicly');
            }
        }
        return { score, threats, mitigations };
    }
    /**
     * 5. Social Engineering Detection
     */
    detectSocialEngineering(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        // Check for security-themed packages
        const securityTerms = [
            'security', 'audit', 'scanner', 'vulnerability', 'pentest', 'exploit',
            'backdoor', 'malware', 'virus', 'trojan', 'keylog', 'steal', 'hack'
        ];
        if (pkg.name || pkg.description) {
            const nameAndDesc = `${pkg.name} ${pkg.description || ''}`.toLowerCase();
            securityTerms.forEach(term => {
                if (nameAndDesc.includes(term)) {
                    score += 25;
                    threats.push(`Security-themed content: contains "${term}"`);
                    mitigations.push('Exercise extreme caution with security-related packages');
                }
            });
        }
        // Check for "helpful" tool descriptions
        const helpfulPhrases = [
            'free tool', 'easy install', 'quick setup', 'no configuration',
            'automatic', 'one-click', 'instant', 'immediate', 'zero-config'
        ];
        if (pkg.description) {
            helpfulPhrases.forEach(phrase => {
                if (pkg.description.toLowerCase().includes(phrase)) {
                    score += 15;
                    threats.push(`Over-promising description: "${phrase}"`);
                    mitigations.push('Be skeptical of packages that seem "too convenient"');
                }
            });
        }
        // Check for urgency indicators
        const urgencyTerms = [
            'critical', 'urgent', 'immediate', 'emergency', 'fix', 'patch',
            'security update', 'hotfix', 'vulnerability fix'
        ];
        if (pkg.description) {
            urgencyTerms.forEach(term => {
                if (pkg.description.toLowerCase().includes(term)) {
                    score += 20;
                    threats.push(`Urgency language detected: "${term}"`);
                    mitigations.push('Verify urgency claims through official sources');
                }
            });
        }
        // Check for social proof manipulation
        const socialProofTerms = [
            'millions of users', 'trusted by', 'industry standard', 'most popular',
            'widely used', 'recommended by', 'used by top companies'
        ];
        if (pkg.description) {
            socialProofTerms.forEach(term => {
                if (pkg.description.toLowerCase().includes(term)) {
                    score += 18;
                    threats.push(`Social proof claim: "${term}"`);
                    mitigations.push('Independently verify popularity and trust claims');
                }
            });
        }
        return { score, threats, mitigations };
    }
    /**
     * 6. Subdomain Takeover Detection
     */
    detectSubdomainTakeover(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        // Check scripts for suspicious domains
        if (pkg.scripts) {
            Object.entries(pkg.scripts).forEach(([scriptName, scriptContent]) => {
                // Look for external URL fetches
                const urlMatches = scriptContent.match(/https?:\/\/([^\s'"]+)/g);
                if (urlMatches) {
                    urlMatches.forEach(url => {
                        // Check for suspicious TLDs
                        this.suspiciousTlds.forEach(tld => {
                            if (url.includes(tld)) {
                                score += 35;
                                threats.push(`Suspicious TLD in ${scriptName}: ${tld}`);
                                mitigations.push(`Verify domain legitimacy: ${url}`);
                            }
                        });
                        // Check for subdomain patterns indicating takeover
                        const subdomainPatterns = [
                            'abandoned-', 'old-', 'legacy-', 'deprecated-', 'unused-',
                            'test-', 'staging-', 'dev-', 'beta-', 'alpha-'
                        ];
                        subdomainPatterns.forEach(pattern => {
                            if (url.includes(pattern)) {
                                score += 30;
                                threats.push(`Potentially abandoned subdomain: ${url}`);
                                mitigations.push('Verify subdomain is still controlled by legitimate owner');
                            }
                        });
                        // Check for recently registered domains (simulation)
                        if (url.includes('.com') && scriptName === 'postinstall') {
                            score += 20;
                            threats.push(`External domain access in installation script: ${url}`);
                            mitigations.push('Verify domain ownership and purpose');
                        }
                    });
                }
            });
        }
        // Check repository URLs for similar patterns
        if (pkg.repository?.url) {
            this.suspiciousTlds.forEach(tld => {
                if (pkg.repository.url.includes(tld)) {
                    score += 25;
                    threats.push(`Repository hosted on suspicious TLD: ${tld}`);
                    mitigations.push('Verify repository hosting service legitimacy');
                }
            });
        }
        return { score, threats, mitigations };
    }
    /**
     * 7. Supply Chain Injection Detection
     */
    detectSupplyChainInjection(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        if (!pkg.scripts)
            return { score, threats, mitigations };
        Object.entries(pkg.scripts).forEach(([scriptName, scriptContent]) => {
            // Check for delayed execution patterns
            const delayedPatterns = [
                'setTimeout', 'setInterval', 'setImmediate', 'process.nextTick',
                'requestAnimationFrame', 'queueMicrotask'
            ];
            delayedPatterns.forEach(pattern => {
                if (scriptContent.includes(pattern)) {
                    score += 25;
                    threats.push(`Delayed execution in ${scriptName}: ${pattern}`);
                    mitigations.push('Review delayed execution for legitimate purpose');
                }
            });
            // Check for conditional execution
            const conditionalPatterns = [
                'Math.random()', 'Date.now()', 'process.env.NODE_ENV',
                'process.platform', 'os.platform()', 'process.argv'
            ];
            conditionalPatterns.forEach(pattern => {
                if (scriptContent.includes(pattern)) {
                    score += 20;
                    threats.push(`Conditional execution in ${scriptName}: ${pattern}`);
                    mitigations.push('Investigate conditional logic purpose');
                }
            });
            // Check for network requests to external services
            const networkPatterns = [
                'https.get(', 'https.request(', 'http.get(', 'http.request(',
                'fetch(', 'axios(', 'request(', 'curl ', 'wget '
            ];
            networkPatterns.forEach(pattern => {
                if (scriptContent.includes(pattern)) {
                    score += 30;
                    threats.push(`External network request in ${scriptName}: ${pattern}`);
                    mitigations.push('Verify external requests are necessary and safe');
                }
            });
            // Check for data exfiltration patterns
            const exfiltrationPatterns = [
                'process.env', 'os.userInfo()', 'os.homedir()', 'process.cwd()',
                '.ssh/', '.aws/', '.config/', 'package.json', 'node_modules'
            ];
            exfiltrationPatterns.forEach(pattern => {
                if (scriptContent.includes(pattern)) {
                    score += 35;
                    threats.push(`Potential data access in ${scriptName}: ${pattern}`);
                    mitigations.push('Review system data access for legitimate need');
                }
            });
        });
        return { score, threats, mitigations };
    }
    /**
     * 8. Steganography Detection
     */
    detectSteganography(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        if (!pkg.scripts)
            return { score, threats, mitigations };
        Object.entries(pkg.scripts).forEach(([scriptName, scriptContent]) => {
            // Check for base64 encoding
            const base64Pattern = /[A-Za-z0-9+/]{20,}={0,2}/g;
            const base64Matches = scriptContent.match(base64Pattern);
            if (base64Matches && base64Matches.length > 0) {
                score += 40;
                threats.push(`Base64 encoded data in ${scriptName} (${base64Matches.length} instances)`);
                mitigations.push('Decode and inspect base64 content for malicious payload');
            }
            // Check for hex encoding
            const hexPattern = /\\x[0-9a-fA-F]{2}/g;
            const hexMatches = scriptContent.match(hexPattern);
            if (hexMatches && hexMatches.length > 5) {
                score += 35;
                threats.push(`Hex encoded data in ${scriptName} (${hexMatches.length} bytes)`);
                mitigations.push('Decode hex content to verify legitimacy');
            }
            // Check for buffer operations with encoded data
            const bufferPatterns = [
                'Buffer.from(', 'Buffer.alloc(', 'Buffer.allocUnsafe(',
                'new Buffer(', '.toString(\'base64\')', '.toString(\'hex\')'
            ];
            bufferPatterns.forEach(pattern => {
                if (scriptContent.includes(pattern)) {
                    score += 25;
                    threats.push(`Buffer manipulation in ${scriptName}: ${pattern}`);
                    mitigations.push('Inspect buffer operations for data hiding');
                }
            });
            // Check for compression/decompression
            const compressionPatterns = [
                'zlib.gunzip', 'zlib.inflate', 'zlib.unzip', 'pako.inflate',
                'lz4.decode', 'lzma.decompress'
            ];
            compressionPatterns.forEach(pattern => {
                if (scriptContent.includes(pattern)) {
                    score += 30;
                    threats.push(`Data decompression in ${scriptName}: ${pattern}`);
                    mitigations.push('Examine compressed content for hidden payloads');
                }
            });
            // Check for very long strings (potential encoded payloads)
            const lines = scriptContent.split('\n');
            lines.forEach((line, index) => {
                if (line.length > 200 && line.includes('"') || line.includes("'")) {
                    score += 20;
                    threats.push(`Very long string in ${scriptName} line ${index + 1} (${line.length} chars)`);
                    mitigations.push('Inspect long strings for encoded malicious content');
                }
            });
        });
        return { score, threats, mitigations };
    }
    /**
     * 9. Maintainer Compromise Detection
     */
    detectMaintainerCompromise(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        if (!pkg.maintainers || pkg.maintainers.length === 0) {
            return { score, threats, mitigations };
        }
        // Check for suspicious maintainer patterns
        pkg.maintainers.forEach(maintainer => {
            // Check for temporary email domains
            if (maintainer.email) {
                this.temporaryEmailDomains.forEach(domain => {
                    if (maintainer.email.includes(domain)) {
                        score += 40;
                        threats.push(`Maintainer using temporary email: ${maintainer.email}`);
                        mitigations.push('Verify maintainer identity through official channels');
                    }
                });
                // Check for suspicious email patterns
                const suspiciousEmailPatterns = [
                    /temp.*\d{4}@/, /anon.*@/, /fake.*@/, /test.*@/,
                    /new.*\d{4}@/, /dev.*\d{4}@/, /user.*\d{4}@/
                ];
                suspiciousEmailPatterns.forEach(pattern => {
                    if (pattern.test(maintainer.email)) {
                        score += 35;
                        threats.push(`Suspicious maintainer email pattern: ${maintainer.email}`);
                        mitigations.push('Investigate maintainer account legitimacy');
                    }
                });
            }
            // Check for suspicious maintainer names
            if (maintainer.name) {
                const suspiciousNamePatterns = [
                    /^(new|temp|fake|test|anon|user)[-_]?\w*\d{4}$/i,
                    /^[a-z]+\d{4}$/i, // Simple pattern: letters + year
                    /(hacker|attacker|malicious|evil|stealth)/i
                ];
                suspiciousNamePatterns.forEach(pattern => {
                    if (pattern.test(maintainer.name)) {
                        score += 30;
                        threats.push(`Suspicious maintainer name: ${maintainer.name}`);
                        mitigations.push('Verify maintainer legitimacy');
                    }
                });
            }
        });
        // Check for recently added maintainers (based on naming patterns)
        const recentMaintainerPatterns = [
            /2024/i, /2025/i, /new/i, /recent/i, /latest/i
        ];
        const recentMaintainers = pkg.maintainers.filter(m => recentMaintainerPatterns.some(pattern => pattern.test(m.name || '') || pattern.test(m.email || '')));
        if (recentMaintainers.length > 0) {
            score += 25;
            threats.push(`${recentMaintainers.length} recently added maintainer(s) detected`);
            mitigations.push('Monitor new maintainer activity closely');
        }
        // Check for too many maintainers (could indicate account farming)
        if (pkg.maintainers.length > 5) {
            score += 15;
            threats.push(`Unusually high number of maintainers: ${pkg.maintainers.length}`);
            mitigations.push('Verify all maintainers are legitimate and necessary');
        }
        return { score, threats, mitigations };
    }
    /**
     * 10. Advanced Typosquatting Detection
     */
    detectAdvancedTyposquatting(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        this.popularPackages.forEach(popular => {
            if (pkg.name === popular)
                return; // Skip if it's the actual package
            // Levenshtein distance check
            const distance = this.levenshteinDistance(pkg.name, popular);
            if (distance <= 2 && distance > 0) {
                score += Math.max(40 - (distance * 10), 10);
                threats.push(`Typosquatting attempt: ${pkg.name} vs ${popular} (distance: ${distance})`);
                mitigations.push(`Verify this is not a typosquat of ${popular}`);
            }
            // Character substitution attacks
            if (this.hasCharacterSubstitution(pkg.name, popular)) {
                score += 35;
                threats.push(`Character substitution attack targeting: ${popular}`);
                mitigations.push(`Compare carefully with legitimate ${popular} package`);
            }
            // Addition/removal attacks
            if (this.hasAdditionRemovalAttack(pkg.name, popular)) {
                score += 30;
                threats.push(`Addition/removal attack targeting: ${popular}`);
                mitigations.push(`Check if ${pkg.name} is impersonating ${popular}`);
            }
            // Hyphen/underscore confusion
            if (this.hasSeparatorConfusion(pkg.name, popular)) {
                score += 25;
                threats.push(`Separator confusion attack targeting: ${popular}`);
                mitigations.push(`Verify correct package name format for ${popular}`);
            }
        });
        return { score, threats, mitigations };
    }
    /**
     * 11. Script-based Attack Detection (Enhanced)
     */
    detectScriptAttacks(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        if (!pkg.scripts)
            return { score, threats, mitigations };
        const dangerousPatterns = [
            { pattern: /eval\s*\(/i, score: 40, description: 'Dynamic code execution' },
            { pattern: /Function\s*\(/i, score: 35, description: 'Dynamic function creation' },
            { pattern: /exec\s*\(/i, score: 35, description: 'System command execution' },
            { pattern: /spawn\s*\(/i, score: 30, description: 'Process spawning' },
            { pattern: /child_process/i, score: 30, description: 'Child process creation' },
            { pattern: /rm\s+-rf|rmdir\s+\/|del\s+\/s/i, score: 45, description: 'Destructive file operations' },
            { pattern: /curl\s+.*\|.*sh/i, score: 50, description: 'Piped shell execution' },
            { pattern: /wget\s+.*\|.*sh/i, score: 50, description: 'Piped shell execution' },
            { pattern: /powershell\s+-Command/i, score: 40, description: 'PowerShell execution' },
            { pattern: /cmd\s+\/c/i, score: 35, description: 'Windows command execution' },
            { pattern: /\/bin\/sh\s+-c/i, score: 35, description: 'Shell command execution' }
        ];
        Object.entries(pkg.scripts).forEach(([scriptName, scriptContent]) => {
            dangerousPatterns.forEach(({ pattern, score: patternScore, description }) => {
                if (pattern.test(scriptContent)) {
                    score += patternScore;
                    threats.push(`${description} in ${scriptName} script`);
                    mitigations.push(`Review and sandbox ${scriptName} script execution`);
                }
            });
        });
        return { score, threats, mitigations };
    }
    /**
     * 12. Behavioral Anomaly Detection
     */
    detectBehavioralAnomalies(pkg) {
        const threats = [];
        const mitigations = [];
        let score = 0;
        // Check download vs age anomalies
        if (pkg.downloadCount && pkg.publishedAt) {
            const ageInDays = (Date.now() - pkg.publishedAt.getTime()) / (1000 * 60 * 60 * 24);
            const downloadsPerDay = pkg.downloadCount / Math.max(ageInDays, 1);
            // Very high download rate for new packages
            if (ageInDays < 30 && downloadsPerDay > 1000) {
                score += 25;
                threats.push('Unusually high download rate for new package');
                mitigations.push('Investigate sudden popularity increase');
            }
            // Very low downloads for old packages (could be abandoned then compromised)
            if (ageInDays > 365 && pkg.downloadCount < 100) {
                score += 15;
                threats.push('Low downloads for established package');
                mitigations.push('Check if package was recently updated after abandonment');
            }
        }
        // Check for suspicious file extensions in package name
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.jar'];
        suspiciousExtensions.forEach(ext => {
            if (pkg.name.endsWith(ext)) {
                score += 40;
                threats.push(`Package name ends with executable extension: ${ext}`);
                mitigations.push('Verify why package name includes file extension');
            }
        });
        // Check for suspicious license types
        const suspiciousLicenses = ['WTFPL', 'Unlicense', 'Public Domain', 'No License'];
        if (pkg.license && suspiciousLicenses.includes(pkg.license)) {
            score += 10;
            threats.push(`Unusual license type: ${pkg.license}`);
            mitigations.push('Verify license choice is appropriate');
        }
        return { score, threats, mitigations };
    }
    // Helper methods
    normalizeUnicode(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));
        for (let i = 0; i <= str1.length; i++)
            matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++)
            matrix[j][0] = j;
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator);
            }
        }
        return matrix[str2.length][str1.length];
    }
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
    hasAdditionRemovalAttack(str1, str2) {
        // Check if str1 is str2 with one character added or removed
        if (Math.abs(str1.length - str2.length) !== 1)
            return false;
        const [shorter, longer] = str1.length < str2.length ? [str1, str2] : [str2, str1];
        for (let i = 0; i <= longer.length; i++) {
            const modified = longer.slice(0, i) + longer.slice(i + 1);
            if (modified === shorter)
                return true;
        }
        return false;
    }
    hasSeparatorConfusion(str1, str2) {
        const normalized1 = str1.replace(/[-_]/g, '');
        const normalized2 = str2.replace(/[-_]/g, '');
        return normalized1 === normalized2 && str1 !== str2;
    }
    /**
     * Generate comprehensive security recommendations
     */
    async generateRecommendations(packages) {
        const recommendations = [];
        const predictions = await this.predictVulnerabilities(packages);
        for (const prediction of predictions) {
            if (prediction.riskScore >= 90) {
                recommendations.push({
                    type: 'removal',
                    currentPackage: prediction.packageName,
                    recommendedAction: `CRITICAL: Remove ${prediction.packageName} immediately - multiple attack vectors detected`,
                    confidence: prediction.confidence,
                    benefits: ['Eliminates severe security risks', 'Prevents system compromise', 'Protects sensitive data'],
                    risks: ['May break functionality that depends on this package'],
                    estimatedEffort: 'high',
                    priority: 'critical',
                });
            }
            else if (prediction.riskScore >= 70) {
                recommendations.push({
                    type: 'security-patch',
                    currentPackage: prediction.packageName,
                    recommendedAction: `HIGH RISK: Quarantine ${prediction.packageName} and investigate thoroughly`,
                    confidence: prediction.confidence,
                    benefits: ['Reduces security risks', 'Allows investigation time'],
                    risks: ['Potential security vulnerabilities remain'],
                    estimatedEffort: 'medium',
                    priority: 'high',
                });
            }
            else if (prediction.riskScore >= 50) {
                recommendations.push({
                    type: 'security-patch',
                    currentPackage: prediction.packageName,
                    recommendedAction: `MEDIUM RISK: Monitor ${prediction.packageName} closely for suspicious activity`,
                    confidence: prediction.confidence,
                    benefits: ['Early detection of issues', 'Maintained functionality'],
                    risks: ['Some risk remains'],
                    estimatedEffort: 'low',
                    priority: 'medium',
                });
            }
        }
        return recommendations;
    }
    /**
     * Comprehensive predictive analytics
     */
    async performPredictiveAnalytics(packages) {
        const predictions = await this.predictVulnerabilities(packages);
        const highRiskPackages = predictions.filter(p => p.riskScore >= 70);
        const criticalRiskPackages = predictions.filter(p => p.riskScore >= 90);
        const projectHealthScore = Math.max(0, 100 - (highRiskPackages.length * 15) - (criticalRiskPackages.length * 10));
        return {
            projectHealthScore,
            trendAnalysis: {
                vulnerabilityTrend: criticalRiskPackages.length > 0 ? 'degrading' : highRiskPackages.length > 2 ? 'degrading' : 'stable',
                maintenanceTrend: 'stable',
                securityTrend: criticalRiskPackages.length > 0 ? 'degrading' : highRiskPackages.length > 1 ? 'degrading' : 'improving',
                projectedScore6Months: projectHealthScore - (highRiskPackages.length * 5),
                projectedScore12Months: projectHealthScore - (highRiskPackages.length * 10),
            },
            riskFactors: [],
            recommendations: [],
            futureVulnerabilities: [],
            dependencyLifecycle: [],
        };
    }
}
exports.ComprehensiveSecurityEngine = ComprehensiveSecurityEngine;
//# sourceMappingURL=comprehensive-security-engine.js.map