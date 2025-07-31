/**
 * GitHub Security Advisory Data Source
 * Implementation of SecurityDataSource for GitHub's Security Advisory Database
 */
import type { Package, Vulnerability, SecurityDataSource } from '../../types';
/**
 * GitHub Security Advisory API data source
 * Provides access to GitHub's comprehensive security advisory database
 */
export declare class GitHubAdvisoryDataSource implements SecurityDataSource {
    private readonly options;
    readonly name = "github-advisory";
    readonly description = "GitHub Security Advisory Database";
    readonly priority = 1;
    private readonly baseUrl;
    private readonly apiTimeout;
    private readonly rateLimitDelay;
    private lastRequestTime;
    private requestCount;
    constructor(options?: {
        token?: string;
        ecosystem?: string;
    });
    /**
     * Check if the data source is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get vulnerabilities for a specific package
     */
    getVulnerabilities(pkg: Package): Promise<Vulnerability[]>;
    /**
     * Convert GitHub Advisory to our Vulnerability format
     */
    private convertAdvisoryToVulnerability;
    /**
     * Map GitHub severity to our severity enum
     */
    private mapSeverity;
    /**
     * Convert GitHub advisory references
     */
    private convertReferences;
    /**
     * Make HTTP request with proper headers and error handling
     */
    private makeRequest;
    /**
     * Respect rate limiting to avoid being blocked
     */
    private respectRateLimit;
    /**
     * Get usage statistics for monitoring
     */
    getStats(): {
        requestCount: number;
        lastRequestTime: number;
        rateLimitDelay: number;
    };
}
/**
 * Factory function for creating GitHub Advisory data source
 */
export declare function createGitHubAdvisoryDataSource(options?: {
    token?: string;
    ecosystem?: string;
}): GitHubAdvisoryDataSource;
//# sourceMappingURL=github-advisory.d.ts.map