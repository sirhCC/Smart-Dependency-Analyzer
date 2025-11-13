#!/usr/bin/env node

/**
 * Smart Dependency Analyzer CLI Entry Point
 * Enterprise-grade dependency analysis with security and license intelligence
 */

import { Command } from "commander";
import chalk from "chalk";
import { version } from "../../package.json";
import { Logger } from "../utils/logger";
import { createPackageDiscoveryService } from "../core/services/package-discovery";
import { createVulnerabilityScanner } from "../core/services/vulnerability-scanner";
import { createGitHubAdvisoryDataSource } from "../integrations/security/github-advisory";
import { createLicenseIntelligenceService } from "../core/services/license-intelligence";
import { lifecycle } from "../utils/lifecycle";
import { loadPolicy, evaluatePolicy, Policy } from "../utils/policy";
import {
  AnalyzeOptionsSchema,
  LicenseOptionsSchema,
} from "../utils/cli-schema";

const logger = Logger.getLogger("CLI");

async function main(): Promise<void> {
  // Ensure we gracefully stop background services on exit signals
  lifecycle.hookProcessSignals();
  // Register core resource cleanup globally
  lifecycle.register("CacheManager", async () => {
    const { cacheManager } = await import("../core/performance/cache-manager");
    cacheManager.destroy();
  });
  // Note: IntelligentCache & MemoryOptimizer are not singletons yet; registration deferred until instantiated.

  const program = new Command();

  program
    .name("sda")
    .description(
      "Smart Dependency Analyzer - Enterprise dependency intelligence",
    )
    .version(version)
    .configureOutput({
      outputError: (str, write) => write(chalk.red(str)),
    });

  // Global options
  program
    .option("-v, --verbose", "Enable verbose logging", false)
    .option(
      "--log-level <level>",
      "Log level (silent,fatal,error,warn,info,debug,trace)",
    )
    .option("--silent", "Disable console logging", false)
    .option("--config <path>", "Path to configuration file")
    .option("--no-color", "Disable colored output");

  // Enhanced Analyze command - Phase 3 Implementation
  program
    .command("analyze")
    .description(
      "Comprehensive dependency analysis including security and license intelligence",
    )
    .argument("[path]", "Path to project directory", process.cwd())
    .option(
      "-o, --output <format>",
      "Output format (json, table, html)",
      "table",
    )
    .option("--include-dev", "Include development dependencies", false)
    .option(
      "--severity <level>",
      "Minimum severity level (low, medium, high, critical)",
      "medium",
    )
    .option("--licenses", "Include license analysis", true)
    .option("--compatibility", "Include license compatibility analysis", true)
    .option("--risk", "Include legal risk assessment", true)
    .option(
      "--max-concurrency <n>",
      "Maximum packages scanned concurrently (default 10)",
      undefined,
    )
    .option(
      "--policy <file>",
      "Path to policy (json|yaml) to enforce",
      undefined,
    )
    .option("--save <file>", "Save results to file")
    .action(async (projectPath: string, options) => {
      try {
        // Validate CLI options (analyze)
        const validated = AnalyzeOptionsSchema.safeParse({
          ...options,
          logLevel: options.logLevel ?? (options.verbose ? "debug" : undefined),
          silent: options.silent ?? false,
          maxConcurrency: options.maxConcurrency,
        });
        if (!validated.success) {
          console.error(
            chalk.red("❌ Invalid options:"),
            validated.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join(", "),
          );
          process.exit(1);
        }
        const opts = validated.data;
        // Apply logging preferences
        // For JSON output, suppress ALL console noise by setting logger to silent
        const shouldSuppressLogs = opts.output === "json" || opts.silent;
        const LoggerClass = (await import("../utils/logger")).Logger;
        const instance = (LoggerClass as any).getInstance?.();
        if (instance && opts.logLevel) instance.setLevel(opts.logLevel as any);
        if (instance && shouldSuppressLogs) instance.setLevel("silent" as any);
        const startTime = Date.now();
        if (!shouldSuppressLogs)
          logger.info(`🔍 Starting comprehensive analysis: ${projectPath}`);

        // Helper to print only in non-JSON modes
        const printProgress = (msg: string) => {
          if (opts.output !== "json") {
            console.log(msg);
          }
        };

        printProgress(chalk.blue("🚀 Smart Dependency Analyzer - Phase 3"));
        printProgress(chalk.blue("🏢 Enterprise License Intelligence Engine"));
        printProgress(chalk.gray("━".repeat(60)));

        // Phase 1: Package Discovery
        printProgress(chalk.cyan("\n📦 Phase 1: Package Discovery"));
        const packageDiscovery = createPackageDiscoveryService();
        const discoveryResult = await packageDiscovery.discoverPackages(
          projectPath,
          {
            includeDev: opts.includeDev,
          },
        );

        printProgress(
          chalk.green(
            `✅ Discovered ${discoveryResult.packages.length} packages`,
          ),
        );
        printProgress(
          `   📊 Package manager: ${discoveryResult.projectInfo.packageManager}`,
        );
        printProgress(
          `   🏢 Monorepo: ${discoveryResult.projectInfo.isMonorepo ? "Yes" : "No"}`,
        );
        printProgress(
          `   🔗 Direct dependencies: ${discoveryResult.statistics.directDependencies}`,
        );
        printProgress(
          `   📦 Dev dependencies: ${discoveryResult.statistics.devDependencies}`,
        );
        printProgress(
          `   📈 Graph: ${discoveryResult.dependencyGraph.nodes.length} nodes, ${discoveryResult.dependencyGraph.edges.length} edges`,
        );

        // Phase 2: Security Analysis
        printProgress(chalk.cyan("\n🛡️  Phase 2: Security Analysis"));
        const githubSource = createGitHubAdvisoryDataSource();
        const vulnerabilityScanner = createVulnerabilityScanner([githubSource]);

        const vulnerabilityResults = await vulnerabilityScanner.scanPackages(
          discoveryResult.packages,
          {
            includeDevDependencies: opts.includeDev,
            ...(typeof opts.maxConcurrency === "number"
              ? { maxConcurrentPackages: opts.maxConcurrency }
              : {}),
          },
        );

        printProgress(chalk.green("✅ Security scan completed"));
        printProgress(
          `   🔍 Vulnerabilities: ${vulnerabilityResults.summary.totalVulnerabilities}`,
        );
        if (vulnerabilityResults.summary.totalVulnerabilities > 0) {
          printProgress(
            `   🔴 Critical: ${vulnerabilityResults.summary.criticalVulnerabilities}`,
          );
          printProgress(
            `   🟠 High: ${vulnerabilityResults.summary.highVulnerabilities}`,
          );
          printProgress(
            `   🟡 Medium: ${vulnerabilityResults.summary.mediumVulnerabilities}`,
          );
          printProgress(
            `   🟢 Low: ${vulnerabilityResults.summary.lowVulnerabilities}`,
          );
        }

        let licenseResults = null;
        let compatibilityReport = null;
        let riskReport = null;

        // Phase 3: License Intelligence
        if (opts.licenses) {
          printProgress(chalk.cyan("\n📜 Phase 3: License Intelligence"));
          const licenseService = createLicenseIntelligenceService();

          const licenseOptions = {
            scanDepth: "direct" as const,
            includeDevDependencies: opts.includeDev,
            scanPatterns: ["LICENSE*", "COPYING*", "COPYRIGHT*", "*.md"],
            ignorePatterns: ["node_modules/**", "dist/**", "build/**"],
            confidenceThreshold: 0.7,
            useCache: true,
            failOnPolicyViolation: false,
          };

          // License Analysis
          printProgress("   🔍 Analyzing licenses...");
          licenseResults = await licenseService.analyzeLicenses(
            discoveryResult.packages,
            licenseOptions,
          );

          const uniqueLicenses = new Set();
          const riskLevels = {
            very_low: 0,
            low: 0,
            medium: 0,
            high: 0,
            very_high: 0,
            critical: 0,
          };

          for (const analysis of licenseResults) {
            for (const license of analysis.licenses) {
              uniqueLicenses.add(license.spdxId);
            }
            riskLevels[analysis.riskLevel]++;
          }

          printProgress(chalk.green("   ✅ License analysis completed"));
          printProgress(`   📋 Unique licenses: ${uniqueLicenses.size}`);
          printProgress(
            `   ⚖️  Risk: Critical(${riskLevels.critical}) High(${riskLevels.high}) Medium(${riskLevels.medium}) Low(${riskLevels.low})`,
          );

          // License Compatibility Analysis
          if (opts.compatibility) {
            printProgress("   🔗 Analyzing compatibility...");
            compatibilityReport =
              await licenseService.generateCompatibilityReport(
                discoveryResult.packages,
                licenseOptions,
              );

            printProgress(
              chalk.green("   ✅ Compatibility analysis completed"),
            );
            printProgress(
              `   🔄 Overall: ${compatibilityReport.overallCompatibility}`,
            );
            printProgress(
              `   ⚠️  Conflicts: ${compatibilityReport.conflicts.length}`,
            );
            printProgress(
              `   📊 Risk score: ${compatibilityReport.summary.riskScore}/100`,
            );
          }

          // Legal Risk Assessment
          if (opts.risk) {
            printProgress("   ⚖️  Assessing legal risks...");
            riskReport = await licenseService.assessLegalRisk(
              discoveryResult.packages,
              licenseOptions,
            );

            printProgress(chalk.green("   ✅ Legal risk assessment completed"));
            printProgress(`   ⚖️  Overall risk: ${riskReport.overallRisk}`);
            printProgress(`   📊 Risk score: ${riskReport.riskScore}/100`);
            printProgress(
              `   👨‍⚖️ Legal review: ${riskReport.legalReview.required ? chalk.red("Required") : chalk.green("Not required")}`,
            );
          }
        }

        // Display Critical Issues
        if (vulnerabilityResults.summary.criticalVulnerabilities > 0) {
          printProgress(chalk.red("\n🚨 Critical Security Issues"));
          printProgress(chalk.gray("━".repeat(40)));

          for (const report of vulnerabilityResults.reports) {
            const criticalVulns = report.vulnerabilities.filter(
              (v) => v.severity === "critical",
            );
            if (criticalVulns.length > 0) {
              printProgress(
                chalk.red(
                  `\n📦 ${report.package.name}@${report.package.version}`,
                ),
              );
              for (const vuln of criticalVulns.slice(0, 3)) {
                printProgress(`   🔍 ${vuln.title}`);
                printProgress(`   🆔 ${vuln.cveId || vuln.id}`);
                printProgress(`   📝 ${vuln.description.substring(0, 100)}...`);
              }
            }
          }
        }

        // Display License Conflicts
        if (compatibilityReport && compatibilityReport.conflicts.length > 0) {
          printProgress(chalk.yellow("\n⚠️  License Compatibility Issues"));
          printProgress(chalk.gray("━".repeat(40)));

          for (const conflict of compatibilityReport.conflicts.slice(0, 3)) {
            printProgress(chalk.yellow(`\n🔍 ${conflict.description}`));
            printProgress(
              `   📋 Licenses: ${conflict.conflictingLicenses.map((l) => l.name).join(", ")}`,
            );
            if (conflict.resolution) {
              printProgress(`   💡 Resolution: ${conflict.resolution}`);
            }
          }
        }

        // Summary Report
        printProgress(chalk.blue("\n📊 Executive Summary"));
        printProgress(chalk.gray("━".repeat(40)));
        printProgress(
          `📦 Packages analyzed: ${discoveryResult.packages.length}`,
        );
        printProgress(
          `🔗 Direct dependencies: ${discoveryResult.statistics.directDependencies}`,
        );
        printProgress(
          `🔗 Dev dependencies: ${discoveryResult.statistics.devDependencies}`,
        );
        printProgress(
          `🛡️  Vulnerabilities: ${vulnerabilityResults.summary.totalVulnerabilities}`,
        );

        if (licenseResults) {
          const uniqueLicenses = new Set();
          for (const analysis of licenseResults) {
            for (const license of analysis.licenses) {
              uniqueLicenses.add(license.spdxId);
            }
          }
          printProgress(`📜 Unique licenses: ${uniqueLicenses.size}`);
        }

        if (compatibilityReport) {
          printProgress(
            `🔗 License compatibility: ${compatibilityReport.overallCompatibility}`,
          );
        }

        if (riskReport) {
          printProgress(`⚖️  Legal risk level: ${riskReport.overallRisk}`);
        }

        // Policy evaluation (optional)
        let policy: Policy | undefined;
        if (opts.policy) {
          try {
            policy = await loadPolicy(opts.policy);
            const policyResult = evaluatePolicy(policy, {
              vulnerabilityResults,
              licenseAnalyses: licenseResults ?? null,
            });
            if (policyResult.hasViolations) {
              printProgress(chalk.red("\n🚫 Policy Violations"));
              for (const v of policyResult.violations)
                printProgress(`   • ${v}`);
              if (policy.failOnPolicyViolation) {
                throw new Error("Policy violations detected");
              }
            } else {
              printProgress(chalk.green("\n✅ No policy violations"));
            }
          } catch (err) {
            logger.error("Policy evaluation failed", err);
            throw err;
          }
        }

        const totalTime = Date.now() - startTime;
        printProgress(chalk.green(`\n✅ Analysis completed in ${totalTime}ms`));

        // Prepare output data
        const outputData = {
          timestamp: new Date().toISOString(),
          packages: discoveryResult,
          vulnerabilities: vulnerabilityResults,
          ...(licenseResults && { licenses: licenseResults }),
          ...(compatibilityReport && { compatibility: compatibilityReport }),
          ...(riskReport && { legalRisk: riskReport }),
        };

        // Output JSON to stdout if requested
        if (opts.output === "json") {
          console.log(JSON.stringify(outputData, null, 2));
        }

        // Save results to file if requested
        if (opts.save) {
          const fs = await import("fs/promises");
          await fs.writeFile(opts.save, JSON.stringify(outputData, null, 2));
          printProgress(chalk.green(`📄 Results saved to: ${opts.save}`));
        }
      } catch (error) {
        logger.error("Analysis failed:", error);
        console.error(
          chalk.red("\n❌ Analysis failed:"),
          error instanceof Error ? error.message : "Unknown error",
        );
        await lifecycle.shutdown();
        process.exit(1);
      }
    });

  // License compliance command
  program
    .command("license")
    .description("Generate license compliance documentation")
    .argument("[path]", "Path to project directory", process.cwd())
    .option(
      "--format <format>",
      "Output format (text, html, markdown, json)",
      "text",
    )
    .option("--output <file>", "Output file path")
    .option("--group-by-license", "Group packages by license type", false)
    .option("--include-texts", "Include full license texts", false)
    .action(async (projectPath: string, options) => {
      try {
        // Validate CLI options (license)
        const validated = LicenseOptionsSchema.safeParse({
          ...options,
          logLevel: options.logLevel ?? (options.verbose ? "debug" : undefined),
          silent: options.silent ?? false,
        });
        if (!validated.success) {
          console.error(
            chalk.red("❌ Invalid options:"),
            validated.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join(", "),
          );
          process.exit(1);
        }
        const opts = validated.data;
        // Apply logging preferences
        // For JSON format, suppress ALL console noise
        const shouldSuppressLogs = opts.format === "json" || opts.silent;
        const LoggerClass = (await import("../utils/logger")).Logger;
        const instance = (LoggerClass as any).getInstance?.();
        if (instance && opts.logLevel) instance.setLevel(opts.logLevel as any);
        if (instance && shouldSuppressLogs) instance.setLevel("silent" as any);

        // Helper to print only in non-JSON modes
        const printProgress = (msg: string) => {
          if (opts.format !== "json") {
            console.log(msg);
          }
        };

        printProgress(chalk.blue("📜 Generating License Compliance Document"));
        printProgress(chalk.gray("━".repeat(50)));

        const packageDiscovery = createPackageDiscoveryService();
        const discoveryResult = await packageDiscovery.discoverPackages(
          projectPath,
          {
            includeDev: false,
          },
        );

        const licenseService = createLicenseIntelligenceService();
        const document = await licenseService.generateComplianceDocument(
          discoveryResult.packages,
          {
            format: opts.format as any,
            includeLicenseTexts: opts.includeTexts,
            includeCopyrightNotices: true,
            includeSourceReferences: true,
            groupByLicense: opts.groupByLicense,
          },
        );

        if (opts.output) {
          const fs = await import("fs/promises");
          await fs.writeFile(opts.output, document);
          printProgress(
            chalk.green(`✅ License document saved to: ${opts.output}`),
          );
        } else {
          console.log(document);
        }
      } catch (error) {
        console.error(
          chalk.red("❌ License document generation failed:"),
          error instanceof Error ? error.message : "Unknown error",
        );
        process.exit(1);
      }
    });

  // Info command
  program
    .command("info")
    .description("Display tool information and capabilities")
    .action(() => {
      console.log(chalk.blue(`🔍 Smart Dependency Analyzer v${version}`));
      console.log(
        chalk.gray("Enterprise-grade dependency intelligence platform\n"),
      );

      console.log(`🏗️  ${chalk.bold("Architecture:")}`);
      console.log("   📦 Phase 1: Package Discovery Engine");
      console.log("   🛡️  Phase 2: Security Intelligence Engine");
      console.log("   📜 Phase 3: License Intelligence Engine");

      console.log(`\n🔧 ${chalk.bold("Features:")}`);
      console.log("   📊 Multi-format package manager support");
      console.log("   🔍 Advanced vulnerability scanning");
      console.log("   📜 Comprehensive license analysis");
      console.log("   🔗 License compatibility checking");
      console.log("   ⚖️  Legal risk assessment");
      console.log("   📄 Compliance documentation");
      console.log("   🏢 Enterprise policy validation");

      console.log(`\n📋 ${chalk.bold("Supported Package Managers:")}`);
      console.log("   • npm (package.json, package-lock.json)");
      console.log("   • Yarn (yarn.lock)");
      console.log("   • pnpm (pnpm-lock.yaml)");
      console.log("   • Monorepos with workspaces");
    });

  await program.parseAsync();
  // Normal, explicit shutdown for good measure
  await lifecycle.shutdown();
}

// Export the main function for module usage
export { main };

// Run CLI if this is the main module
if (require.main === module) {
  main().catch(async (error) => {
    console.error("CLI failed:", error);
    await lifecycle.shutdown();
    process.exit(1);
  });
}
