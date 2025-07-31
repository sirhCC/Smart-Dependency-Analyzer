"use strict";
/**
 * GitHub Security Advisory Data Source
 * Implementation of SecurityDataSource for GitHub's Security Advisory Database
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubAdvisoryDataSource = void 0;
exports.createGitHubAdvisoryDataSource = createGitHubAdvisoryDataSource;
const logger_1 = require("../../utils/logger");
const types_1 = require("../../types");
const logger = (0, logger_1.getLogger)('GitHubAdvisorySource');
/**
 * GitHub Security Advisory API data source
 * Provides access to GitHub's comprehensive security advisory database
 */
class GitHubAdvisoryDataSource {
    options;
    name = 'github-advisory';
    description = 'GitHub Security Advisory Database';
    priority = 1;
    baseUrl = 'https://api.github.com/advisories';
    apiTimeout = 10000; // 10 seconds
    rateLimitDelay = 100; // 100ms between requests
    lastRequestTime = 0;
    requestCount = 0;
    constructor(options = {}) {
        this.options = options;
        logger.info('🔧 GitHub Advisory data source initialized');
    }
    /**
     * Check if the data source is available
     */
    async isAvailable() {
        try {
            const response = await this.makeRequest(`${this.baseUrl}?per_page=1`);
            return response.ok;
        }
        catch (error) {
            logger.warn('GitHub Advisory API is not available:', error);
            return false;
        }
    }
    /**
     * Get vulnerabilities for a specific package
     */
    async getVulnerabilities(pkg) {
        logger.debug(`🔍 Fetching vulnerabilities for ${pkg.name} from GitHub Advisory API`);
        try {
            await this.respectRateLimit();
            // Query GitHub Advisory API for package vulnerabilities
            const searchParams = new URLSearchParams({
                affects: pkg.name,
                ecosystem: this.options.ecosystem || 'npm',
                per_page: '100'
            });
            const response = await this.makeRequest(`${this.baseUrl}?${searchParams}`);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            const advisories = await response.json();
            const vulnerabilities = [];
            for (const advisory of advisories) {
                try {
                    const vulnerability = await this.convertAdvisoryToVulnerability(advisory, pkg);
                    if (vulnerability) {
                        vulnerabilities.push(vulnerability);
                    }
                }
                catch (error) {
                    logger.warn(`Failed to process advisory ${advisory.ghsa_id}:`, error);
                }
            }
            logger.info(`✅ Found ${vulnerabilities.length} vulnerabilities for ${pkg.name} from GitHub Advisory`);
            return vulnerabilities;
        }
        catch (error) {
            logger.error(`Failed to fetch vulnerabilities for ${pkg.name}:`, error);
            return [];
        }
    }
    /**
     * Convert GitHub Advisory to our Vulnerability format
     */
    async convertAdvisoryToVulnerability(advisory, pkg) {
        try {
            // Find the package-specific vulnerability details
            const packageVuln = advisory.vulnerabilities?.find((v) => v.package?.name === pkg.name);
            if (!packageVuln) {
                return null; // Advisory doesn't affect this specific package
            }
            // Map GitHub severity to our severity
            const severity = this.mapSeverity(advisory.severity);
            // Extract affected and patched versions
            const affectedVersions = packageVuln.vulnerable_version_range
                ? [packageVuln.vulnerable_version_range]
                : [];
            const patchedVersions = packageVuln.patched_versions || [];
            // Build vulnerability object
            const vulnerability = {
                id: advisory.ghsa_id,
                cveId: advisory.cve_id,
                title: advisory.summary,
                description: advisory.description,
                severity,
                cvssScore: advisory.cvss?.score,
                cvssVector: advisory.cvss?.vector_string,
                publishedAt: new Date(advisory.published_at),
                updatedAt: new Date(advisory.updated_at),
                affectedVersions,
                patchedVersions,
                references: this.convertReferences(advisory),
                cwe: advisory.cwe_ids || [],
                source: 'github',
                patched: patchedVersions.length > 0
            };
            return vulnerability;
        }
        catch (error) {
            logger.error('Failed to convert GitHub advisory:', error);
            return null;
        }
    }
    /**
     * Map GitHub severity to our severity enum
     */
    mapSeverity(githubSeverity) {
        switch (githubSeverity?.toLowerCase()) {
            case 'critical':
                return types_1.VulnerabilitySeverity.CRITICAL;
            case 'high':
                return types_1.VulnerabilitySeverity.HIGH;
            case 'moderate':
            case 'medium':
                return types_1.VulnerabilitySeverity.MEDIUM;
            case 'low':
                return types_1.VulnerabilitySeverity.LOW;
            default:
                return types_1.VulnerabilitySeverity.MEDIUM; // Default to medium if unknown
        }
    }
    /**
     * Convert GitHub advisory references
     */
    convertReferences(advisory) {
        const references = [];
        // Add main advisory URL
        if (advisory.html_url) {
            references.push({
                url: advisory.html_url,
                type: 'advisory'
            });
        }
        // Add additional references
        if (advisory.references) {
            for (const ref of advisory.references) {
                references.push({
                    url: ref.url,
                    type: 'report' // Default type for external references
                });
            }
        }
        return references;
    }
    /**
     * Make HTTP request with proper headers and error handling
     */
    async makeRequest(url) {
        const headers = {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'Smart-Dependency-Analyzer/1.0.0'
        };
        // Add authorization header if token is provided
        if (this.options.token) {
            headers['Authorization'] = `Bearer ${this.options.token}`;
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.apiTimeout);
        try {
            this.requestCount++;
            const response = await fetch(url, {
                headers,
                signal: controller.signal
            });
            // Check rate limiting
            const remaining = response.headers.get('X-RateLimit-Remaining');
            if (remaining && parseInt(remaining) < 10) {
                logger.warn(`GitHub API rate limit low: ${remaining} requests remaining`);
            }
            return response;
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    /**
     * Respect rate limiting to avoid being blocked
     */
    async respectRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.rateLimitDelay) {
            const delay = this.rateLimitDelay - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        this.lastRequestTime = Date.now();
    }
    /**
     * Get usage statistics for monitoring
     */
    getStats() {
        return {
            requestCount: this.requestCount,
            lastRequestTime: this.lastRequestTime,
            rateLimitDelay: this.rateLimitDelay
        };
    }
}
exports.GitHubAdvisoryDataSource = GitHubAdvisoryDataSource;
/**
 * Factory function for creating GitHub Advisory data source
 */
function createGitHubAdvisoryDataSource(options = {}) {
    return new GitHubAdvisoryDataSource(options);
}
//# sourceMappingURL=github-advisory.js.map