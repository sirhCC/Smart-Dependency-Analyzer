"use strict";
/**
 * License Intelligence Types
 * Comprehensive type definitions for license analysis, compatibility, and compliance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObligationType = exports.LegalRiskLevel = exports.CompatibilityLevel = exports.LicenseCategory = void 0;
/**
 * Standard license categories based on legal characteristics
 */
var LicenseCategory;
(function (LicenseCategory) {
    LicenseCategory["PERMISSIVE"] = "permissive";
    LicenseCategory["COPYLEFT"] = "copyleft";
    LicenseCategory["WEAK_COPYLEFT"] = "weak_copyleft";
    LicenseCategory["PROPRIETARY"] = "proprietary";
    LicenseCategory["PUBLIC_DOMAIN"] = "public_domain";
    LicenseCategory["CUSTOM"] = "custom";
    LicenseCategory["UNKNOWN"] = "unknown";
})(LicenseCategory || (exports.LicenseCategory = LicenseCategory = {}));
/**
 * License compatibility levels for mixing different licenses
 */
var CompatibilityLevel;
(function (CompatibilityLevel) {
    CompatibilityLevel["COMPATIBLE"] = "compatible";
    CompatibilityLevel["CONDITIONALLY_COMPATIBLE"] = "conditionally_compatible";
    CompatibilityLevel["INCOMPATIBLE"] = "incompatible";
    CompatibilityLevel["REQUIRES_REVIEW"] = "requires_review";
    CompatibilityLevel["UNKNOWN"] = "unknown";
})(CompatibilityLevel || (exports.CompatibilityLevel = CompatibilityLevel = {}));
/**
 * Legal risk levels for license compliance
 */
var LegalRiskLevel;
(function (LegalRiskLevel) {
    LegalRiskLevel["VERY_LOW"] = "very_low";
    LegalRiskLevel["LOW"] = "low";
    LegalRiskLevel["MEDIUM"] = "medium";
    LegalRiskLevel["HIGH"] = "high";
    LegalRiskLevel["VERY_HIGH"] = "very_high";
    LegalRiskLevel["CRITICAL"] = "critical";
})(LegalRiskLevel || (exports.LegalRiskLevel = LegalRiskLevel = {}));
/**
 * License obligation types that must be fulfilled
 */
var ObligationType;
(function (ObligationType) {
    ObligationType["ATTRIBUTION"] = "attribution";
    ObligationType["COPYLEFT"] = "copyleft";
    ObligationType["DISCLOSE_SOURCE"] = "disclose_source";
    ObligationType["SAME_LICENSE"] = "same_license";
    ObligationType["PATENT_GRANT"] = "patent_grant";
    ObligationType["NO_COMMERCIAL_USE"] = "no_commercial_use";
    ObligationType["SHARE_ALIKE"] = "share_alike";
    ObligationType["NOTICE_PRESERVATION"] = "notice_preservation";
})(ObligationType || (exports.ObligationType = ObligationType = {}));
//# sourceMappingURL=license.js.map