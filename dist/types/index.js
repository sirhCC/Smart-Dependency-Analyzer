"use strict";
/**
 * Core type definitions for Smart Dependency Analyzer
 * Enterprise-grade type safety with comprehensive domain modeling
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
// License Intelligence Types
__exportStar(require("./license"), exports);
//# sourceMappingURL=index.js.map