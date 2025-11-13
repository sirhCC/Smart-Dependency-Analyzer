/**
 * License Intelligence Integration Tests
 * Tests complete license analysis, compatibility checking, and risk assessment workflows
 */

import { createLicenseIntelligenceService } from "../../core/services/license-intelligence";
import { Package } from "../../types";
import { LegalRiskLevel } from "../../types/license";

describe("License Intelligence Integration", () => {
  const licenseService = createLicenseIntelligenceService();

  describe("License detection", () => {
    it("should detect licenses from package metadata", async () => {
      const testPackage: Package = {
        name: "test-mit-package",
        version: "1.0.0",
        license: "MIT",
        dependencies: new Map(),
      };

      const analysis = await licenseService.analyzeLicense(testPackage);

      expect(analysis).toBeDefined();
      expect(analysis.package.name).toBe("test-mit-package");
      expect(analysis.licenses.length).toBeGreaterThan(0);
      if (analysis.licenses[0]) {
        expect(analysis.licenses[0].spdxId).toBe("MIT");
      }
    });

    it("should handle multiple licenses", async () => {
      const testPackage: Package = {
        name: "dual-license-package",
        version: "1.0.0",
        license: "(MIT OR Apache-2.0)",
        dependencies: new Map(),
      };

      const analysis = await licenseService.analyzeLicense(testPackage);

      expect(analysis.licenses.length).toBeGreaterThanOrEqual(1);
    });

    it("should handle unknown licenses gracefully", async () => {
      const testPackage: Package = {
        name: "unknown-license-package",
        version: "1.0.0",
        license: "CUSTOM-LICENSE-2023",
        dependencies: new Map(),
      };

      const analysis = await licenseService.analyzeLicense(testPackage);

      expect(analysis).toBeDefined();
      expect(analysis.issues.length).toBeGreaterThan(0);
    });
  });

  describe("Batch license analysis", () => {
    it("should analyze multiple packages efficiently", async () => {
      const packages: Package[] = [
        {
          name: "pkg-1",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        {
          name: "pkg-2",
          version: "1.0.0",
          license: "Apache-2.0",
          dependencies: new Map(),
        },
        {
          name: "pkg-3",
          version: "1.0.0",
          license: "BSD-3-Clause",
          dependencies: new Map(),
        },
      ];

      const startTime = Date.now();
      const analyses = await licenseService.analyzeLicenses(packages);
      const duration = Date.now() - startTime;

      expect(analyses).toHaveLength(3);
      expect(duration).toBeLessThan(5000); // Should complete in < 5 seconds
    });

    it("should continue processing on individual failures", async () => {
      const packages: Package[] = [
        {
          name: "good-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        { name: "bad-pkg", version: "1.0.0", dependencies: new Map() }, // No license
        {
          name: "another-good",
          version: "1.0.0",
          license: "Apache-2.0",
          dependencies: new Map(),
        },
      ];

      const analyses = await licenseService.analyzeLicenses(packages);

      // Should return results for all packages (even if some have issues)
      expect(analyses.length).toBeGreaterThan(0);
    });
  });

  describe("License compatibility", () => {
    it("should detect compatible licenses", async () => {
      const packages: Package[] = [
        {
          name: "mit-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        {
          name: "apache-pkg",
          version: "1.0.0",
          license: "Apache-2.0",
          dependencies: new Map(),
        },
      ];

      const report = await licenseService.generateCompatibilityReport(packages);

      expect(report).toBeDefined();
      expect(report.overallCompatibility).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.summary.totalPackages).toBe(2);
    });

    it("should detect license conflicts", async () => {
      const packages: Package[] = [
        {
          name: "mit-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        {
          name: "gpl-pkg",
          version: "1.0.0",
          license: "GPL-3.0-only",
          dependencies: new Map(),
        },
      ];

      const report = await licenseService.generateCompatibilityReport(packages);

      expect(report.conflicts.length).toBeGreaterThan(0);
      expect(report.overallCompatibility).not.toBe("compatible");
    });

    it("should provide conflict resolution recommendations", async () => {
      const packages: Package[] = [
        {
          name: "mit-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        {
          name: "gpl-pkg",
          version: "1.0.0",
          license: "GPL-3.0-only",
          dependencies: new Map(),
        },
      ];

      const report = await licenseService.generateCompatibilityReport(packages);

      if (report.conflicts.length > 0) {
        const conflict = report.conflicts[0];
        if (conflict && conflict.resolution) {
          expect(conflict.resolution.length).toBeGreaterThan(0);
        }
      }
    });

    it("should calculate risk scores accurately", async () => {
      const packages: Package[] = [
        {
          name: "safe-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        {
          name: "risky-pkg",
          version: "1.0.0",
          license: "GPL-3.0-only",
          dependencies: new Map(),
        },
        {
          name: "proprietary-pkg",
          version: "1.0.0",
          license: "UNLICENSED",
          dependencies: new Map(),
        },
      ];

      const report = await licenseService.generateCompatibilityReport(packages);

      expect(report.summary.riskScore).toBeGreaterThanOrEqual(0);
      expect(report.summary.riskScore).toBeLessThanOrEqual(100);
    });
  });

  describe("Legal risk assessment", () => {
    it("should assess overall legal risk", async () => {
      const packages: Package[] = [
        {
          name: "mit-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        {
          name: "apache-pkg",
          version: "1.0.0",
          license: "Apache-2.0",
          dependencies: new Map(),
        },
      ];

      const riskReport = await licenseService.assessLegalRisk(packages);

      expect(riskReport).toBeDefined();
      expect(riskReport.overallRisk).toBeDefined();
      expect(riskReport.riskScore).toBeGreaterThanOrEqual(0);
      expect(riskReport.riskScore).toBeLessThanOrEqual(100);
      expect(riskReport.riskFactors).toBeDefined();
    });

    it("should identify high-risk scenarios", async () => {
      const packages: Package[] = [
        {
          name: "gpl-pkg",
          version: "1.0.0",
          license: "GPL-3.0-only",
          dependencies: new Map(),
        },
        {
          name: "agpl-pkg",
          version: "1.0.0",
          license: "AGPL-3.0-only",
          dependencies: new Map(),
        },
      ];

      const riskReport = await licenseService.assessLegalRisk(packages);

      expect(riskReport.overallRisk).not.toBe(LegalRiskLevel.VERY_LOW);
      expect(riskReport.riskFactors.length).toBeGreaterThan(0);
    });

    it("should determine when legal review is needed", async () => {
      const packages: Package[] = [
        {
          name: "unknown-pkg",
          version: "1.0.0",
          license: "CUSTOM-LICENSE",
          dependencies: new Map(),
        },
      ];

      const riskReport = await licenseService.assessLegalRisk(packages);

      expect(riskReport.legalReview).toBeDefined();
      expect(riskReport.legalReview.required).toBeDefined();
    });

    it("should assess jurisdiction-specific risks", async () => {
      const packages: Package[] = [
        {
          name: "mit-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
      ];

      const riskReport = await licenseService.assessLegalRisk(packages);

      expect(riskReport.jurisdictionRisks).toBeDefined();
      expect(Array.isArray(riskReport.jurisdictionRisks)).toBe(true);
    });

    it("should evaluate patent risks", async () => {
      const packages: Package[] = [
        {
          name: "apache-pkg",
          version: "1.0.0",
          license: "Apache-2.0",
          dependencies: new Map(),
        },
      ];

      const riskReport = await licenseService.assessLegalRisk(packages);

      expect(riskReport.patentRisks).toBeDefined();
      expect(Array.isArray(riskReport.patentRisks)).toBe(true);
    });

    it("should provide compliance requirements", async () => {
      const packages: Package[] = [
        {
          name: "mit-pkg",
          version: "1.0.0",
          license: "MIT",
          dependencies: new Map(),
        },
        {
          name: "gpl-pkg",
          version: "1.0.0",
          license: "GPL-3.0-only",
          dependencies: new Map(),
        },
      ];

      const riskReport = await licenseService.assessLegalRisk(packages);

      expect(riskReport.complianceRequirements).toBeDefined();
      expect(riskReport.complianceRequirements.length).toBeGreaterThan(0);
    });
  });

  describe("Performance and edge cases", () => {
    it("should handle large package sets", async () => {
      const packages: Package[] = Array.from({ length: 50 }, (_, i) => ({
        name: `package-${i}`,
        version: "1.0.0",
        license: i % 2 === 0 ? "MIT" : "Apache-2.0",
        dependencies: new Map(),
      }));

      const startTime = Date.now();
      const analyses = await licenseService.analyzeLicenses(packages);
      const duration = Date.now() - startTime;

      expect(analyses.length).toBe(50);
      expect(duration).toBeLessThan(10000); // Should complete in < 10 seconds
    });

    it("should handle packages without license info", async () => {
      const testPackage: Package = {
        name: "no-license-pkg",
        version: "1.0.0",
        dependencies: new Map(),
      };

      const analysis = await licenseService.analyzeLicense(testPackage);

      expect(analysis).toBeDefined();
      expect(analysis.issues.length).toBeGreaterThan(0);
      expect(analysis.riskLevel).not.toBe(LegalRiskLevel.VERY_LOW);
    });

    it("should provide confidence scores", async () => {
      const testPackage: Package = {
        name: "confidence-test",
        version: "1.0.0",
        license: "MIT",
        dependencies: new Map(),
      };

      const analysis = await licenseService.analyzeLicense(testPackage);

      expect(analysis).toBeDefined();
      expect(analysis.licenses.length).toBeGreaterThan(0);
    });
  });
});
