"use strict";
/**
 * Comprehensive AI Intelligence System Test
 *
 * Tests all Phase 5 AI-powered intelligence components:
 * - AI Engine with ML models
 * - Natural Language Processing
 * - Predictive Analytics
 * - ML Training Infrastructure
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAIIntelligenceTests = runAIIntelligenceTests;
exports.testAIEngine = testAIEngine;
exports.testNLPEngine = testNLPEngine;
exports.testPredictiveEngine = testPredictiveEngine;
exports.testMLTrainingEngine = testMLTrainingEngine;
exports.benchmarkAIPerformance = benchmarkAIPerformance;
const ai_engine_1 = require("../core/intelligence/ai-engine");
const nlp_engine_1 = require("../core/intelligence/nlp-engine");
const predictive_engine_1 = require("../core/intelligence/predictive-engine");
const ml_training_1 = require("../core/intelligence/ml-training");
const types_1 = require("../types");
/**
 * Create comprehensive test data for AI intelligence testing
 */
function createAITestData() {
    // Create diverse package dataset for comprehensive AI testing
    const packages = [
        {
            name: 'react',
            version: '18.2.0',
            description: 'A JavaScript library for building user interfaces',
            license: 'MIT',
            repository: {
                type: 'git',
                url: 'https://github.com/facebook/react.git',
            },
            maintainers: [
                { name: 'React Team', email: 'react-core@fb.com' },
            ],
            keywords: ['react', 'ui', 'component'],
            publishedAt: new Date('2022-06-14'),
            fileSize: 156000,
            dependencies: new Map([
                ['loose-envify', {
                        name: 'loose-envify',
                        version: '^1.1.0',
                        type: 'production',
                        resolved: true,
                    }],
            ]),
            devDependencies: {
                'typescript': '^4.9.0',
                'jest': '^29.0.0',
            },
            peerDependencies: {},
            optionalDependencies: {},
            bundledDependencies: [],
            engines: { node: '>=14' },
        },
        {
            name: 'lodash',
            version: '4.17.21',
            description: 'Lodash modular utilities',
            license: 'MIT',
            repository: {
                type: 'git',
                url: 'https://github.com/lodash/lodash.git',
            },
            maintainers: [
                { name: 'John-David Dalton', email: 'john.david.dalton@gmail.com' },
            ],
            keywords: ['lodash', 'utility', 'functional'],
            publishedAt: new Date('2021-02-20'),
            fileSize: 72000,
            dependencies: new Map(),
            devDependencies: {
                'benchmark': '^2.1.4',
                'chalk': '^4.1.0',
            },
            peerDependencies: {},
            optionalDependencies: {},
            bundledDependencies: [],
            engines: { node: '>=8' },
        },
        {
            name: 'express',
            version: '4.18.2',
            description: 'Fast, unopinionated, minimalist web framework',
            license: 'MIT',
            repository: {
                type: 'git',
                url: 'https://github.com/expressjs/express.git',
            },
            maintainers: [
                { name: 'Express Team', email: 'express@expressjs.com' },
            ],
            keywords: ['express', 'web', 'framework', 'server'],
            publishedAt: new Date('2022-10-08'),
            fileSize: 125000,
            dependencies: new Map([
                ['accepts', {
                        name: 'accepts',
                        version: '~1.3.8',
                        type: 'production',
                        resolved: true,
                    }],
                ['array-flatten', {
                        name: 'array-flatten',
                        version: '1.1.1',
                        type: 'production',
                        resolved: true,
                    }],
                ['body-parser', {
                        name: 'body-parser',
                        version: '1.20.1',
                        type: 'production',
                        resolved: true,
                    }],
            ]),
            devDependencies: {
                'mocha': '^10.0.0',
                'supertest': '^6.3.0',
            },
            peerDependencies: {},
            optionalDependencies: {},
            bundledDependencies: [],
            engines: { node: '>=12' },
        },
        {
            name: 'legacy-crypto-utils',
            version: '1.0.5',
            description: 'Legacy cryptographic utilities (deprecated)',
            license: 'ISC',
            repository: {
                type: 'git',
                url: 'https://github.com/legacy/crypto-utils.git',
            },
            maintainers: [
                { name: 'Legacy Maintainer', email: 'legacy@example.com' },
            ],
            keywords: ['crypto', 'legacy', 'deprecated'],
            publishedAt: new Date('2018-01-15'),
            fileSize: 45000,
            dependencies: new Map([
                ['node-forge', {
                        name: 'node-forge',
                        version: '^0.8.0',
                        type: 'production',
                        resolved: true,
                    }],
            ]),
            devDependencies: {
                'tape': '^4.0.0',
            },
            peerDependencies: {},
            optionalDependencies: {},
            bundledDependencies: [],
            engines: { node: '>=6' },
        },
    ];
    // Create realistic vulnerability data
    const vulnerabilities = [
        {
            id: 'CVE-2023-1234',
            title: 'Cryptographic Weakness in Legacy Utils',
            description: 'Cryptographic weakness in legacy encryption routines allows potential data exposure',
            severity: types_1.VulnerabilitySeverity.HIGH,
            cvssScore: 8.5,
            publishedAt: new Date('2023-06-15'),
            updatedAt: new Date('2023-06-20'),
            affectedVersions: ['<1.0.6'],
            patchedVersions: [],
            references: [
                { type: 'advisory', url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-1234', title: 'NVD Advisory' },
                { type: 'report', url: 'https://github.com/legacy/crypto-utils/security/advisories/GHSA-xxxx', title: 'GitHub Advisory' },
            ],
            cwe: ['CWE-327'],
            source: types_1.VulnerabilitySource.NVD,
            patched: false,
        },
        {
            id: 'CVE-2023-5678',
            title: 'Express XSS Vulnerability',
            description: 'Cross-site scripting vulnerability in error handling middleware',
            severity: types_1.VulnerabilitySeverity.MEDIUM,
            cvssScore: 6.1,
            publishedAt: new Date('2023-09-20'),
            updatedAt: new Date('2023-09-25'),
            affectedVersions: ['<4.18.3'],
            patchedVersions: ['>=4.18.3'],
            references: [
                { type: 'advisory', url: 'https://nvd.nist.gov/vuln/detail/CVE-2023-5678', title: 'NVD Advisory' },
                { type: 'fix', url: 'https://expressjs.com/en/advanced/security-updates.html', title: 'Express Security Update' },
            ],
            cwe: ['CWE-79'],
            source: types_1.VulnerabilitySource.NVD,
            patched: true,
        },
        {
            id: 'GHSA-9999-abcd',
            title: 'Lodash Prototype Pollution',
            description: 'Prototype pollution vulnerability in merge function',
            severity: types_1.VulnerabilitySeverity.LOW,
            cvssScore: 3.7,
            publishedAt: new Date('2023-08-10'),
            updatedAt: new Date('2023-08-15'),
            affectedVersions: ['<4.17.22'],
            patchedVersions: ['>=4.17.22'],
            references: [
                { type: 'advisory', url: 'https://github.com/lodash/lodash/security/advisories/GHSA-9999-abcd', title: 'GitHub Advisory' },
            ],
            cwe: ['CWE-1321'],
            source: types_1.VulnerabilitySource.GITHUB,
            patched: true,
        },
    ];
    return { packages, vulnerabilities };
}
/**
 * Test AI Engine functionality
 */
async function testAIEngine() {
    console.log('🧠 Testing AI Engine...');
    const { packages } = createAITestData();
    const aiEngine = new ai_engine_1.AIEngine({
        enableVulnerabilityPrediction: true,
        enableSmartRecommendations: true,
        enablePredictiveAnalytics: true,
        confidenceThreshold: 0.7,
    });
    try {
        // Test vulnerability prediction
        console.log('  🎯 Testing vulnerability prediction...');
        const vulnPredictions = await aiEngine.predictVulnerabilities(packages);
        console.log(`  ✅ Generated ${vulnPredictions.length} vulnerability predictions`);
        for (const prediction of vulnPredictions) {
            console.log(`    📦 ${prediction.packageName}: Risk Score ${prediction.riskScore}/100 (${prediction.confidence.toFixed(2)} confidence)`);
            if (prediction.riskScore > 70) {
                console.log(`    🚨 High risk package detected`);
            }
        }
        // Test smart recommendations
        console.log('  💡 Testing smart recommendations...');
        const recommendations = await aiEngine.generateRecommendations(packages);
        console.log(`  ✅ Generated ${recommendations.length} smart recommendations`);
        for (const rec of recommendations) {
            console.log(`    📦 ${rec.currentPackage}: ${rec.type} - ${rec.recommendedAction}`);
            console.log(`    📊 Priority: ${rec.priority}, Confidence: ${rec.confidence.toFixed(2)}`);
        }
        // Test predictive analytics
        console.log('  📈 Testing predictive analytics...');
        const analytics = await aiEngine.performPredictiveAnalytics(packages);
        console.log(`  ✅ Generated predictive analytics with ${analytics.futureVulnerabilities.length} vulnerability predictions`);
        console.log(`  🎯 Security Trend: ${analytics.trendAnalysis.securityTrend}`);
        console.log(`  📊 Project Health Score: ${analytics.projectHealthScore}/100`);
    }
    catch (error) {
        console.error('❌ AI Engine test failed:', error);
        throw error;
    }
    console.log('✅ AI Engine tests completed successfully\n');
}
/**
 * Test NLP Engine functionality
 */
async function testNLPEngine() {
    console.log('📖 Testing NLP Engine...');
    const { packages } = createAITestData();
    const nlpEngine = new nlp_engine_1.NLPEngine({
        enableLicenseAnalysis: true,
        enableDocumentationAnalysis: true,
        enableThreatIntelligence: true,
        sentimentThreshold: 0.1,
    });
    try {
        // Test license compliance analysis
        console.log('  ⚖️ Testing license compliance analysis...');
        const licenseAnalyses = await nlpEngine.analyzeLicenseCompliance(packages);
        console.log(`  ✅ Analyzed license compliance for ${licenseAnalyses.length} packages`);
        for (const analysis of licenseAnalyses) {
            console.log(`    📦 ${analysis.packageName}: Compliance Score ${analysis.complianceScore}/100 (${analysis.riskLevel} risk)`);
            console.log(`    📄 Detected ${analysis.detectedLicenses.length} licenses`);
            if (analysis.potentialConflicts.length > 0) {
                console.log(`    ⚠️ ${analysis.potentialConflicts.length} potential license conflicts`);
            }
        }
        // Test documentation quality analysis
        console.log('  📝 Testing documentation quality analysis...');
        const docAnalyses = await nlpEngine.analyzeDocumentationQuality(packages);
        console.log(`  ✅ Analyzed documentation quality for ${docAnalyses.length} packages`);
        for (const analysis of docAnalyses) {
            console.log(`    📦 ${analysis.packageName}: Quality Score ${analysis.qualityScore}/100`);
            console.log(`    📖 Readability: ${analysis.readabilityScore}/100, Completeness: ${analysis.completenessScore}/100`);
            console.log(`    💭 Sentiment: ${analysis.sentiment.emotionalTone} (${analysis.sentiment.overall.toFixed(2)})`);
        }
        // Test threat intelligence extraction
        console.log('  🔍 Testing threat intelligence extraction...');
        const { vulnerabilities } = createAITestData();
        const threatIntel = await nlpEngine.extractThreatIntelligence(vulnerabilities);
        console.log(`  ✅ Extracted ${threatIntel.extractedThreats.length} threats from vulnerability data`);
        console.log(`    🎯 Overall Risk: ${threatIntel.riskAssessment.overallRisk}/100 (${threatIntel.riskAssessment.urgency} urgency)`);
        console.log(`    🔍 Found ${threatIntel.indicators.length} threat indicators`);
        console.log(`    🛡️ Generated ${threatIntel.mitigationStrategies.length} mitigation strategies`);
    }
    catch (error) {
        console.error('❌ NLP Engine test failed:', error);
        throw error;
    }
    console.log('✅ NLP Engine tests completed successfully\n');
}
/**
 * Test Predictive Engine functionality
 */
async function testPredictiveEngine() {
    console.log('🔮 Testing Predictive Engine...');
    const { packages } = createAITestData();
    const predictiveEngine = new predictive_engine_1.PredictiveEngine({
        enableVulnerabilityPrediction: true,
        enableMaintenanceForecasting: true,
        enableEcosystemPrediction: true,
        predictionHorizonDays: 365,
        confidenceThreshold: 0.7,
    });
    try {
        // Test vulnerability predictions
        console.log('  🎯 Testing vulnerability predictions...');
        const vulnPredictions = await predictiveEngine.predictVulnerabilities(packages);
        console.log(`  ✅ Generated vulnerability predictions for ${vulnPredictions.length} packages`);
        for (const prediction of vulnPredictions) {
            console.log(`    📦 ${prediction.packageName}: Overall Risk ${prediction.overallRiskScore}/100`);
            console.log(`    📊 ${prediction.predictions.length} time-based forecasts (${prediction.confidence.toFixed(2)} confidence)`);
            console.log(`    🔍 ${prediction.riskFactors.length} risk factors identified`);
        }
        // Test maintenance forecasting
        console.log('  📊 Testing maintenance forecasting...');
        const maintenanceForecasts = await predictiveEngine.forecastMaintenance(packages);
        console.log(`  ✅ Generated maintenance forecasts for ${maintenanceForecasts.length} packages`);
        for (const forecast of maintenanceForecasts) {
            console.log(`    📦 ${forecast.packageName}: Current Score ${forecast.currentMaintenanceScore}/100`);
            console.log(`    🔮 Sustainability Outlook: ${forecast.sustainabilityOutlook}`);
            console.log(`    📈 ${forecast.predictions.length} future predictions, ${forecast.keyMetrics.length} key metrics`);
        }
        // Test ecosystem health prediction
        console.log('  🌍 Testing ecosystem health prediction...');
        const ecosystemHealth = await predictiveEngine.predictEcosystemHealth('npm');
        console.log(`  ✅ Generated ecosystem health prediction for npm`);
        console.log(`    💚 Health Score: ${ecosystemHealth.healthScore}/100`);
        console.log(`    📈 ${ecosystemHealth.predictions.length} forecasts, ${ecosystemHealth.emergingTrends.length} emerging trends`);
        console.log(`    ⚠️ ${ecosystemHealth.riskAreas.length} risk areas, ${ecosystemHealth.opportunities.length} opportunities`);
        // Test performance predictions
        console.log('  ⚡ Testing performance predictions...');
        const perfPredictions = await predictiveEngine.predictPerformance(packages);
        console.log(`  ✅ Generated performance predictions for ${perfPredictions.length} packages`);
        for (const prediction of perfPredictions) {
            console.log(`    📦 ${prediction.packageName}: Load Time ${prediction.currentPerformance.loadTime.toFixed(1)}ms`);
            console.log(`    📊 Bundle Size: ${prediction.currentPerformance.bundleSize.toFixed(0)}KB`);
            console.log(`    🔮 ${prediction.predictions.length} forecasts, ${prediction.bottlenecks.length} potential bottlenecks`);
        }
    }
    catch (error) {
        console.error('❌ Predictive Engine test failed:', error);
        throw error;
    }
    console.log('✅ Predictive Engine tests completed successfully\n');
}
/**
 * Test ML Training Engine functionality
 */
async function testMLTrainingEngine() {
    console.log('🏋️ Testing ML Training Engine...');
    const { packages, vulnerabilities } = createAITestData();
    const trainingEngine = new ml_training_1.MLTrainingEngine({
        enableTraining: true,
        models: [
            {
                name: 'vulnerability-neural-net',
                type: 'neural-network',
                target: 'vulnerability',
                architecture: {
                    hiddenUnits: [128, 64, 32],
                    dropoutRate: 0.3,
                    activationFunction: 'relu',
                    optimizer: 'adam',
                    learningRate: 0.001,
                },
                hyperparameters: {
                    epochs: 50,
                    batchSize: 32,
                },
                features: [
                    { name: 'age', type: 'numerical', source: 'package', transformation: 'normalize', importance: 0.8 },
                    { name: 'popularity', type: 'numerical', source: 'package', transformation: 'standardize', importance: 0.9 },
                ],
            },
            {
                name: 'maintenance-random-forest',
                type: 'random-forest',
                target: 'maintenance',
                architecture: {
                    inputDimension: 15,
                    outputDimension: 1,
                },
                hyperparameters: {
                    nTrees: 100,
                    maxDepth: 10,
                },
                features: [
                    { name: 'commit_frequency', type: 'numerical', source: 'git', transformation: 'normalize', importance: 0.7 },
                    { name: 'issue_response_time', type: 'numerical', source: 'github', transformation: 'standardize', importance: 0.8 },
                ],
            },
        ],
    });
    try {
        // Test vulnerability model training
        console.log('  🎯 Testing vulnerability model training...');
        const vulnResults = await trainingEngine.trainVulnerabilityModels(packages, vulnerabilities);
        console.log(`  ✅ Trained ${vulnResults.length} vulnerability models`);
        for (const result of vulnResults) {
            console.log(`    🤖 ${result.modelName}: ${result.status}`);
            if (result.status === 'success') {
                console.log(`    📊 Accuracy: ${result.trainingMetrics.accuracy.toFixed(3)}, F1: ${result.trainingMetrics.f1Score.toFixed(3)}`);
                console.log(`    ⏱️ Training Time: ${result.trainingTime.toFixed(2)}s, Memory: ${result.memoryUsage.toFixed(1)}MB`);
            }
        }
        // Test maintenance model training
        console.log('  📊 Testing maintenance model training...');
        const maintenanceResults = await trainingEngine.trainMaintenanceModels(packages);
        console.log(`  ✅ Trained ${maintenanceResults.length} maintenance models`);
        for (const result of maintenanceResults) {
            console.log(`    🤖 ${result.modelName}: ${result.status}`);
            if (result.status === 'success') {
                console.log(`    📈 Validation Accuracy: ${result.validationMetrics.accuracy.toFixed(3)}`);
                console.log(`    🎯 Feature Importance: ${result.featureImportance.length} features analyzed`);
            }
        }
        // Test model evaluation
        console.log('  📊 Testing model evaluation...');
        const modelIds = [...vulnResults, ...maintenanceResults]
            .filter(r => r.status === 'success')
            .map(r => r.modelId);
        const evaluations = await trainingEngine.evaluateModels(modelIds);
        console.log(`  ✅ Evaluated ${evaluations.length} models`);
        for (const evaluation of evaluations) {
            console.log(`    🎯 Model ${evaluation.modelId}: Deployment Score ${evaluation.deployment.score}/100`);
            console.log(`    ⚡ Estimated Latency: ${evaluation.deployment.estimatedLatency}ms`);
            console.log(`    💾 Memory Footprint: ${evaluation.deployment.memoryFootprint}MB`);
        }
        // Test training report generation
        console.log('  📝 Testing training report generation...');
        const allResults = [...vulnResults, ...maintenanceResults];
        const report = await trainingEngine.generateTrainingReport(allResults);
        console.log(`  ✅ Generated comprehensive training report (${report.length} characters)`);
    }
    catch (error) {
        console.error('❌ ML Training Engine test failed:', error);
        throw error;
    }
    console.log('✅ ML Training Engine tests completed successfully\n');
}
/**
 * Performance benchmark for AI intelligence system
 */
async function benchmarkAIPerformance() {
    console.log('⏱️ Benchmarking AI Intelligence Performance...');
    const { packages, vulnerabilities } = createAITestData();
    // Create larger dataset for performance testing
    const largePkgDataset = [];
    for (let i = 0; i < 100; i++) {
        largePkgDataset.push(...packages.map(pkg => ({
            ...pkg,
            name: `${pkg.name}-${i}`,
        })));
    }
    console.log(`  📊 Testing with ${largePkgDataset.length} packages and ${vulnerabilities.length} vulnerabilities`);
    try {
        // Benchmark AI Engine
        console.log('  🧠 Benchmarking AI Engine...');
        const aiEngine = new ai_engine_1.AIEngine();
        const aiStartTime = Date.now();
        const vulnPredictions = await aiEngine.predictVulnerabilities(largePkgDataset);
        const recommendations = await aiEngine.generateRecommendations(largePkgDataset);
        const aiEndTime = Date.now();
        const aiTime = aiEndTime - aiStartTime;
        console.log(`  ✅ AI Engine: ${aiTime}ms for ${largePkgDataset.length} packages`);
        console.log(`    🎯 ${vulnPredictions.length} predictions, ${recommendations.length} recommendations`);
        console.log(`    📊 Performance: ${((largePkgDataset.length * 1000) / aiTime).toFixed(0)} packages/second`);
        // Benchmark NLP Engine
        console.log('  📖 Benchmarking NLP Engine...');
        const nlpEngine = new nlp_engine_1.NLPEngine();
        const nlpStartTime = Date.now();
        const licenseAnalyses = await nlpEngine.analyzeLicenseCompliance(largePkgDataset);
        const docAnalyses = await nlpEngine.analyzeDocumentationQuality(largePkgDataset);
        const nlpEndTime = Date.now();
        const nlpTime = nlpEndTime - nlpStartTime;
        console.log(`  ✅ NLP Engine: ${nlpTime}ms for ${largePkgDataset.length} packages`);
        console.log(`    ⚖️ ${licenseAnalyses.length} license analyses, ${docAnalyses.length} doc analyses`);
        console.log(`    📊 Performance: ${((largePkgDataset.length * 1000) / nlpTime).toFixed(0)} packages/second`);
        // Benchmark Predictive Engine
        console.log('  🔮 Benchmarking Predictive Engine...');
        const predictiveEngine = new predictive_engine_1.PredictiveEngine();
        const predStartTime = Date.now();
        const vulnForecast = await predictiveEngine.predictVulnerabilities(largePkgDataset);
        const maintenanceForecast = await predictiveEngine.forecastMaintenance(largePkgDataset);
        const predEndTime = Date.now();
        const predTime = predEndTime - predStartTime;
        console.log(`  ✅ Predictive Engine: ${predTime}ms for ${largePkgDataset.length} packages`);
        console.log(`    🎯 ${vulnForecast.length} vulnerability forecasts, ${maintenanceForecast.length} maintenance forecasts`);
        console.log(`    📊 Performance: ${((largePkgDataset.length * 1000) / predTime).toFixed(0)} packages/second`);
        // Overall performance summary
        const totalTime = aiTime + nlpTime + predTime;
        console.log(`\n  🏆 Overall AI Intelligence Performance:`);
        console.log(`    ⏱️ Total Time: ${totalTime}ms for ${largePkgDataset.length} packages`);
        console.log(`    🚀 Overall Throughput: ${((largePkgDataset.length * 1000) / totalTime).toFixed(0)} packages/second`);
        console.log(`    💾 Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)}MB`);
        // Validate performance targets
        const targetThroughput = 100; // packages per second
        const actualThroughput = (largePkgDataset.length * 1000) / totalTime;
        if (actualThroughput >= targetThroughput) {
            console.log(`    ✅ Performance Target Met: ${actualThroughput.toFixed(0)} >= ${targetThroughput} packages/second`);
        }
        else {
            console.log(`    ⚠️ Performance Target Missed: ${actualThroughput.toFixed(0)} < ${targetThroughput} packages/second`);
        }
    }
    catch (error) {
        console.error('❌ AI performance benchmark failed:', error);
        throw error;
    }
    console.log('✅ AI Intelligence performance benchmark completed\n');
}
/**
 * Run comprehensive AI intelligence system tests
 */
async function runAIIntelligenceTests() {
    console.log('🧠 Running Phase 5: AI-Powered Intelligence Tests');
    console.log('==================================================\n');
    const startTime = Date.now();
    try {
        // Test individual AI components
        await testAIEngine();
        await testNLPEngine();
        await testPredictiveEngine();
        await testMLTrainingEngine();
        // Performance benchmarking
        await benchmarkAIPerformance();
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        console.log('🎊 Phase 5: AI-Powered Intelligence Tests Complete!');
        console.log('===================================================');
        console.log(`✅ All AI intelligence components tested successfully`);
        console.log(`⏱️ Total Test Time: ${(totalTime / 1000).toFixed(2)} seconds`);
        console.log(`🧠 AI Engine: Advanced ML models with vulnerability prediction`);
        console.log(`📖 NLP Engine: License analysis, documentation quality, threat intelligence`);
        console.log(`🔮 Predictive Engine: Future vulnerability, maintenance, and performance forecasting`);
        console.log(`🏋️ ML Training: Comprehensive model training and evaluation infrastructure`);
        console.log(`\n🚀 Ready for enterprise AI-powered dependency analysis!`);
    }
    catch (error) {
        console.error('❌ AI Intelligence tests failed:', error);
        process.exit(1);
    }
}
// Run the tests if this file is executed directly
if (require.main === module) {
    runAIIntelligenceTests();
}
//# sourceMappingURL=ai-intelligence-test.js.map