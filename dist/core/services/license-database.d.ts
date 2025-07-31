/**
 * License Database
 * Comprehensive database of software licenses with SPDX compliance
 */
import { License, LicenseCategory } from '../../types/license';
/**
 * Comprehensive license database with SPDX-compliant license definitions
 */
export declare class LicenseDatabase {
    private static instance;
    private licenses;
    private aliasMap;
    private constructor();
    static getInstance(): LicenseDatabase;
    /**
     * Get license by SPDX identifier
     */
    getLicense(spdxId: string): License | undefined;
    /**
     * Search licenses by name or keywords
     */
    searchLicenses(query: string): License[];
    /**
     * Get all licenses by category
     */
    getLicensesByCategory(category: LicenseCategory): License[];
    /**
     * Get all available licenses
     */
    getAllLicenses(): License[];
    /**
     * Check if a license is OSI approved
     */
    isOsiApproved(spdxId: string): boolean;
    /**
     * Check if a license is FSF approved
     */
    isFsfApproved(spdxId: string): boolean;
    /**
     * Initialize the license database with common licenses
     */
    private initializeLicenses;
    /**
     * Initialize license aliases for common variations
     */
    private initializeAliases;
}
/**
 * Get the singleton license database instance
 */
export declare function getLicenseDatabase(): LicenseDatabase;
//# sourceMappingURL=license-database.d.ts.map