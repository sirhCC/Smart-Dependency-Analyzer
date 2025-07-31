#!/usr/bin/env node

/**
 * Smart Dependency Analyzer CLI Entry Point
 * The world's most advanced dependency analysis platform
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../../package.json';
import { Logger } from '../utils/logger';

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

  // Analyze command - Phase 1 MVP
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
        
        // TODO: Phase 1 implementation
        console.log(chalk.green('✅ Analysis complete! (Phase 1 MVP coming soon)'));
        console.log(chalk.blue(`📊 Project: ${projectPath}`));
        console.log(chalk.yellow(`⚙️  Output format: ${options.output}`));
        console.log(chalk.cyan(`🔧 Include dev deps: ${options.includeDev}`));
        console.log(chalk.magenta(`⚠️  Min severity: ${options.severity}`));
        
      } catch (error) {
        logger.error('Analysis failed:', error);
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
