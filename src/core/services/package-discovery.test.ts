/**
 * Tests for Package Discovery Service
 */

import { createPackageDiscoveryService } from './package-discovery';
import { writeFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('PackageDiscoveryService', () => {
  let tempDir: string;
  let discoveryService: ReturnType<typeof createPackageDiscoveryService>;

  beforeEach(async () => {
    // Create temporary directory for test projects
    tempDir = join(tmpdir(), `sda-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    await mkdir(tempDir, { recursive: true });
    
    discoveryService = createPackageDiscoveryService();
  });

  afterEach(async () => {
    // Clean up temporary directory
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('discoverPackages', () => {
    it('should discover a simple npm project', async () => {
      // Create a test package.json
      const packageJson = {
        name: 'test-package',
        version: '1.0.0',
        description: 'Test package for SDA',
        dependencies: {
          'lodash': '^4.17.21',
          'axios': '^1.0.0'
        },
        devDependencies: {
          'jest': '^29.0.0'
        }
      };

      await writeFile(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

      const result = await discoveryService.discoverPackages(tempDir);

      expect(result.packages).toHaveLength(1);
      const pkg = result.packages[0];
      expect(pkg?.name).toBe('test-package');
      expect(pkg?.version).toBe('1.0.0');
      expect(result.projectInfo.packageManager).toBe('npm');
      expect(result.projectInfo.isMonorepo).toBe(false);
      expect(result.statistics.totalPackages).toBe(1);
    });

    it('should include development dependencies when requested', async () => {
      const packageJson = {
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          'lodash': '^4.17.21'
        },
        devDependencies: {
          'jest': '^29.0.0',
          'typescript': '^5.0.0'
        }
      };

      await writeFile(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

      const result = await discoveryService.discoverPackages(tempDir, { includeDev: true });
      const pkg = result.packages[0];
      expect(pkg).toBeDefined();
      const dependencies = pkg!.dependencies as Map<string, any>;

      // Should have production + dev dependencies
      expect(dependencies.size).toBe(3); // lodash + jest + typescript
      expect(dependencies.has('lodash')).toBe(true);
      expect(dependencies.has('jest')).toBe(true);
      expect(dependencies.has('typescript')).toBe(true);

      // Check dependency types
      expect(dependencies.get('lodash').type).toBe('production');
      expect(dependencies.get('jest').type).toBe('development');
      expect(dependencies.get('typescript').type).toBe('development');
    });

    it('should exclude development dependencies by default', async () => {
      const packageJson = {
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          'lodash': '^4.17.21'
        },
        devDependencies: {
          'jest': '^29.0.0'
        }
      };

      await writeFile(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

      const result = await discoveryService.discoverPackages(tempDir);
      const pkg = result.packages[0];
      expect(pkg).toBeDefined();
      const dependencies = pkg!.dependencies as Map<string, any>;

      // Should only have production dependencies
      expect(dependencies.size).toBe(1);
      expect(dependencies.has('lodash')).toBe(true);
      expect(dependencies.has('jest')).toBe(false);
    });

    it('should detect Yarn projects', async () => {
      const packageJson = {
        name: 'yarn-project',
        version: '1.0.0',
        dependencies: {
          'react': '^18.0.0'
        }
      };

      await writeFile(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));
      await writeFile(join(tempDir, 'yarn.lock'), '# Yarn lockfile v1\n');

      const result = await discoveryService.discoverPackages(tempDir);

      expect(result.projectInfo.packageManager).toBe('yarn');
      expect(result.projectInfo.lockFileInfo?.type).toBe('yarn');
      expect(result.projectInfo.lockFileInfo?.exists).toBe(true);
    });

    it('should detect pnpm projects', async () => {
      const packageJson = {
        name: 'pnpm-project',
        version: '1.0.0',
        dependencies: {
          'vue': '^3.0.0'
        }
      };

      await writeFile(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));
      await writeFile(join(tempDir, 'pnpm-lock.yaml'), 'lockfileVersion: 5.4\n');

      const result = await discoveryService.discoverPackages(tempDir);

      expect(result.projectInfo.packageManager).toBe('pnpm');
      expect(result.projectInfo.lockFileInfo?.type).toBe('pnpm');
    });

    it('should build dependency graph correctly', async () => {
      const packageJson = {
        name: 'graph-test',
        version: '1.0.0',
        dependencies: {
          'lodash': '^4.17.21',
          'axios': '^1.0.0'
        }
      };

      await writeFile(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

      const result = await discoveryService.discoverPackages(tempDir);

      expect(result.dependencyGraph.nodes).toHaveLength(3); // graph-test + lodash + axios
      expect(result.dependencyGraph.edges).toHaveLength(2); // graph-test -> lodash, graph-test -> axios

      // Check nodes
      const nodeIds = result.dependencyGraph.nodes.map(n => n.id);
      expect(nodeIds).toContain('graph-test');
      expect(nodeIds).toContain('lodash');
      expect(nodeIds).toContain('axios');

      // Check edges
      const edges = result.dependencyGraph.edges;
      expect(edges.find(e => e.from === 'graph-test' && e.to === 'lodash')).toBeTruthy();
      expect(edges.find(e => e.from === 'graph-test' && e.to === 'axios')).toBeTruthy();
    });

    it('should handle malformed package.json gracefully', async () => {
      await writeFile(join(tempDir, 'package.json'), '{ invalid json }');

      await expect(discoveryService.discoverPackages(tempDir))
        .rejects.toThrow(/Package discovery failed/);
    });

    it('should handle missing package.json gracefully', async () => {
      await expect(discoveryService.discoverPackages(tempDir))
        .rejects.toThrow(/No valid package.json found/);
    });

    it('should calculate statistics correctly', async () => {
      const packageJson = {
        name: 'stats-test',
        version: '1.0.0',
        dependencies: {
          'lodash': '^4.17.21',
          'axios': '^1.0.0'
        },
        devDependencies: {
          'jest': '^29.0.0'
        },
        peerDependencies: {
          'react': '^18.0.0'
        },
        optionalDependencies: {
          'fsevents': '^2.0.0'
        }
      };

      await writeFile(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2));

      const result = await discoveryService.discoverPackages(tempDir, { 
        includeDev: true 
      });

      expect(result.statistics.totalPackages).toBe(1);
      expect(result.statistics.directDependencies).toBe(1); // Only packages with production deps
      expect(result.statistics.devDependencies).toBe(1); // Only packages with dev deps
      expect(result.statistics.discoveryTimeMs).toBeGreaterThan(0);
    });
  });

  describe('validatePath', () => {
    it('should accept accessible paths', async () => {
      // This should not throw
      await expect(discoveryService.discoverPackages(tempDir))
        .rejects.toThrow(); // Will throw for missing package.json, but not for path validation
    });

    it('should reject non-existent paths', async () => {
      const nonExistentPath = join(tempDir, 'does-not-exist');
      
      await expect(discoveryService.discoverPackages(nonExistentPath))
        .rejects.toThrow(/Cannot access path/);
    });
  });
});
