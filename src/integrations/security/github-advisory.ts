/**
 * GitHub Security Advisory Data Source
 * Implementation of SecurityDataSource for GitHub's Security Advisory Database
 */

import { getLogger } from '../../utils/logger';
import { CircuitOpenError, normalizeHttpError } from '../../utils/errors';
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
  private readonly maxRetries = 3;
  private readonly initialBackoffMs = 250;
  private readonly maxBackoffMs = 2000;
  private readonly failureThreshold = 5; // open breaker after N consecutive failures
  private readonly cooldownMs = 30_000; // 30s before half-open

  private lastRequestTime = 0;
  private requestCount = 0;
  private consecutiveFailures = 0;
  private breakerState: 'closed' | 'open' | 'half-open' = 'closed';
  private nextAttemptAfter = 0;

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
  const reqId = Math.random().toString(36).slice(2, 10);
  logger.debug({ reqId, pkg: pkg.name }, `🔍 Fetching vulnerabilities from GitHub Advisory API`);
    
    try {
      await this.respectRateLimit();
      
      // Query GitHub Advisory API for package vulnerabilities
      const searchParams = new URLSearchParams({
        affects: pkg.name,
        ecosystem: this.options.ecosystem || 'npm',
        per_page: '100'
      });

      const url = `${this.baseUrl}?${searchParams}`;
      const response = await this.makeRequest(url);
      
      if (!response.ok) {
        throw normalizeHttpError(response, url);
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
          logger.warn({ reqId, advisory: advisory?.ghsa_id, err: String(error) }, 'Failed to process advisory');
        }
      }

      logger.info({ reqId, count: vulnerabilities.length, pkg: pkg.name }, '✅ GitHub Advisory vulnerabilities found');
      return vulnerabilities;
    } catch (error) {
      if (error instanceof CircuitOpenError) {
        logger.error({ pkg: pkg.name, err: error.message }, 'Circuit breaker open; skipping GitHub Advisory');
      } else {
        logger.error({ pkg: pkg.name, err: String(error) }, 'Failed to fetch vulnerabilities from GitHub Advisory');
      }
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
    // Circuit breaker guard
    if (!this.canAttempt()) {
      throw new CircuitOpenError();
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'Smart-Dependency-Analyzer/1.0.0'
    };

    // Add authorization header if token is provided
    if (this.options.token) {
      headers['Authorization'] = `Bearer ${this.options.token}`;
    }

    let attempt = 0;
    let lastError: unknown = undefined;

    while (attempt <= this.maxRetries) {
      await this.respectRateLimit();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.apiTimeout);
      try {
        this.requestCount++;
        const response = await fetch(url, { headers, signal: controller.signal });

        // Check rate limiting
        const remaining = response.headers.get('X-RateLimit-Remaining');
        if (remaining && parseInt(remaining) < 10) {
          logger.warn(`GitHub API rate limit low: ${remaining} requests remaining`);
        }

        if (response.ok) {
          this.onSuccess();
          return response;
        }

        // Retry for transient errors
        const retryableStatuses = new Set([429, 500, 502, 503, 504]);
        if (!retryableStatuses.has(response.status) || attempt === this.maxRetries) {
          this.onFailure();
          return response; // let caller decide; not retrying further
        }

        this.onFailure();
        const retryAfter = response.headers.get('retry-after');
        const parsedRetryAfter = retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined;
        const backoff = parsedRetryAfter ?? this.computeBackoff(attempt);
        logger.warn(`GitHub API ${response.status}; retrying in ${backoff}ms (attempt ${attempt + 1}/${this.maxRetries})`);
        await this.delay(backoff);
      } catch (err) {
        lastError = err;
        this.onFailure();
        if (attempt === this.maxRetries) {
          clearTimeout(timeoutId);
          throw err;
        }
        const backoff = this.computeBackoff(attempt);
        logger.warn(`GitHub request failed; retrying in ${backoff}ms (attempt ${attempt + 1}/${this.maxRetries})`, err);
        await this.delay(backoff);
      } finally {
        clearTimeout(timeoutId);
      }
      attempt++;
    }
    // Exhausted retries
    throw lastError ?? new Error('GitHub request failed after retries');
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

  // ---- Circuit breaker & retry helpers ----
  private canAttempt(): boolean {
    if (this.breakerState === 'open') {
      if (Date.now() >= this.nextAttemptAfter) {
        this.breakerState = 'half-open';
        return true;
      }
      return false;
    }
    return true;
  }

  private onSuccess(): void {
    this.consecutiveFailures = 0;
    if (this.breakerState !== 'closed') {
      this.breakerState = 'closed';
    }
  }

  private onFailure(): void {
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.failureThreshold && this.breakerState !== 'open') {
      this.breakerState = 'open';
      this.nextAttemptAfter = Date.now() + this.cooldownMs;
      logger.error(`Circuit breaker opened after ${this.consecutiveFailures} consecutive failures; cooling down for ${this.cooldownMs}ms`);
    }
  }

  private computeBackoff(attempt: number): number {
    const exp = Math.min(this.initialBackoffMs * Math.pow(2, attempt), this.maxBackoffMs);
    const jitter = Math.floor(Math.random() * 100);
    return exp + jitter;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
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
