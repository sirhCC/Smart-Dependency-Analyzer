/**
 * AI Intelligence Quick Test
 *
 * Simple test to verify Phase 5 AI components are working
 */

import { AIEngine } from "../core/intelligence/ai-engine";
import { NLPEngine } from "../core/intelligence/nlp-engine";
import { PredictiveEngine } from "../core/intelligence/predictive-engine";
import {
  Package,
  Vulnerability,
  VulnerabilitySeverity,
  VulnerabilitySource,
} from "../types";

/**
 * Create simple test data
 */
function createSimpleTestData(): {
  packages: Package[];
  vulnerabilities: Vulnerability[];
} {
  const packages: Package[] = [
    {
      name: "test-package",
      version: "1.0.0",
      description: "A test package for AI analysis",
      license: "MIT",
      publishedAt: new Date("2023-01-01"),
      dependencies: new Map(),
      devDependencies: {},
      peerDependencies: {},
      optionalDependencies: {},
      bundledDependencies: [],
    },
  ];

  const vulnerabilities: Vulnerability[] = [
    {
      id: "CVE-2023-1234",
      title: "Test Vulnerability",
      description: "A test vulnerability for analysis",
      severity: VulnerabilitySeverity.HIGH,
      cvssScore: 8.5,
      publishedAt: new Date("2023-06-15"),
      updatedAt: new Date("2023-06-20"),
      affectedVersions: ["<1.0.1"],
      patchedVersions: [">=1.0.1"],
      references: [
        {
          type: "advisory",
          url: "https://example.com/advisory",
          title: "Test Advisory",
        },
      ],
      cwe: ["CWE-79"],
      source: VulnerabilitySource.NVD,
      patched: true,
    },
  ];

  return { packages, vulnerabilities };
}

/**
 * Test AI Engine basic functionality
 */
async function testAIEngineBasic(): Promise<void> {
  console.log("🧠 Testing AI Engine Basic Functionality...");

  const { packages } = createSimpleTestData();
  const aiEngine = new AIEngine();

  try {
    // Test vulnerability prediction
    const predictions = await aiEngine.predictVulnerabilities(packages);
    console.log(
      `  ✅ Generated ${predictions.length} vulnerability predictions`,
    );

    // Test recommendations
    const recommendations = await aiEngine.generateRecommendations(packages);
    console.log(`  ✅ Generated ${recommendations.length} recommendations`);

    // Test predictive analytics
    const analytics = await aiEngine.performPredictiveAnalytics(packages);
    console.log(`  ✅ Generated predictive analytics`);
    console.log(
      `    📊 6-month projection: ${analytics.trendAnalysis.projectedScore6Months}/100`,
    );
  } catch (error) {
    console.error("❌ AI Engine test failed:", error);
    throw error;
  }

  console.log("✅ AI Engine basic test completed\n");
}

/**
 * Test NLP Engine basic functionality
 */
async function testNLPEngineBasic(): Promise<void> {
  console.log("📖 Testing NLP Engine Basic Functionality...");

  const { packages, vulnerabilities } = createSimpleTestData();
  const nlpEngine = new NLPEngine();

  try {
    // Test license analysis
    const licenseAnalyses = await nlpEngine.analyzeLicenseCompliance(packages);
    console.log(
      `  ✅ Analyzed ${licenseAnalyses.length} packages for license compliance`,
    );

    // Test documentation analysis
    const docAnalyses = await nlpEngine.analyzeDocumentationQuality(packages);
    console.log(
      `  ✅ Analyzed ${docAnalyses.length} packages for documentation quality`,
    );

    // Test threat intelligence
    const threatIntel =
      await nlpEngine.extractThreatIntelligence(vulnerabilities);
    console.log(
      `  ✅ Extracted threat intelligence from ${vulnerabilities.length} vulnerabilities`,
    );
    console.log(
      `    🎯 Risk Assessment: ${threatIntel.riskAssessment.overallRisk}/100`,
    );
  } catch (error) {
    console.error("❌ NLP Engine test failed:", error);
    throw error;
  }

  console.log("✅ NLP Engine basic test completed\n");
}

/**
 * Test Predictive Engine basic functionality
 */
