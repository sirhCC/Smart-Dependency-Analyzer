/**
 * AI Security Validation Test Suite
 *
 * Comprehensive tests to validate our AI/ML system's ability to detect:
 * - Malicious packages (typosquatting, backdoors, crypto mining)
 * - Known vulnerable packages with real CVEs
 * - Suspicious patterns and behaviors
 * - Supply chain attacks and dependency confusion
 */
import { Package, Vulnerability } from '../types';
/**
 * Create realistic malicious and vulnerable test packages based on real-world threats
 */
declare function createMaliciousTestData(): {
    maliciousPackages: Package[];
    vulnerablePackages: Package[];
    realVulnerabilities: Vulnerability[];
};
/**
 * Test AI system's ability to detect malicious packages
 */
declare function testMaliciousPackageDetection(): Promise<void>;
/**
 * Test AI system's ability to detect supply chain attack patterns
 */
declare function testSupplyChainAttackDetection(): Promise<void>;
/**
 * Test AI system's threat intelligence extraction capabilities
 */
declare function testThreatIntelligenceExtraction(): Promise<void>;
/**
 * Test performance under attack scenarios
 */
declare function testPerformanceUnderAttack(): Promise<void>;
/**
 * Main test execution
 */
declare function runSecurityValidationTests(): Promise<void>;
export { runSecurityValidationTests, testMaliciousPackageDetection, testSupplyChainAttackDetection, testThreatIntelligenceExtraction, testPerformanceUnderAttack, createMaliciousTestData };
//# sourceMappingURL=ai-security-validation-test.d.ts.map