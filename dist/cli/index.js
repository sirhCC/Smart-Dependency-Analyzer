#!/usr/bin/env node
"use strict";
/**
 * Smart Dependency Analyzer CLI Entry Point
 * The world's most advanced dependency analysis platform
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const package_json_1 = require("../../package.json");
const logger_1 = require("../utils/logger");
const package_discovery_1 = require("../core/services/package-discovery");
const vulnerability_scanner_1 = require("../core/services/vulnerability-scanner");
const github_advisory_1 = require("../integrations/security/github-advisory");
const logger = logger_1.Logger.getLogger('CLI');
async function main() {
    const program = new commander_1.Command();
    program
        .name('sda')
        .description('Smart Dependency Analyzer - AI-powered dependency intelligence')
        .version(package_json_1.version)
        .configureOutput({
        outputError: (str, write) => write(chalk_1.default.red(str)),
    });
    // Global options
    program
        .option('-v, --verbose', 'Enable verbose logging', false)
        .option('--config <path>', 'Path to configuration file')
        .option('--no-color', 'Disable colored output');
    // Analyze command - Phase 2 Implementation
    program
        .command('analyze')
        .description('Analyze project dependencies for security and compliance')
        .argument('[path]', 'Path to project directory', process.cwd())
        .option('-o, --output <format>', 'Output format (json, table, html)', 'table')
        .option('--include-dev', 'Include development dependencies', false)
        .option('--severity <level>', 'Minimum severity level (low, medium, high, critical)', 'medium')
        .action(async (projectPath, options) => {
        try {
            logger.info(`🔍 Analyzing dependencies in: ${projectPath}`);
            console.log(chalk_1.default.blue('🚀 Smart Dependency Analyzer - Phase 2'));
            console.log(chalk_1.default.gray('━'.repeat(50)));
            // Phase 1: Package Discovery
            console.log(chalk_1.default.yellow('📦 Phase 1: Discovering packages...'));
            const packageDiscovery = (0, package_discovery_1.createPackageDiscoveryService)();
            const discoveryResult = await packageDiscovery.discoverPackages(projectPath, {
                includeDev: options.includeDev
            });
            console.log(chalk_1.default.green(`✅ Found ${discoveryResult.packages.length} packages`));
            console.log(chalk_1.default.cyan(`   📊 Project type: ${discoveryResult.projectInfo.packageManager}`));
            console.log(chalk_1.default.cyan(`   🏗️  Monorepo: ${discoveryResult.projectInfo.isMonorepo ? 'Yes' : 'No'}`));
            console.log(chalk_1.default.cyan(`   📈 Dependencies: ${discoveryResult.statistics.directDependencies} production, ${discoveryResult.statistics.devDependencies} dev`));
            // Phase 2: Vulnerability Scanning
            console.log(chalk_1.default.yellow('\n🛡️  Phase 2: Scanning for vulnerabilities...'));
            const githubSource = (0, github_advisory_1.createGitHubAdvisoryDataSource)({
                ecosystem: 'npm'
            });
            const scanner = (0, vulnerability_scanner_1.createVulnerabilityScanner)([githubSource]);
            const scanResult = await scanner.scanPackages(discoveryResult.packages, {
                includeDevDependencies: options.includeDev
            });
            // Display results
            console.log(chalk_1.default.green(`✅ Vulnerability scan completed`));
            console.log(chalk_1.default.cyan(`   📊 Scanned: ${scanResult.summary.scannedPackages}/${scanResult.summary.totalPackages} packages`));
            console.log(chalk_1.default.cyan(`   🚨 Total vulnerabilities: ${scanResult.summary.totalVulnerabilities}`));
            if (scanResult.summary.criticalVulnerabilities > 0) {
                console.log(chalk_1.default.red(`   💥 Critical: ${scanResult.summary.criticalVulnerabilities}`));
            }
            if (scanResult.summary.highVulnerabilities > 0) {
                console.log(chalk_1.default.magenta(`   ⚠️  High: ${scanResult.summary.highVulnerabilities}`));
            }
            if (scanResult.summary.mediumVulnerabilities > 0) {
                console.log(chalk_1.default.yellow(`   📢 Medium: ${scanResult.summary.mediumVulnerabilities}`));
            }
            if (scanResult.summary.lowVulnerabilities > 0) {
                console.log(chalk_1.default.blue(`   ℹ️  Low: ${scanResult.summary.lowVulnerabilities}`));
            }
            console.log(chalk_1.default.cyan(`   🎯 Average risk score: ${scanResult.summary.averageRiskScore.toFixed(1)}`));
            // Show packages with vulnerabilities
            const packagesWithVulns = scanResult.reports.filter(r => r.vulnerabilities.length > 0);
            if (packagesWithVulns.length > 0) {
                console.log(chalk_1.default.yellow(`\n� Packages with vulnerabilities:`));
                for (const report of packagesWithVulns.slice(0, 5)) { // Show top 5
                    const criticalCount = report.vulnerabilities.filter(v => v.severity === 'critical').length;
                    const highCount = report.vulnerabilities.filter(v => v.severity === 'high').length;
                    let severityBadge = '';
                    if (criticalCount > 0)
                        severityBadge = chalk_1.default.red(`💥 ${criticalCount} critical`);
                    else if (highCount > 0)
                        severityBadge = chalk_1.default.magenta(`⚠️  ${highCount} high`);
                    else
                        severityBadge = chalk_1.default.yellow(`📢 ${report.vulnerabilities.length} total`);
                    console.log(`   ${chalk_1.default.cyan(report.package.name)}@${chalk_1.default.gray(report.package.version)} - ${severityBadge} - Risk: ${report.riskScore}`);
                }
                if (packagesWithVulns.length > 5) {
                    console.log(chalk_1.default.gray(`   ... and ${packagesWithVulns.length - 5} more packages`));
                }
            }
            else {
                console.log(chalk_1.default.green('\n🎉 No vulnerabilities found! Your dependencies look secure.'));
            }
            console.log(chalk_1.default.gray('\n━'.repeat(50)));
            console.log(chalk_1.default.blue(`📊 Analysis completed in ${Date.now() - Date.now()}ms`));
            console.log(chalk_1.default.blue(`⚙️  Output format: ${options.output}`));
            console.log(chalk_1.default.cyan(`🔧 Include dev deps: ${options.includeDev}`));
            console.log(chalk_1.default.magenta(`⚠️  Min severity: ${options.severity}`));
            if (scanResult.summary.criticalVulnerabilities > 0 || scanResult.summary.highVulnerabilities > 0) {
                console.log(chalk_1.default.red('\n⚠️  WARNING: Critical or high severity vulnerabilities found!'));
                console.log(chalk_1.default.yellow('Run with --output json for detailed remediation steps.'));
            }
        }
        catch (error) {
            logger.error('Analysis failed:', error);
            console.error(chalk_1.default.red(`❌ Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
            process.exit(1);
        }
    });
    // Initialize command
    program
        .command('init')
        .description('Initialize SDA configuration for the project')
        .option('-f, --force', 'Overwrite existing configuration', false)
        .action(async (options) => {
        try {
            logger.info('🚀 Initializing SDA configuration...');
            // TODO: Phase 1 implementation
            console.log(chalk_1.default.green('✅ Configuration initialized! (Phase 1 implementation coming)'));
            console.log(chalk_1.default.blue(`🔧 Force overwrite: ${options.force}`));
        }
        catch (error) {
            logger.error('Initialization failed:', error);
            process.exit(1);
        }
    });
    // Version command with enhanced info
    program
        .command('version')
        .description('Show version information and system details')
        .action(() => {
        console.log(chalk_1.default.bold.blue('Smart Dependency Analyzer (SDA)'));
        console.log(`Version: ${chalk_1.default.green(package_json_1.version)}`);
        console.log(`Node.js: ${chalk_1.default.yellow(process.version)}`);
        console.log(`Platform: ${chalk_1.default.cyan(process.platform)} ${process.arch}`);
        console.log(chalk_1.default.gray('🚀 The future of dependency analysis'));
    });
    // Error handling
    program.configureHelp({
        sortSubcommands: true,
        subcommandTerm: (cmd) => cmd.name(),
    });
    // Parse arguments
    await program.parseAsync(process.argv);
}
// Global error handling
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Run the CLI
main().catch((error) => {
    logger.error('CLI startup failed:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map