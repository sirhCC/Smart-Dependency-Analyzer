/**
 * GitHub Security Advisory Data Source
 * Implementation of SecurityDataSource for GitHub's Security Advisory Database
 */

import { getLogger } from '../../utils/logger';
import { VulnerabilitySeverity } from '../../types';
import type { 
  Package, 
  Vulnerability, 
  SecurityDataSource,
  VulnerabilitySource
} from '../../types';

const logger = getLogger('GitHubAdvisorySource');

/**
 * GitHub Security Advisory API data source
 * Provides access to GitHub's comprehensive security advisory database
 */
export class GitHubAdvisoryDataSource implements SecurityDataSource {
  public readonly name = 'github-advisory';
  public readonly description = 'GitHub Security Advisory Database';
  public readonly priority = 1;

  private readonly baseUrl = 'https://api.github.com/advisories';
  private readonly apiTimeout = 10000; // 10 seconds
  private readonly rateLimitDelay = 100; // 100ms between requests

  private lastRequestTime = 0;
  private requestCount = 0;

  constructor(private readonly options: {
    token?: string;
    ecosystem?: string;
  } = {}) {
    logger.info('🔧 GitHub Advisory data source initialized');
  }

  /**
   * Check if the data source is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.makeRequest(`${this.baseUrl}?per_page=1`);
      return response.ok;
    } catch (error) {
      logger.warn('GitHub Advisory API is not available:', error);
      return false;
    }
  }

  /**
   * Get vulnerabilities for a specific package
   */
  async getVulnerabilities(pkg: Package): Promise<Vulnerability[]> {
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

      const advisories = await response.json() as any[];
      const vulnerabilities: Vulnerability[] = [];

      for (const advisory of advisories) {
        try {
          const vulnerability = await this.convertAdvisoryToVulnerability(advisory, pkg);
          if (vulnerability) {
            vulnerabilities.push(vulnerability);
          }
        } catch (error) {
          logger.warn(`Failed to process advisory ${advisory.ghsa_id}:`, error);
        }
      }

      logger.info(`✅ Found ${vulnerabilities.length} vulnerabilities for ${pkg.name} from GitHub Advisory`);
      return vulnerabilities;
    } catch (error) {
      logger.error(`Failed to fetch vulnerabilities for ${pkg.name}:`, error);
      return [];
    }
  }

  /**
   * Convert GitHub Advisory to our Vulnerability format
   */
  private async convertAdvisoryToVulnerability(
    advisory: any, 
    pkg: Package
  ): Promise<Vulnerability | null> {
    try {
      // Find the package-specific vulnerability details
      const packageVuln = advisory.vulnerabilities?.find((v: any) => 
        v.package?.name === pkg.name
      );

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
      const vulnerability: Vulnerability = {
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
        source: 'github' as VulnerabilitySource,
        patched: patchedVersions.length > 0
      };

      return vulnerability;
    } catch (error) {
      logger.error('Failed to convert GitHub advisory:', error);
      return null;
    }
  }

  /**
   * Map GitHub severity to our severity enum
   */
  private mapSeverity(githubSeverity: string): VulnerabilitySeverity {
    switch (githubSeverity?.toLowerCase()) {
      case 'critical':
        return VulnerabilitySeverity.CRITICAL;
      case 'high':
        return VulnerabilitySeverity.HIGH;
      case 'moderate':
      case 'medium':
        return VulnerabilitySeverity.MEDIUM;
      case 'low':
        return VulnerabilitySeverity.LOW;
      default:
        return VulnerabilitySeverity.MEDIUM; // Default to medium if unknown
    }
  }

  /**
   * Convert GitHub advisory references
   */
  private convertReferences(advisory: any): Array<{ url: string; type: 'advisory' | 'article' | 'report' | 'fix' | 'package' }> {
    const references: Array<{ url: string; type: 'advisory' | 'article' | 'report' | 'fix' | 'package' }> = [];
    
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
  private async makeRequest(url: string): Promise<Response> {
    const headers: Record<string, string> = {
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
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Respect rate limiting to avoid being blocked
   */
  private async respectRateLimit(): Promise<void> {
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
  getStats(): {
    requestCount: number;
    lastRequestTime: number;
    rateLimitDelay: number;
  } {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      rateLimitDelay: this.rateLimitDelay
    };
  }
}

/**
 * Factory function for creating GitHub Advisory data source
 */
export function createGitHubAdvisoryDataSource(options: {
  token?: string;
  ecosystem?: string;
} = {}): GitHubAdvisoryDataSource {
  return new GitHubAdvisoryDataSource(options);
}
