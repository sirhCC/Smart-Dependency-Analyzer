"use strict";
/**
 * Enterprise-grade cache manager for performance optimization
 * Implements intelligent caching strategies for AI predictions and analysis results
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManager = exports.CacheManager = void 0;
const logger_1 = require("../../utils/logger");
const crypto = __importStar(require("crypto"));
class CacheManager {
    predictionCache = new Map();
    typosquattingCache = new Map();
    patternCache = new Map();
    stats = {
        hits: 0,
        misses: 0,
        size: 0,
        hitRate: 0,
        totalQueries: 0
    };
    DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes
    MAX_CACHE_SIZE = 10000;
    CLEANUP_INTERVAL = 1000 * 60 * 5; // 5 minutes
    cleanupTimer = null;
    constructor() {
        this.startCleanupTimer();
        logger_1.logger.info('🚀 Cache manager initialized with intelligent eviction policies');
    }
    /**
     * Generate cache key for package analysis
     */
    generatePackageKey(pkg) {
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
    cachePrediction(pkg, prediction) {
        const key = this.generatePackageKey(pkg);
        // Dynamic TTL based on risk score - higher risk = shorter TTL for fresh analysis
        let ttl = this.DEFAULT_TTL;
        if (prediction.riskScore >= 80) {
            ttl = 1000 * 60 * 10; // 10 minutes for high risk
        }
        else if (prediction.riskScore >= 50) {
            ttl = 1000 * 60 * 20; // 20 minutes for medium risk
        }
        else {
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
    getCachedPrediction(pkg) {
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
    cacheTyposquattingResult(packageName, result) {
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
    getCachedTyposquattingResult(packageName) {
        const entry = this.typosquattingCache.get(packageName);
        if (!entry || Date.now() - entry.timestamp > entry.ttl) {
            if (entry)
                this.typosquattingCache.delete(packageName);
            return null;
        }
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.data;
    }
    /**
     * Cache pattern analysis results
     */
    cachePatternResult(content, result) {
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
    getCachedPatternResult(content) {
        const key = crypto.createHash('md5').update(content).digest('hex');
        const entry = this.patternCache.get(key);
        if (!entry || Date.now() - entry.timestamp > entry.ttl) {
            if (entry)
                this.patternCache.delete(key);
            return null;
        }
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.data;
    }
    /**
     * Warm cache with commonly analyzed packages
     */
    async warmCache(packages, predictions) {
        if (packages.length !== predictions.length) {
            logger_1.logger.warn('⚠️ Package and prediction arrays length mismatch during cache warming');
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
        logger_1.logger.info(`🔥 Cache warmed with ${warmed} predictions`);
    }
    /**
     * Bulk cache operations for batch processing
     */
    batchCachePredictions(packagePredictionPairs) {
        const startTime = Date.now();
        for (const { pkg, prediction } of packagePredictionPairs) {
            this.cachePrediction(pkg, prediction);
        }
        const duration = Date.now() - startTime;
        logger_1.logger.info(`⚡ Batch cached ${packagePredictionPairs.length} predictions in ${duration}ms`);
    }
    /**
     * Intelligent cache eviction using LFU + TTL
     */
    enforceMaxSize() {
        if (this.predictionCache.size <= this.MAX_CACHE_SIZE)
            return;
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
        logger_1.logger.debug(`🧹 Evicted ${toRemove} cache entries using LFU policy`);
    }
    /**
     * Cleanup expired entries
     */
    cleanup() {
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
            logger_1.logger.debug(`🗑️ Cleaned ${cleaned} expired cache entries`);
        }
        this.updateStats();
    }
    /**
     * Start automatic cleanup timer
     */
    startCleanupTimer() {
        this.cleanupTimer = setInterval(() => {
            this.cleanup();
        }, this.CLEANUP_INTERVAL);
    }
    /**
     * Update cache statistics
     */
    updateStats() {
        this.stats.size = this.predictionCache.size + this.typosquattingCache.size + this.patternCache.size;
    }
    /**
     * Update hit rate calculation
     */
    updateHitRate() {
        this.stats.hitRate = this.stats.totalQueries > 0
            ? (this.stats.hits / this.stats.totalQueries) * 100
            : 0;
    }
    /**
     * Get cache performance statistics
     */
    getStats() {
        this.updateStats();
        return { ...this.stats };
    }
    /**
     * Clear all caches
     */
    clear() {
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
        logger_1.logger.info('🧹 All caches cleared');
    }
    /**
     * Precompute common patterns for performance
     */
    precomputeCommonPatterns() {
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
        logger_1.logger.info('🎯 Precomputed common malicious patterns for fast lookup');
    }
    /**
     * Cleanup resources
     */
    destroy() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        this.clear();
        logger_1.logger.info('💥 Cache manager destroyed');
    }
}
exports.CacheManager = CacheManager;
// Global cache instance
exports.cacheManager = new CacheManager();
//# sourceMappingURL=cache-manager.js.map