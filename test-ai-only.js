import { AIEngine } from './src/core/intelligence/ai-engine.ts';
import { cacheManager } from './src/core/performance/cache-manager.ts';

console.log('Creating AI Engine...');
const aiEngine = new AIEngine({
  enableVulnerabilityPrediction: true,
  enableSmartRecommendations: true,
  enablePredictiveAnalytics: true,
  confidenceThreshold: 0.6
});

console.log('AI Engine created, waiting 2 seconds...');

setTimeout(() => {
  console.log('Destroying AI Engine...');
  aiEngine.destroy();
  
  console.log('Destroying cache manager...');
  cacheManager.destroy();
  
  console.log('Done - should exit now');
}, 2000);
