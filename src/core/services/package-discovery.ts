/**
 * Package Discovery Service - Phase 2 Core Implementation
 * Multi-format package manager support with enterprise-grade reliability
 */

import { readFile, access, readdir } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';
import { getLogger } from '../../utils/logger';
import type { 
  Package, 
  DependencyType, 
  PackageManager,
  PackageDiscoveryOptions,
  PackageDiscoveryResult,
  LockFileInfo,
  DependencyInfo
} from '../../types';

const logger = getLogger('PackageDiscovery');

/**
 * Enterprise-grade package discovery engine
 * Supports npm, Yarn, pnpm, and monorepo configurations
 */
export class PackageDiscoveryService {
  private readonly supportedPackageManagers: Record<string, PackageManager> = {
    'package-lock.json': 'npm',
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm',
    'pnpm-lock.yml': 'pnpm'
  };

  /**
   * Discover all packages in a project with intelligent detection
   */
  async discoverPackages(
    rootPath: string, 
    options: PackageDiscoveryOptions = {}
  ): Promise<PackageDiscoveryResult> {
    const startTime = Date.now();
    logger.info(`🔍 Starting package discovery in: ${rootPath}`);
    
    try {
      // Validate input path
      await this.validatePath(rootPath);
      
      // Detect project structure and package manager
      const projectInfo = await this.detectProjectStructure(rootPath);
      
      // Discover packages based on project type
      const packages = await this.discoverProjectPackages(rootPath, projectInfo, options);
      
      // Build dependency graph
      const dependencyGraph = await this.buildDependencyGraph(packages);
      
      const discoveryTime = Date.now() - startTime;
      logger.info(`✅ Package discovery completed in ${discoveryTime}ms - Found ${packages.length} packages`);
      
      return {
        packages,
        projectInfo: {
          ...projectInfo,
          rootPath
        },
        dependencyGraph,
        statistics: {
          totalPackages: packages.length,
          directDependencies: packages.filter(p => {
            const depMap = p.dependencies as Map<string, DependencyInfo> || new Map();
            return Array.from(depMap.values()).some(d => d.type === 'production');
          }).length,
          devDependencies: packages.filter(p => {
            const depMap = p.dependencies as Map<string, DependencyInfo> || new Map();
            return Array.from(depMap.values()).some(d => d.type === 'development');
          }).length,
          peerDependencies: packages.filter(p => {
            const depMap = p.dependencies as Map<string, DependencyInfo> || new Map();
            return Array.from(depMap.values()).some(d => d.type === 'peer');
          }).length,
          optionalDependencies: packages.filter(p => {
            const depMap = p.dependencies as Map<string, DependencyInfo> || new Map();
            return Array.from(depMap.values()).some(d => d.type === 'optional');
          }).length,
          discoveryTimeMs: discoveryTime
        }
      };
    } catch (error) {
      logger.error('Package discovery failed:', error);
      throw new Error(`Package discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate the provided path exists and is accessible
   */
  private async validatePath(path: string): Promise<void> {
    try {
      await access(path, constants.R_OK);
    } catch (error) {
      throw new Error(`Cannot access path: ${path}. Please check the path exists and is readable.`);
    }
  }

  /**
   * Detect project structure and package manager
   */
  private async detectProjectStructure(rootPath: string): Promise<{
    packageManager: PackageManager;
    isMonorepo: boolean;
    workspaces: string[];
    lockFileInfo: LockFileInfo | null;
  }> {
    logger.debug(`Detecting project structure for: ${rootPath}`);
    
    // Check for package.json first
    const packageJsonPath = join(rootPath, 'package.json');
    let packageJson: any = null;
    
    try {
      const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
      packageJson = JSON.parse(packageJsonContent);
    } catch (error) {
      throw new Error(`No valid package.json found at: ${packageJsonPath}`);
    }

    // Detect package manager from lock files
    let packageManager: PackageManager = 'npm'; // default
    let lockFileInfo: LockFileInfo | null = null;
    
    for (const [lockFile, manager] of Object.entries(this.supportedPackageManagers)) {
      const lockFilePath = join(rootPath, lockFile);
      try {
        await access(lockFilePath, constants.R_OK);
        packageManager = manager;
        lockFileInfo = {
          path: lockFilePath,
          type: manager,
          exists: true
        };
        break;
      } catch {
        // Lock file doesn't exist, continue checking
      }
    }

    // Detect monorepo configuration
    const workspaces = await this.detectWorkspaces(rootPath, packageJson, packageManager);
    const isMonorepo = workspaces.length > 0;

    logger.info(`📦 Detected: ${packageManager} project ${isMonorepo ? '(monorepo)' : '(single package)'}`);
    
    return {
      packageManager,
      isMonorepo,
      workspaces,
      lockFileInfo
    };
  }

  /**
   * Detect workspace configuration for monorepos
   */
  private async detectWorkspaces(
    rootPath: string, 
    packageJson: any, 
    _packageManager: PackageManager
  ): Promise<string[]> {
    const workspaces: string[] = [];
    
    // Check package.json workspaces field
    if (packageJson.workspaces) {
      const workspacePatterns = Array.isArray(packageJson.workspaces) 
        ? packageJson.workspaces 
        : packageJson.workspaces.packages || [];
        
      for (const pattern of workspacePatterns) {
        const resolvedWorkspaces = await this.resolveWorkspacePattern(rootPath, pattern);
        workspaces.push(...resolvedWorkspaces);
      }
    }
    
    // Check for Lerna configuration
    const lernaConfigPath = join(rootPath, 'lerna.json');
    try {
      await access(lernaConfigPath, constants.R_OK);
      const lernaConfig = JSON.parse(await readFile(lernaConfigPath, 'utf-8'));
      if (lernaConfig.packages) {
        for (const pattern of lernaConfig.packages) {
          const resolvedWorkspaces = await this.resolveWorkspacePattern(rootPath, pattern);
          workspaces.push(...resolvedWorkspaces);
        }
      }
    } catch {
      // No Lerna config found
    }
    
    return [...new Set(workspaces)]; // Remove duplicates
  }

  /**
   * Resolve workspace glob patterns to actual directories
   */
  private async resolveWorkspacePattern(rootPath: string, pattern: string): Promise<string[]> {
    const workspaces: string[] = [];
    
    // Simple implementation - extend with proper glob support later
    if (pattern.includes('*')) {
      // Basic wildcard support
      const baseDir = pattern.replace('/*', '');
      const basePath = join(rootPath, baseDir);
      
      try {
        const entries = await readdir(basePath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const workspacePath = join(basePath, entry.name);
            const workspacePackageJson = join(workspacePath, 'package.json');
            try {
              await access(workspacePackageJson, constants.R_OK);
              workspaces.push(workspacePath);
            } catch {
              // Not a valid workspace
            }
          }
        }
      } catch {
        // Base directory doesn't exist
      }
    } else {
      // Direct path
      const workspacePath = join(rootPath, pattern);
      try {
        await access(join(workspacePath, 'package.json'), constants.R_OK);
        workspaces.push(workspacePath);
      } catch {
        // Not a valid workspace
      }
    }
    
    return workspaces;
  }

  /**
   * Discover packages based on project structure
   */
  private async discoverProjectPackages(
    rootPath: string,
    projectInfo: any,
    options: PackageDiscoveryOptions
  ): Promise<Package[]> {
    const packages: Package[] = [];
    
    // Discover root package
    const rootPackage = await this.discoverSinglePackage(rootPath, 'root', options);
    if (rootPackage) {
      packages.push(rootPackage);
    }
    
    // Discover workspace packages for monorepos
    if (projectInfo.isMonorepo && projectInfo.workspaces.length > 0) {
      logger.info(`🔍 Discovering ${projectInfo.workspaces.length} workspace packages...`);
      
      for (const workspacePath of projectInfo.workspaces) {
        try {
          const workspacePackage = await this.discoverSinglePackage(workspacePath, 'workspace', options);
          if (workspacePackage) {
            packages.push(workspacePackage);
          }
        } catch (error) {
          logger.warn(`Failed to discover workspace package at ${workspacePath}:`, error);
        }
      }
    }
    
    return packages;
  }

  /**
   * Discover packages in a single package.json
   */
  private async discoverSinglePackage(
    packagePath: string, 
    packageType: 'root' | 'workspace',
    options: PackageDiscoveryOptions
  ): Promise<Package | null> {
    const packageJsonPath = join(packagePath, 'package.json');
    
    try {
      const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // Build package object
      const pkg: Package = {
        name: packageJson.name || 'unknown',
        version: packageJson.version || '0.0.0',
        description: packageJson.description || '',
        homepage: packageJson.homepage,
        repository: packageJson.repository,
        bugs: packageJson.bugs,
        license: packageJson.license,
        author: packageJson.author,
        maintainers: packageJson.maintainers || [],
        keywords: packageJson.keywords || [],
        dependencies: new Map<string, DependencyInfo>(),
        path: packagePath,
        packageJson,
        isPrivate: packageJson.private || false,
        ...(packageType === 'root' && { workspaceRoot: packagePath }),
        engines: packageJson.engines,
        scripts: packageJson.scripts,
        peerDependencies: packageJson.peerDependencies,
        optionalDependencies: packageJson.optionalDependencies,
        bundledDependencies: packageJson.bundledDependencies,
        deprecated: false, // Will be determined during vulnerability analysis
        downloadCount: 0, // Will be fetched from registry
        lastModified: new Date(), // Will be determined from registry
        registryUrl: 'https://registry.npmjs.org', // Default registry
        tarballUrl: '',
        integrity: ''
      };
      
      // Process dependencies
      await this.processDependencies(pkg, packageJson, options);
      
      const depMap = pkg.dependencies as Map<string, DependencyInfo>;
      logger.debug(`📦 Discovered package: ${pkg.name}@${pkg.version} (${depMap.size} dependencies)`);
      
      return pkg;
    } catch (error) {
      logger.error(`Failed to parse package.json at ${packageJsonPath}:`, error);
      return null;
    }
  }

  /**
   * Process dependencies from package.json
   */
  private async processDependencies(
    pkg: Package, 
    packageJson: any, 
    options: PackageDiscoveryOptions
  ): Promise<void> {
    const depMap = pkg.dependencies as Map<string, DependencyInfo>;
    
    // Production dependencies
    if (packageJson.dependencies) {
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        depMap.set(name, {
          name,
          version: version as string,
          type: 'production',
          resolved: false
        });
      }
    }
    
    // Development dependencies (if requested)
    if (options.includeDev && packageJson.devDependencies) {
      for (const [name, version] of Object.entries(packageJson.devDependencies)) {
        depMap.set(name, {
          name,
          version: version as string,
          type: 'development',
          resolved: false
        });
      }
    }
    
    // Peer dependencies
    if (packageJson.peerDependencies) {
      for (const [name, version] of Object.entries(packageJson.peerDependencies)) {
        depMap.set(name, {
          name,
          version: version as string,
          type: 'peer',
          resolved: false
        });
      }
    }
    
    // Optional dependencies
    if (packageJson.optionalDependencies) {
      for (const [name, version] of Object.entries(packageJson.optionalDependencies)) {
        depMap.set(name, {
          name,
          version: version as string,
          type: 'optional',
          resolved: false
        });
      }
    }
  }

  /**
   * Build dependency graph for visualization and analysis
   */
  private async buildDependencyGraph(packages: Package[]): Promise<{
    nodes: Array<{ id: string; label: string; type: DependencyType }>;
    edges: Array<{ from: string; to: string; type: DependencyType }>;
  }> {
    const nodes: Array<{ id: string; label: string; type: DependencyType }> = [];
    const edges: Array<{ from: string; to: string; type: DependencyType }> = [];
    
    // Add package nodes
    for (const pkg of packages) {
      nodes.push({
        id: pkg.name,
        label: `${pkg.name}@${pkg.version}`,
        type: 'production'
      });
      
      // Add dependency edges
      const depMap = pkg.dependencies as Map<string, DependencyInfo>;
      for (const [depName, depInfo] of depMap) {
        // Add dependency node if not already present
        if (!nodes.find(n => n.id === depName)) {
          nodes.push({
            id: depName,
            label: `${depName}@${depInfo.version}`,
            type: depInfo.type
          });
        }
        
        // Add edge
        edges.push({
          from: pkg.name,
          to: depName,
          type: depInfo.type
        });
      }
    }
    
    logger.info(`📊 Built dependency graph: ${nodes.length} nodes, ${edges.length} edges`);
    
    return { nodes, edges };
  }
}

/**
 * Factory function for creating package discovery service
 */
export function createPackageDiscoveryService(): PackageDiscoveryService {
  return new PackageDiscoveryService();
}
