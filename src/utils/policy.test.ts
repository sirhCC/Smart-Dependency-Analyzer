import { evaluatePolicy, type Policy } from './policy';
import type { Package, VulnerabilityScanResult } from '../types';

function makePackage(partial: Partial<Package> = {}): Package {
  return {
    name: 'test-pkg',
    version: '1.0.0',
    ...partial,
  } as Package;
}

function makeScanResult(pkg: Package): VulnerabilityScanResult {
  return {
    reports: [
      {
        package: pkg,
        vulnerabilities: [],
        riskScore: 0,
        riskLevel: 'low',
        riskFactors: [],
        recommendations: [],
        scanMetadata: {
          scanTime: new Date(),
          scanDurationMs: 0,
          dataSourcesUsed: [],
          scanOptions: {},
        },
      },
    ],
    summary: {
      totalPackages: 1,
      scannedPackages: 1,
      totalVulnerabilities: 0,
      criticalVulnerabilities: 0,
      highVulnerabilities: 0,
      mediumVulnerabilities: 0,
      lowVulnerabilities: 0,
      packagesWithVulnerabilities: 0,
      averageRiskScore: 0,
    },
    scanMetadata: {
      scanTime: new Date(),
      scanDurationMs: 0,
      dataSourcesUsed: [],
      scanOptions: {},
    },
  };
}

describe('Policy: publisher checks', () => {
  test('flags when requireKnownPublisher is true and no publishers present', () => {
    const policy: Policy = {
      disallowedLicenses: [],
      maxSeverity: 'critical',
      failOnPolicyViolation: false,
      requireKnownPublisher: true,
      allowedPublisherNames: [],
      allowedPublisherDomains: [],
    };

    const pkg = makePackage();
    const input = { vulnerabilityResults: makeScanResult(pkg), licenseAnalyses: [] };
    const result = evaluatePolicy(policy, input);
    expect(result.hasViolations).toBe(true);
    expect(result.violations[0]).toMatch(/Unknown or unapproved publisher/);
  });

  test('passes when author name is in allowedPublisherNames (case-insensitive)', () => {
    const policy: Policy = {
      disallowedLicenses: [],
      maxSeverity: 'critical',
      failOnPolicyViolation: false,
      requireKnownPublisher: true,
      allowedPublisherNames: ['GoOgLe'],
      allowedPublisherDomains: [],
    };

    const pkg = makePackage({ author: { name: 'google', email: 'dev@google.com' } });
    const input = { vulnerabilityResults: makeScanResult(pkg), licenseAnalyses: [] };
    const result = evaluatePolicy(policy, input);
    expect(result.hasViolations).toBe(false);
  });

  test('passes when maintainer email domain is in allowedPublisherDomains (case-insensitive)', () => {
    const policy: Policy = {
      disallowedLicenses: [],
      maxSeverity: 'critical',
      failOnPolicyViolation: false,
      requireKnownPublisher: true,
      allowedPublisherNames: [],
      allowedPublisherDomains: ['Meta.COM'],
    };

    const pkg = makePackage({ maintainers: [{ name: 'alice', email: 'alice@meta.com' }] });
    const input = { vulnerabilityResults: makeScanResult(pkg), licenseAnalyses: [] };
    const result = evaluatePolicy(policy, input);
    expect(result.hasViolations).toBe(false);
  });

  test('flags when publishers present but do not match allowed lists', () => {
    const policy: Policy = {
      disallowedLicenses: [],
      maxSeverity: 'critical',
      failOnPolicyViolation: false,
      requireKnownPublisher: true,
      allowedPublisherNames: ['Microsoft'],
      allowedPublisherDomains: ['microsoft.com'],
    };

    const pkg = makePackage({ author: { name: 'Unknown Co', email: 'dev@unknown.org' } });
    const input = { vulnerabilityResults: makeScanResult(pkg), licenseAnalyses: [] };
    const result = evaluatePolicy(policy, input);
    expect(result.hasViolations).toBe(true);
  });

  test('does not check publishers when no vulnerability results are provided', () => {
    const policy: Policy = {
      disallowedLicenses: [],
      maxSeverity: 'critical',
      failOnPolicyViolation: false,
      requireKnownPublisher: true,
      allowedPublisherNames: [],
      allowedPublisherDomains: [],
    };

  const result = evaluatePolicy(policy, { vulnerabilityResults: null, licenseAnalyses: [] });
    expect(result.hasViolations).toBe(false);
  });
});
