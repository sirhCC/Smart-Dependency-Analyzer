"use strict";
/**
 * Core type definitions for Smart Dependency Analyzer
 * Enterprise-grade type safety with comprehensive domain modeling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportFormat = exports.ComplianceStatus = exports.FindingType = exports.CopyleftType = exports.VulnerabilitySource = exports.VulnerabilitySeverity = void 0;
var VulnerabilitySeverity;
(function (VulnerabilitySeverity) {
    VulnerabilitySeverity["LOW"] = "low";
    VulnerabilitySeverity["MEDIUM"] = "medium";
    VulnerabilitySeverity["HIGH"] = "high";
    VulnerabilitySeverity["CRITICAL"] = "critical";
})(VulnerabilitySeverity || (exports.VulnerabilitySeverity = VulnerabilitySeverity = {}));
var VulnerabilitySource;
(function (VulnerabilitySource) {
    VulnerabilitySource["GITHUB"] = "github";
    VulnerabilitySource["SNYK"] = "snyk";
    VulnerabilitySource["NVD"] = "nvd";
    VulnerabilitySource["OSV"] = "osv";
    VulnerabilitySource["NPM"] = "npm";
    VulnerabilitySource["CUSTOM"] = "custom";
})(VulnerabilitySource || (exports.VulnerabilitySource = VulnerabilitySource = {}));
var CopyleftType;
(function (CopyleftType) {
    CopyleftType["NONE"] = "none";
    CopyleftType["WEAK"] = "weak";
    CopyleftType["STRONG"] = "strong";
    CopyleftType["NETWORK"] = "network";
})(CopyleftType || (exports.CopyleftType = CopyleftType = {}));
var FindingType;
(function (FindingType) {
    FindingType["VULNERABILITY"] = "vulnerability";
    FindingType["LICENSE"] = "license";
    FindingType["PERFORMANCE"] = "performance";
    FindingType["SUPPLY_CHAIN"] = "supply_chain";
    FindingType["POLICY"] = "policy";
    FindingType["QUALITY"] = "quality";
})(FindingType || (exports.FindingType = FindingType = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "compliant";
    ComplianceStatus["NON_COMPLIANT"] = "non_compliant";
    ComplianceStatus["REQUIRES_REVIEW"] = "requires_review";
    ComplianceStatus["UNKNOWN"] = "unknown";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["JSON"] = "json";
    ReportFormat["HTML"] = "html";
    ReportFormat["PDF"] = "pdf";
    ReportFormat["CSV"] = "csv";
    ReportFormat["MARKDOWN"] = "markdown";
    ReportFormat["SARIF"] = "sarif";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
//# sourceMappingURL=index.js.map