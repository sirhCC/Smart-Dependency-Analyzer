/**
 * Enterprise-grade cache manager for performance optimization
 * Implements intelligent caching strategies for AI predictions and analysis results
 */

import { Package } from '../../types';
import { VulnerabilityPrediction } from '../intelligence/ai-engine';
import { logger } from '../../utils/logger';
import * as crypto from 'crypto';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  totalQueries: number;
}

export class CacheManager {
  private predictionCache = new Map<string, CacheEntry<VulnerabilityPrediction>>();
  private typosquattingCache = new Map<string, CacheEntry<{ isTyposquat: boolean; target: string; confidence: number }>>();
  private patternCache = new Map<string, CacheEntry<{ score: number; threats: string[] }>>();
  
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
    totalQueries: 0
  };

  private readonly DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes
  private readonly MAX_CACHE_SIZE = 10000;
  private readonly CLEANUP_INTERVAL = 1000 * 60 * 5; // 5 minutes
  
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
    logger.info('🚀 Cache manager initialized with intelligent eviction policies');
  }

  /**
   * Generate cache key for package analysis
   */
  private generatePackageKey(pkg: Package): string {
    const content = JSON.stringify({
      name: pkg.name,
      version: pkg.version,
      scripts: pkg.scripts,
      author: pkg.author,
      description: pkg.description,
      maintainers: pkg.maintainers,
      keywords: pkg.keywords,
      repository: pkg.repository
    });
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Cache vulnerability prediction with intelligent TTL
   */
  cachePrediction(pkg: Package, prediction: VulnerabilityPrediction): void {
    const key = this.generatePackageKey(pkg);
    
    // Dynamic TTL based on risk score - higher risk = shorter TTL for fresh analysis
    let ttl = this.DEFAULT_TTL;
    if (prediction.riskScore >= 80) {
      ttl = 1000 * 60 * 10; // 10 minutes for high risk
    } else if (prediction.riskScore >= 50) {
      ttl = 1000 * 60 * 20; // 20 minutes for medium risk
    } else {
      ttl = 1000 * 60 * 60; // 1 hour for low risk
    }

    this.predictionCache.set(key, {
      data: prediction,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    });

    this.updateStats();
    this.enforceMaxSize();
  }

  /**
   * Retrieve cached prediction
   */
  getCachedPrediction(pkg: Package): VulnerabilityPrediction | null {
    const key = this.generatePackageKey(pkg);
    const entry = this.predictionCache.get(key);
    
    this.stats.totalQueries++;
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.predictionCache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    this.updateHitRate();

    return entry.data;
  }

  /**
   * Cache typosquatting analysis results
   */
  cacheTyposquattingResult(packageName: string, result: { isTyposquat: boolean; target: string; confidence: number }): void {
    this.typosquattingCache.set(packageName, {
      data: result,
      timestamp: Date.now(),
      ttl: 1000 * 60 * 60 * 2, // 2 hours - typosquatting rarely changes
      accessCount: 0,
      lastAccessed: Date.now()
    });
  }

  /**
   * Get cached typosquatting result
   */
  getCachedTyposquattingResult(packageName: string): { isTyposquat: boolean; target: string; confidence: number } | null {
    const entry = this.typosquattingCache.get(packageName);
    
    if (!entry || Date.now() - entry.timestamp > entry.ttl) {
      if (entry) this.typosquattingCache.delete(packageName);
      return null;
    }

    entry.accessCount++;
    entry.lastAccessed = Date.now();
    return entry.data;
  }

  /**
   * Cache pattern analysis results
   */
  cachePatternResult(content: string, result: { score: number; threats: string[] }): void {
    const key = crypto.createHash('md5').update(content).digest('hex');
    this.patternCache.set(key, {
      data: result,
      timestamp: Date.now(),
      ttl: 1000 * 60 * 60, // 1 hour
      accessCount: 0,
      lastAccessed: Date.now()
    });
  }

  /**
   * Get cached pattern result
   */
  getCachedPatternResult(content: string): { score: number; threats: string[] } | null {
    const key = crypto.createHash('md5').update(content).digest('hex');
    const entry = this.patternCache.get(key);
    
    if (!entry || Date.now() - entry.timestamp > entry.ttl) {
      if (entry) this.patternCache.delete(key);
      return null;
    }

    entry.accessCount++;
    entry.lastAccessed = Date.now();
    return entry.data;
  }

  /**
   * Warm cache with commonly analyzed packages
   */
  async warmCache(packages: Package[], predictions: VulnerabilityPrediction[]): Promise<void> {
    if (packages.length !== predictions.length) {
      logger.warn('⚠️ Package and prediction arrays length mismatch during cache warming');
      return;
    }

    let warmed = 0;
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      const prediction = predictions[i];
      if (pkg && prediction) {
        this.cachePrediction(pkg, prediction);
        warmed++;
      }
    }

    logger.info(`🔥 Cache warmed with ${warmed} predictions`);
  }

  /**
   * Bulk cache operations for batch processing
   */
  batchCachePredictions(packagePredictionPairs: Array<{ pkg: Package; prediction: VulnerabilityPrediction }>): void {
    const startTime = Date.now();
    
    for (const { pkg, prediction } of packagePredictionPairs) {
      this.cachePrediction(pkg, prediction);
    }

    const duration = Date.now() - startTime;
    logger.info(`⚡ Batch cached ${packagePredictionPairs.length} predictions in ${duration}ms`);
  }

  /**
   * Intelligent cache eviction using LFU + TTL
   */
  private enforceMaxSize(): void {
    if (this.predictionCache.size <= this.MAX_CACHE_SIZE) return;

    // Sort by access frequency and last access time
    const entries = Array.from(this.predictionCache.entries())
      .sort((a, b) => {
        // First by access count (ascending)
        if (a[1].accessCount !== b[1].accessCount) {
          return a[1].accessCount - b[1].accessCount;
        }
        // Then by last accessed (ascending - older first)
        return a[1].lastAccessed - b[1].lastAccessed;
      });

    // Remove 20% of least used entries
    const toRemove = Math.floor(this.MAX_CACHE_SIZE * 0.2);
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const entry = entries[i];
      if (entry) {
        this.predictionCache.delete(entry[0]);
      }
    }

    logger.debug(`🧹 Evicted ${toRemove} cache entries using LFU policy`);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    // Clean prediction cache
    Array.from(this.predictionCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > entry.ttl) {
        this.predictionCache.delete(key);
        cleaned++;
      }
    });

    // Clean typosquatting cache
    Array.from(this.typosquattingCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > entry.ttl) {
        this.typosquattingCache.delete(key);
        cleaned++;
      }
    });

    // Clean pattern cache
    Array.from(this.patternCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > entry.ttl) {
        this.patternCache.delete(key);
        cleaned++;
      }
    });

    if (cleaned > 0) {
      logger.debug(`🗑️ Cleaned ${cleaned} expired cache entries`);
    }

    this.updateStats();
  }

  /**
   * Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
    // Allow process to exit naturally without waiting for interval
    if (typeof this.cleanupTimer.unref === 'function') {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(): void {
    this.stats.size = this.predictionCache.size + this.typosquattingCache.size + this.patternCache.size;
  }

  /**
   * Update hit rate calculation
   */
  private updateHitRate(): void {
    this.stats.hitRate = this.stats.totalQueries > 0 
      ? (this.stats.hits / this.stats.totalQueries) * 100 
      : 0;
  }

  /**
   * Get cache performance statistics
   */
  getStats(): CacheStats {
    this.updateStats();
    return { ...this.stats };
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.predictionCache.clear();
    this.typosquattingCache.clear();
    this.patternCache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0,
      totalQueries: 0
    };
    logger.info('🧹 All caches cleared');
  }

  /**
   * Precompute common patterns for performance
   */
  precomputeCommonPatterns(): void {
    const commonMaliciousPatterns = [
      'curl https://evil.com',
      'eval(Buffer.from(',
      'child_process.exec',
      'process.env.HOME',
      'mining@crypto',
      'steal@credentials'
    ];

    for (const pattern of commonMaliciousPatterns) {
      this.cachePatternResult(pattern, {
        score: 50,
        threats: ['Precomputed malicious pattern detected']
      });
    }

    logger.info('🎯 Precomputed common malicious patterns for fast lookup');
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
    logger.info('💥 Cache manager destroyed');
  }
}

// Global cache instance
export const cacheManager = new CacheManager();
