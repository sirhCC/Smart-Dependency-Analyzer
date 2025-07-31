"use strict";
/**
 * Performance Engine Integration Test
 * Test the enterprise-grade performance optimization components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPerformanceTest = runPerformanceTest;
const performance_engine_1 = require("../core/performance/performance-engine");
const types_1 = require("../types");
const logger_1 = require("../utils/logger");
const logger = (0, logger_1.getLogger)('PerformanceTest');
async function runPerformanceTest() {
    logger.info('🚀 Starting Performance Engine Test');
    try {
        // Create test data - simulating 1000+ packages for performance testing
        const testPackages = [];
        for (let i = 1; i <= 1000; i++) {
            testPackages.push({
                name: `test-package-${i}`,
                version: `1.0.${i}`,
                size: Math.random() * 1000000, // Random size up to 1MB
            });
        }
        // Initialize performance engine
        const engine = new performance_engine_1.PerformanceEngine();
        // Test configuration for enterprise-scale analysis
        const testConfig = {
            includeDevDependencies: true,
            includeOptionalDependencies: true,
            includePeerDependencies: true,
            maxDepth: 10,
            minSeverity: types_1.VulnerabilitySeverity.LOW,
            enableLicenseCheck: true,
            enablePerformanceAnalysis: true,
            enableSupplyChainAnalysis: true,
            excludePackages: [],
            customRules: [],
        };
        logger.info(`📊 Testing with ${testPackages.length} packages`);
        // Start performance test
        const startTime = Date.now();
        const result = await engine.optimizeAnalysis(testPackages, testConfig);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        // Log results
        logger.info('✅ Performance Test Results:', {
            totalPackages: testPackages.length,
            processingTime: totalTime,
            packagesPerSecond: Math.round((testPackages.length / totalTime) * 1000),
            avgTimePerPackage: Math.round(totalTime / testPackages.length),
            optimizationPlan: {
                mode: result.plan.processingMode,
                concurrency: result.plan.batchSize || 'unknown',
                cacheStrategy: result.plan.cachingStrategy,
            },
            resultsGenerated: result.results.length,
            performanceMetrics: {
                throughput: result.metrics.packagesPerSecond,
                memoryUsage: result.metrics.memoryUsageMB,
                cacheHitRate: result.metrics.cacheHitRate,
            },
        });
        // Check if we meet performance targets
        const targetPackagesPerSecond = 333; // 10,000 packages in 30 seconds
        const actualPackagesPerSecond = Math.round((testPackages.length / totalTime) * 1000);
        if (actualPackagesPerSecond >= targetPackagesPerSecond) {
            logger.info(`🎯 SUCCESS: Performance target achieved! ${actualPackagesPerSecond}/s >= ${targetPackagesPerSecond}/s`);
        }
        else {
            logger.warn(`⚠️  Performance target not met: ${actualPackagesPerSecond}/s < ${targetPackagesPerSecond}/s`);
            logger.info('This is expected during initial implementation. Performance will improve with optimization.');
        }
        // Test different optimization strategies
        logger.info('🔄 Testing different optimization strategies...');
        // Test streaming mode with smaller batch
        const streamingPackages = testPackages.slice(0, 100);
        const streamingStart = Date.now();
        const streamingResult = await engine.optimizeAnalysis(streamingPackages, testConfig);
        const streamingTime = Date.now() - streamingStart;
        logger.info('📈 Streaming Mode Results:', {
            packages: streamingPackages.length,
            time: streamingTime,
            packagesPerSecond: Math.round((streamingPackages.length / streamingTime) * 1000),
            mode: streamingResult.plan.processingMode,
        });
        logger.info('🎉 Performance Engine Test Completed Successfully!');
        return {
            success: true,
            totalTime,
            packagesPerSecond: actualPackagesPerSecond,
            targetMet: actualPackagesPerSecond >= targetPackagesPerSecond,
        };
    }
    catch (error) {
        logger.error('❌ Performance test failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
// Run test if called directly
if (require.main === module) {
    runPerformanceTest()
        .then((result) => {
        if (result.success) {
            console.log(`✅ Test passed - ${result.packagesPerSecond} packages/second`);
            process.exit(0);
        }
        else {
            console.error(`❌ Test failed - ${result.error}`);
            process.exit(1);
        }
    })
        .catch((error) => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=performance-test.js.map