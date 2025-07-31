#!/usr/bin/env node
"use strict";
/**
 * Smart Dependency Analyzer CLI Entry Point
 * Enterprise-grade dependency analysis with security and license intelligence
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const package_json_1 = require("../../package.json");
const logger_1 = require("../utils/logger");
const package_discovery_1 = require("../core/services/package-discovery");
const vulnerability_scanner_1 = require("../core/services/vulnerability-scanner");
const github_advisory_1 = require("../integrations/security/github-advisory");
const license_intelligence_1 = require("../core/services/license-intelligence");
const logger = logger_1.Logger.getLogger('CLI');
async function main() {
    console.log('🚀 SDA CLI Starting...');
    const program = new commander_1.Command();
    program
        .name('sda')
        .description('Smart Dependency Analyzer - Enterprise dependency intelligence')
        .version(package_json_1.version)
        .configureOutput({
        outputError: (str, write) => write(chalk_1.default.red(str)),
    });
    // Global options
    program
        .option('-v, --verbose', 'Enable verbose logging', false)
        .option('--config <path>', 'Path to configuration file')
        .option('--no-color', 'Disable colored output');
    // Enhanced Analyze command - Phase 3 Implementation
    program
        .command('analyze')
        .description('Comprehensive dependency analysis including security and license intelligence')
        .argument('[path]', 'Path to project directory', process.cwd())
        .option('-o, --output <format>', 'Output format (json, table, html)', 'table')
        .option('--include-dev', 'Include development dependencies', false)
        .option('--severity <level>', 'Minimum severity level (low, medium, high, critical)', 'medium')
        .option('--licenses', 'Include license analysis', true)
        .option('--compatibility', 'Include license compatibility analysis', true)
        .option('--risk', 'Include legal risk assessment', true)
        .option('--save <file>', 'Save results to file')
        .action(async (projectPath, options) => {
        try {
            const startTime = Date.now();
            logger.info(`🔍 Starting comprehensive analysis: ${projectPath}`);
            console.log(chalk_1.default.blue('🚀 Smart Dependency Analyzer - Phase 3'));
            console.log(chalk_1.default.blue('🏢 Enterprise License Intelligence Engine'));
            console.log(chalk_1.default.gray('━'.repeat(60)));
            // Phase 1: Package Discovery
            console.log(chalk_1.default.cyan('\n📦 Phase 1: Package Discovery'));
            const packageDiscovery = (0, package_discovery_1.createPackageDiscoveryService)();
            const discoveryResult = await packageDiscovery.discoverPackages(projectPath, {
                includeDev: options.includeDev
            });
            console.log(chalk_1.default.green(`✅ Discovered ${discoveryResult.packages.length} packages`));
            console.log(`   📊 Package manager: ${discoveryResult.projectInfo.packageManager}`);
            console.log(`   🏢 Monorepo: ${discoveryResult.projectInfo.isMonorepo ? 'Yes' : 'No'}`);
            console.log(`   🔗 Direct dependencies: ${discoveryResult.statistics.directDependencies}`);
            console.log(`   � Dev dependencies: ${discoveryResult.statistics.devDependencies}`);
            console.log(`   📈 Graph: ${discoveryResult.dependencyGraph.nodes.length} nodes, ${discoveryResult.dependencyGraph.edges.length} edges`);
            // Phase 2: Security Analysis
            console.log(chalk_1.default.cyan('\n🛡️  Phase 2: Security Analysis'));
            const githubSource = (0, github_advisory_1.createGitHubAdvisoryDataSource)();
            const vulnerabilityScanner = (0, vulnerability_scanner_1.createVulnerabilityScanner)([githubSource]);
            const vulnerabilityResults = await vulnerabilityScanner.scanPackages(discoveryResult.packages, {
                includeDevDependencies: options.includeDev
            });
            console.log(chalk_1.default.green('✅ Security scan completed'));
            console.log(`   🔍 Vulnerabilities: ${vulnerabilityResults.summary.totalVulnerabilities}`);
            if (vulnerabilityResults.summary.totalVulnerabilities > 0) {
                console.log(`   🔴 Critical: ${vulnerabilityResults.summary.criticalVulnerabilities}`);
                console.log(`   🟠 High: ${vulnerabilityResults.summary.highVulnerabilities}`);
                console.log(`   🟡 Medium: ${vulnerabilityResults.summary.mediumVulnerabilities}`);
                console.log(`   🟢 Low: ${vulnerabilityResults.summary.lowVulnerabilities}`);
            }
            let licenseResults = null;
            let compatibilityReport = null;
            let riskReport = null;
            // Phase 3: License Intelligence
            if (options.licenses) {
                console.log(chalk_1.default.cyan('\n📜 Phase 3: License Intelligence'));
                const licenseService = (0, license_intelligence_1.createLicenseIntelligenceService)();
                const licenseOptions = {
                    scanDepth: 'direct',
                    includeDevDependencies: options.includeDev,
                    scanPatterns: ['LICENSE*', 'COPYING*', 'COPYRIGHT*', '*.md'],
                    ignorePatterns: ['node_modules/**', 'dist/**', 'build/**'],
                    confidenceThreshold: 0.7,
                    useCache: true,
                    failOnPolicyViolation: false
                };
                // License Analysis
                console.log('   🔍 Analyzing licenses...');
                licenseResults = await licenseService.analyzeLicenses(discoveryResult.packages, licenseOptions);
                const uniqueLicenses = new Set();
                const riskLevels = { very_low: 0, low: 0, medium: 0, high: 0, very_high: 0, critical: 0 };
                for (const analysis of licenseResults) {
                    for (const license of analysis.licenses) {
                        uniqueLicenses.add(license.spdxId);
                    }
                    riskLevels[analysis.riskLevel]++;
                }
                console.log(chalk_1.default.green('   ✅ License analysis completed'));
                console.log(`   📋 Unique licenses: ${uniqueLicenses.size}`);
                console.log(`   ⚖️  Risk: Critical(${riskLevels.critical}) High(${riskLevels.high}) Medium(${riskLevels.medium}) Low(${riskLevels.low})`);
                // License Compatibility Analysis
                if (options.compatibility) {
                    console.log('   🔗 Analyzing compatibility...');
                    compatibilityReport = await licenseService.generateCompatibilityReport(discoveryResult.packages, licenseOptions);
                    console.log(chalk_1.default.green('   ✅ Compatibility analysis completed'));
                    console.log(`   🔄 Overall: ${compatibilityReport.overallCompatibility}`);
                    console.log(`   ⚠️  Conflicts: ${compatibilityReport.conflicts.length}`);
                    console.log(`   📊 Risk score: ${compatibilityReport.summary.riskScore}/100`);
                }
                // Legal Risk Assessment
                if (options.risk) {
                    console.log('   ⚖️  Assessing legal risks...');
                    riskReport = await licenseService.assessLegalRisk(discoveryResult.packages, licenseOptions);
                    console.log(chalk_1.default.green('   ✅ Legal risk assessment completed'));
                    console.log(`   ⚖️  Overall risk: ${riskReport.overallRisk}`);
                    console.log(`   📊 Risk score: ${riskReport.riskScore}/100`);
                    console.log(`   👨‍⚖️ Legal review: ${riskReport.legalReview.required ? chalk_1.default.red('Required') : chalk_1.default.green('Not required')}`);
                }
            }
            // Display Critical Issues
            if (vulnerabilityResults.summary.criticalVulnerabilities > 0) {
                console.log(chalk_1.default.red('\n🚨 Critical Security Issues'));
                console.log(chalk_1.default.gray('━'.repeat(40)));
                for (const report of vulnerabilityResults.reports) {
                    const criticalVulns = report.vulnerabilities.filter(v => v.severity === 'critical');
                    if (criticalVulns.length > 0) {
                        console.log(chalk_1.default.red(`\n📦 ${report.package.name}@${report.package.version}`));
                        for (const vuln of criticalVulns.slice(0, 3)) {
                            console.log(`   🔍 ${vuln.title}`);
                            console.log(`   🆔 ${vuln.cveId || vuln.id}`);
                            console.log(`   📝 ${vuln.description.substring(0, 100)}...`);
                        }
                    }
                }
            }
            // Display License Conflicts
            if (compatibilityReport && compatibilityReport.conflicts.length > 0) {
                console.log(chalk_1.default.yellow('\n⚠️  License Compatibility Issues'));
                console.log(chalk_1.default.gray('━'.repeat(40)));
                for (const conflict of compatibilityReport.conflicts.slice(0, 3)) {
                    console.log(chalk_1.default.yellow(`\n🔍 ${conflict.description}`));
                    console.log(`   📋 Licenses: ${conflict.conflictingLicenses.map(l => l.name).join(', ')}`);
                    if (conflict.resolution) {
                        console.log(`   💡 Resolution: ${conflict.resolution}`);
                    }
                }
            }
            // Summary Report
            console.log(chalk_1.default.blue('\n📊 Executive Summary'));
            console.log(chalk_1.default.gray('━'.repeat(40)));
            console.log(`📦 Packages analyzed: ${discoveryResult.packages.length}`);
            console.log(`🔗 Direct dependencies: ${discoveryResult.statistics.directDependencies}`);
            console.log(`🔗 Dev dependencies: ${discoveryResult.statistics.devDependencies}`);
            console.log(`🛡️  Vulnerabilities: ${vulnerabilityResults.summary.totalVulnerabilities}`);
            if (licenseResults) {
                const uniqueLicenses = new Set();
                for (const analysis of licenseResults) {
                    for (const license of analysis.licenses) {
                        uniqueLicenses.add(license.spdxId);
                    }
                }
                console.log(`📜 Unique licenses: ${uniqueLicenses.size}`);
            }
            if (compatibilityReport) {
                console.log(`🔗 License compatibility: ${compatibilityReport.overallCompatibility}`);
            }
            if (riskReport) {
                console.log(`⚖️  Legal risk level: ${riskReport.overallRisk}`);
            }
            const totalTime = Date.now() - startTime;
            console.log(chalk_1.default.green(`\n✅ Analysis completed in ${totalTime}ms`));
            // Save results if requested
            if (options.save) {
                const outputData = {
                    timestamp: new Date().toISOString(),
                    packages: discoveryResult,
                    vulnerabilities: vulnerabilityResults,
                    ...(licenseResults && { licenses: licenseResults }),
                    ...(compatibilityReport && { compatibility: compatibilityReport }),
                    ...(riskReport && { legalRisk: riskReport })
                };
                const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
                await fs.writeFile(options.save, JSON.stringify(outputData, null, 2));
                console.log(chalk_1.default.green(`📄 Results saved to: ${options.save}`));
            }
        }
        catch (error) {
            logger.error('Analysis failed:', error);
            console.error(chalk_1.default.red('\n❌ Analysis failed:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });
    // License compliance command
    program
        .command('license')
        .description('Generate license compliance documentation')
        .argument('[path]', 'Path to project directory', process.cwd())
        .option('--format <format>', 'Output format (text, html, markdown, json)', 'text')
        .option('--output <file>', 'Output file path')
        .option('--group-by-license', 'Group packages by license type', false)
        .option('--include-texts', 'Include full license texts', false)
        .action(async (projectPath, options) => {
        try {
            console.log(chalk_1.default.blue('📜 Generating License Compliance Document'));
            console.log(chalk_1.default.gray('━'.repeat(50)));
            const packageDiscovery = (0, package_discovery_1.createPackageDiscoveryService)();
            const discoveryResult = await packageDiscovery.discoverPackages(projectPath, {
                includeDev: false
            });
            const licenseService = (0, license_intelligence_1.createLicenseIntelligenceService)();
            const document = await licenseService.generateComplianceDocument(discoveryResult.packages, {
                format: options.format,
                includeLicenseTexts: options.includeTexts,
                includeCopyrightNotices: true,
                includeSourceReferences: true,
                groupByLicense: options.groupByLicense
            });
            if (options.output) {
                const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
                await fs.writeFile(options.output, document);
                console.log(chalk_1.default.green(`✅ License document saved to: ${options.output}`));
            }
            else {
                console.log(document);
            }
        }
        catch (error) {
            console.error(chalk_1.default.red('❌ License document generation failed:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });
    // Info command
    program
        .command('info')
        .description('Display tool information and capabilities')
        .action(() => {
        console.log(chalk_1.default.blue(`🔍 Smart Dependency Analyzer v${package_json_1.version}`));
        console.log(chalk_1.default.gray('Enterprise-grade dependency intelligence platform\n'));
        console.log(`🏗️  ${chalk_1.default.bold('Architecture:')}`);
        console.log('   📦 Phase 1: Package Discovery Engine');
        console.log('   🛡️  Phase 2: Security Intelligence Engine');
        console.log('   📜 Phase 3: License Intelligence Engine');
        console.log(`\n🔧 ${chalk_1.default.bold('Features:')}`);
        console.log('   📊 Multi-format package manager support');
        console.log('   🔍 Advanced vulnerability scanning');
        console.log('   📜 Comprehensive license analysis');
        console.log('   🔗 License compatibility checking');
        console.log('   ⚖️  Legal risk assessment');
        console.log('   📄 Compliance documentation');
        console.log('   🏢 Enterprise policy validation');
        console.log(`\n📋 ${chalk_1.default.bold('Supported Package Managers:')}`);
        console.log('   • npm (package.json, package-lock.json)');
        console.log('   • Yarn (yarn.lock)');
        console.log('   • pnpm (pnpm-lock.yaml)');
        console.log('   • Monorepos with workspaces');
    });
    console.log('📋 Parsing command line arguments...');
    await program.parseAsync();
    console.log('✅ CLI execution completed');
}
// Run CLI if this is the main module
if (require.main === module) {
    console.log('🎯 CLI module detected as main - starting execution');
    main().catch((error) => {
        console.error('CLI failed:', error);
        process.exit(1);
    });
}
else {
    console.log('📦 CLI module loaded as dependency');
}
//# sourceMappingURL=index.js.map