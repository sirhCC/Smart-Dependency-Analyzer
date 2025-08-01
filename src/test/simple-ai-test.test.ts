/**
 * Simplified AI Security Validation Test
 * Testing just basic AI engine functionality to identify hanging issues
 */

import { AIEngine } from '../core/intelligence/ai-engine';
import { Package } from '../types';
import { cacheManager } from '../core/performance/cache-manager';

// Track all created engines for cleanup
const createdEngines: AIEngine[] = [];

function createSimpleTestData(): Package[] {
  return [
    {
      name: 'test-package',
      version: '1.0.0',
      description: 'A simple test package',
      author: { name: 'test', email: 'test@example.com' },
      license: 'MIT',
      dependencies: new Map(),
      devDependencies: {},
      scripts: {},
      repository: { type: 'git', url: 'https://github.com/test/test.git' },
      downloadCount: 1000,
      publishedAt: new Date('2023-01-01'),
      maintainers: [{ name: 'test', email: 'test@example.com' }],
      keywords: ['test']
    }
  ];
}

describe('Simple AI Security Validation', () => {
  describe('Basic AI Engine Tests', () => {
    it('should create and use AI engine without hanging', async () => {
      console.log('Creating simple AI engine...');
      
      const aiEngine = new AIEngine({
        enableVulnerabilityPrediction: true,
        enableSmartRecommendations: false,
        enablePredictiveAnalytics: false,
        confidenceThreshold: 0.7,
      });
      createdEngines.push(aiEngine);

      const testPackages = createSimpleTestData();
      
      console.log('Running vulnerability prediction...');
      const predictions = await aiEngine.predictVulnerabilities(testPackages);
      
      expect(predictions).toBeDefined();
      expect(Array.isArray(predictions)).toBe(true);
      
      console.log('Test completed successfully!');
    }, 10000);

    it('should handle multiple packages', async () => {
      console.log('Creating AI engine for multiple packages...');
      
      const aiEngine = new AIEngine({
        enableVulnerabilityPrediction: true,
        enableSmartRecommendations: true,
        enablePredictiveAnalytics: false,
        confidenceThreshold: 0.7,
      });
      createdEngines.push(aiEngine);

      const testPackages = [
        ...createSimpleTestData(),
        {
          name: 'another-package',
          version: '2.0.0',
          description: 'Another test package',
          author: { name: 'test2', email: 'test2@example.com' },
          license: 'MIT',
          dependencies: new Map(),
          devDependencies: {},
          scripts: {},
          repository: { type: 'git', url: 'https://github.com/test/test2.git' },
          downloadCount: 2000,
          publishedAt: new Date('2023-02-01'),
          maintainers: [{ name: 'test2', email: 'test2@example.com' }],
          keywords: ['test', 'utility']
        }
      ];
      
      console.log('Running predictions and recommendations...');
      const predictions = await aiEngine.predictVulnerabilities(testPackages);
      const recommendations = await aiEngine.generateRecommendations(testPackages);
      
      expect(predictions).toBeDefined();
      expect(recommendations).toBeDefined();
      expect(predictions.length).toBe(testPackages.length);
      
      console.log('Multi-package test completed successfully!');
    }, 15000);
  });

  // Cleanup after all tests to prevent hanging
  afterAll(() => {
    console.log('Cleaning up AI engines...');
    // Cleanup all created AI engines
    createdEngines.forEach(engine => {
      if (engine && typeof engine.destroy === 'function') {
        engine.destroy();
      }
    });
    
    console.log('Cleaning up cache manager...');
    // Cleanup cache manager
    cacheManager.destroy();
    
    console.log('All cleanup completed!');
  });
});