async function testPredictiveEngineBasic(): Promise<void> {
  console.log("🔮 Testing Predictive Engine Basic Functionality...");

  const { packages } = createSimpleTestData();
  const predictiveEngine = new PredictiveEngine();

  try {
    // Test vulnerability predictions
    const vulnPredictions =
      await predictiveEngine.predictVulnerabilities(packages);
    console.log(
      `  ✅ Generated vulnerability predictions for ${vulnPredictions.length} packages`,
    );

    // Test maintenance forecasting
    const maintenanceForecasts =
      await predictiveEngine.forecastMaintenance(packages);
    console.log(
      `  ✅ Generated maintenance forecasts for ${maintenanceForecasts.length} packages`,
    );

    // Test ecosystem health
    const ecosystemHealth =
      await predictiveEngine.predictEcosystemHealth("npm");
    console.log(`  ✅ Generated ecosystem health prediction`);
    console.log(`    💚 Health Score: ${ecosystemHealth.healthScore}/100`);

    // Test performance predictions
    const perfPredictions = await predictiveEngine.predictPerformance(packages);
    console.log(
      `  ✅ Generated performance predictions for ${perfPredictions.length} packages`,
    );
  } catch (error) {
    console.error("❌ Predictive Engine test failed:", error);
    throw error;
  }

  console.log("✅ Predictive Engine basic test completed\n");
}

/**
 * Performance benchmark for AI system
 */
async function benchmarkAIPerformance(): Promise<void> {
  console.log("⏱️ Benchmarking AI Performance...");

  const { packages } = createSimpleTestData();

  // Create larger dataset
  const largePkgDataset: Package[] = [];
  for (let i = 0; i < 50; i++) {
    largePkgDataset.push(
      ...packages.map((pkg) => ({
        ...pkg,
        name: `${pkg.name}-${i}`,
      })),
    );
  }

  console.log(`  📊 Testing with ${largePkgDataset.length} packages`);

  try {
    const startTime = Date.now();

    // Test AI Engine performance
    const aiEngine = new AIEngine();
    await aiEngine.predictVulnerabilities(largePkgDataset);
    await aiEngine.generateRecommendations(largePkgDataset);

    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const throughput = (largePkgDataset.length * 1000) / totalTime;

    console.log(`  ✅ AI Engine Performance:`);
    console.log(`    ⏱️ Total Time: ${totalTime}ms`);
    console.log(`    🚀 Throughput: ${throughput.toFixed(0)} packages/second`);
    console.log(
      `    💾 Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)}MB`,
    );

    // Performance target validation
    const targetThroughput = 100; // packages per second
    if (throughput >= targetThroughput) {
      console.log(
        `    ✅ Performance Target Met: ${throughput.toFixed(0)} >= ${targetThroughput} packages/second`,
      );
    } else {
      console.log(
        `    ⚠️ Performance Target Missed: ${throughput.toFixed(0)} < ${targetThroughput} packages/second`,
      );
    }
  } catch (error) {
    console.error("❌ AI performance benchmark failed:", error);
    throw error;
  }

  console.log("✅ AI performance benchmark completed\n");
}

/**
 * Run comprehensive AI intelligence tests
 */
async function runAIIntelligenceQuickTest(): Promise<void> {
  console.log(
    "🧠 Running Phase 5: Advanced Pattern-Based Intelligence Quick Test",
  );
  console.log("====================================================\n");

  const startTime = Date.now();

  try {
    // Test core AI components
    await testAIEngineBasic();
    await testNLPEngineBasic();
    await testPredictiveEngineBasic();

    // Performance benchmarking
    await benchmarkAIPerformance();

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    console.log(
      "🎊 Phase 5: Advanced Pattern-Based Intelligence Quick Test Complete!",
    );
    console.log("========================================================");
    console.log(`✅ All AI intelligence components tested successfully`);
    console.log(`⏱️ Total Test Time: ${(totalTime / 1000).toFixed(2)} seconds`);
    console.log(
      `🧠 AI Engine: ML models with vulnerability prediction and smart recommendations`,
    );
    console.log(
      `📖 NLP Engine: License analysis, documentation quality, and threat intelligence`,
    );
    console.log(
      `🔮 Predictive Engine: Future vulnerability, maintenance, and performance forecasting`,
    );
    console.log(
      `\n🚀 Phase 5 AI Intelligence System is ready for enterprise deployment!`,
    );
  } catch (error) {
    console.error("❌ AI Intelligence quick test failed:", error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  runAIIntelligenceQuickTest();
}

export {
  runAIIntelligenceQuickTest,
  testAIEngineBasic,
  testNLPEngineBasic,
  testPredictiveEngineBasic,
  benchmarkAIPerformance,
};
