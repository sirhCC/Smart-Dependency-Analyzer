/**
 * Package Discovery Service - Phase 2 Core Implementation
 * Multi-format package manager support with enterprise-grade reliability
 */
import type { PackageDiscoveryOptions, PackageDiscoveryResult } from '../../types';
/**
 * Enterprise-grade package discovery engine
 * Supports npm, Yarn, pnpm, and monorepo configurations
 */
export declare class PackageDiscoveryService {
    private readonly supportedPackageManagers;
    /**
     * Discover all packages in a project with intelligent detection
     */
    discoverPackages(rootPath: string, options?: PackageDiscoveryOptions): Promise<PackageDiscoveryResult>;
    /**
     * Validate the provided path exists and is accessible
     */
    private validatePath;
    /**
     * Detect project structure and package manager
     */
    private detectProjectStructure;
    /**
     * Detect workspace configuration for monorepos
     */
    private detectWorkspaces;
    /**
     * Resolve workspace glob patterns to actual directories
     */
    private resolveWorkspacePattern;
    /**
     * Discover packages based on project structure
     */
    private discoverProjectPackages;
    /**
     * Discover packages in a single package.json
     */
    private discoverSinglePackage;
    /**
     * Process dependencies from package.json
     */
    private processDependencies;
    /**
     * Build dependency graph for visualization and analysis
     */
    private buildDependencyGraph;
}
/**
 * Factory function for creating package discovery service
 */
export declare function createPackageDiscoveryService(): PackageDiscoveryService;
//# sourceMappingURL=package-discovery.d.ts.map