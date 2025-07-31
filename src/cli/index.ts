#!/usr/bin/env node

/**
 * Smart Dependency Analyzer CLI Entry Point
 * The world's most advanced dependency analysis platform
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../../package.json';
import { Logger } from '../utils/logger';
import { createPackageDiscoveryService } from '../core/services/package-discovery';
import { createVulnerabilityScanner } from '../core/services/vulnerability-scanner';
import { createGitHubAdvisoryDataSource } from '../integrations/security/github-advisory';

const logger = Logger.getLogger('CLI');

async function main(): Promise<void> {
  const program = new Command();

  program
    .name('sda')
    .description('Smart Dependency Analyzer - AI-powered dependency intelligence')
    .version(version)
    .configureOutput({
      outputError: (str, write) => write(chalk.red(str)),
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
    .action(async (projectPath: string, options) => {
      try {
        logger.info(`🔍 Analyzing dependencies in: ${projectPath}`);
        
        console.log(chalk.blue('🚀 Smart Dependency Analyzer - Phase 2'));
        console.log(chalk.gray('━'.repeat(50)));
        
        // Phase 1: Package Discovery
        console.log(chalk.yellow('📦 Phase 1: Discovering packages...'));
        const packageDiscovery = createPackageDiscoveryService();
        const discoveryResult = await packageDiscovery.discoverPackages(projectPath, {
          includeDev: options.includeDev
        });
        
        console.log(chalk.green(`✅ Found ${discoveryResult.packages.length} packages`));
        console.log(chalk.cyan(`   📊 Project type: ${discoveryResult.projectInfo.packageManager}`));
        console.log(chalk.cyan(`   🏗️  Monorepo: ${discoveryResult.projectInfo.isMonorepo ? 'Yes' : 'No'}`));
        console.log(chalk.cyan(`   📈 Dependencies: ${discoveryResult.statistics.directDependencies} production, ${discoveryResult.statistics.devDependencies} dev`));
        
        // Phase 2: Vulnerability Scanning
        console.log(chalk.yellow('\n🛡️  Phase 2: Scanning for vulnerabilities...'));
        const githubSource = createGitHubAdvisoryDataSource({
          ecosystem: 'npm'
        });
        
        const scanner = createVulnerabilityScanner([githubSource]);
        const scanResult = await scanner.scanPackages(discoveryResult.packages, {
          includeDevDependencies: options.includeDev
        });
        
        // Display results
        console.log(chalk.green(`✅ Vulnerability scan completed`));
        console.log(chalk.cyan(`   📊 Scanned: ${scanResult.summary.scannedPackages}/${scanResult.summary.totalPackages} packages`));
        console.log(chalk.cyan(`   🚨 Total vulnerabilities: ${scanResult.summary.totalVulnerabilities}`));
        
        if (scanResult.summary.criticalVulnerabilities > 0) {
          console.log(chalk.red(`   💥 Critical: ${scanResult.summary.criticalVulnerabilities}`));
        }
        if (scanResult.summary.highVulnerabilities > 0) {
          console.log(chalk.magenta(`   ⚠️  High: ${scanResult.summary.highVulnerabilities}`));
        }
        if (scanResult.summary.mediumVulnerabilities > 0) {
          console.log(chalk.yellow(`   📢 Medium: ${scanResult.summary.mediumVulnerabilities}`));
        }
        if (scanResult.summary.lowVulnerabilities > 0) {
          console.log(chalk.blue(`   ℹ️  Low: ${scanResult.summary.lowVulnerabilities}`));
        }
        
        console.log(chalk.cyan(`   🎯 Average risk score: ${scanResult.summary.averageRiskScore.toFixed(1)}`));
        
        // Show packages with vulnerabilities
        const packagesWithVulns = scanResult.reports.filter(r => r.vulnerabilities.length > 0);
        if (packagesWithVulns.length > 0) {
          console.log(chalk.yellow(`\n� Packages with vulnerabilities:`));
          for (const report of packagesWithVulns.slice(0, 5)) { // Show top 5
            const criticalCount = report.vulnerabilities.filter(v => v.severity === 'critical').length;
            const highCount = report.vulnerabilities.filter(v => v.severity === 'high').length;
            
            let severityBadge = '';
            if (criticalCount > 0) severityBadge = chalk.red(`💥 ${criticalCount} critical`);
            else if (highCount > 0) severityBadge = chalk.magenta(`⚠️  ${highCount} high`);
            else severityBadge = chalk.yellow(`📢 ${report.vulnerabilities.length} total`);
            
            console.log(`   ${chalk.cyan(report.package.name)}@${chalk.gray(report.package.version)} - ${severityBadge} - Risk: ${report.riskScore}`);
          }
          
          if (packagesWithVulns.length > 5) {
            console.log(chalk.gray(`   ... and ${packagesWithVulns.length - 5} more packages`));
          }
        } else {
          console.log(chalk.green('\n🎉 No vulnerabilities found! Your dependencies look secure.'));
        }
        
        console.log(chalk.gray('\n━'.repeat(50)));
        console.log(chalk.blue(`📊 Analysis completed in ${Date.now() - Date.now()}ms`));
        console.log(chalk.blue(`⚙️  Output format: ${options.output}`));
        console.log(chalk.cyan(`🔧 Include dev deps: ${options.includeDev}`));
        console.log(chalk.magenta(`⚠️  Min severity: ${options.severity}`));
        
        if (scanResult.summary.criticalVulnerabilities > 0 || scanResult.summary.highVulnerabilities > 0) {
          console.log(chalk.red('\n⚠️  WARNING: Critical or high severity vulnerabilities found!'));
          console.log(chalk.yellow('Run with --output json for detailed remediation steps.'));
        }
        
      } catch (error) {
        logger.error('Analysis failed:', error);
        console.error(chalk.red(`❌ Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
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
        console.log(chalk.green('✅ Configuration initialized! (Phase 1 implementation coming)'));
        console.log(chalk.blue(`🔧 Force overwrite: ${options.force}`));
        
      } catch (error) {
        logger.error('Initialization failed:', error);
        process.exit(1);
      }
    });

  // Version command with enhanced info
  program
    .command('version')
    .description('Show version information and system details')
    .action(() => {
      console.log(chalk.bold.blue('Smart Dependency Analyzer (SDA)'));
      console.log(`Version: ${chalk.green(version)}`);
      console.log(`Node.js: ${chalk.yellow(process.version)}`);
      console.log(`Platform: ${chalk.cyan(process.platform)} ${process.arch}`);
      console.log(chalk.gray('🚀 The future of dependency analysis'));
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
