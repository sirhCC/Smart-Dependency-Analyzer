/**
 * License Database
 * Comprehensive database of software licenses with SPDX compliance
 */

import { License, LicenseCategory, ObligationType } from '../../types/license';

/**
 * Comprehensive license database with SPDX-compliant license definitions
 */
export class LicenseDatabase {
  private static instance: LicenseDatabase;
  private licenses: Map<string, License> = new Map();
  private aliasMap: Map<string, string> = new Map();

  private constructor() {
    this.initializeLicenses();
    this.initializeAliases();
  }

  public static getInstance(): LicenseDatabase {
    if (!LicenseDatabase.instance) {
      LicenseDatabase.instance = new LicenseDatabase();
    }
    return LicenseDatabase.instance;
  }

  /**
   * Get license by SPDX identifier
   */
  public getLicense(spdxId: string): License | undefined {
    // Try direct lookup first
    let license = this.licenses.get(spdxId);
    if (license) return license;

    // Try alias lookup
    const canonicalId = this.aliasMap.get(spdxId.toLowerCase());
    if (canonicalId) {
      license = this.licenses.get(canonicalId);
    }

    return license;
  }

  /**
   * Search licenses by name or keywords
   */
  public searchLicenses(query: string): License[] {
    const searchTerm = query.toLowerCase();
    const results: License[] = [];

    for (const license of this.licenses.values()) {
      if (
        license.spdxId.toLowerCase().includes(searchTerm) ||
        license.name.toLowerCase().includes(searchTerm) ||
        license.deprecatedIds?.some(id => id.toLowerCase().includes(searchTerm))
      ) {
        results.push(license);
      }
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get all licenses by category
   */
  public getLicensesByCategory(category: LicenseCategory): License[] {
    return Array.from(this.licenses.values())
      .filter(license => license.category === category)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get all available licenses
   */
  public getAllLicenses(): License[] {
    return Array.from(this.licenses.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Check if a license is OSI approved
   */
  public isOsiApproved(spdxId: string): boolean {
    const license = this.getLicense(spdxId);
    return license?.osiApproved ?? false;
  }

  /**
   * Check if a license is FSF approved
   */
  public isFsfApproved(spdxId: string): boolean {
    const license = this.getLicense(spdxId);
    return license?.fsfApproved ?? false;
  }

  /**
   * Initialize the license database with common licenses
   */
  private initializeLicenses(): void {
    const licenses: License[] = [
      // Permissive Licenses
      {
        spdxId: 'MIT',
        name: 'MIT License',
        category: LicenseCategory.PERMISSIVE,
        osiApproved: true,
        fsfApproved: true,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.NOTICE_PRESERVATION],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://opensource.org/licenses/MIT'
      },
      {
        spdxId: 'Apache-2.0',
        name: 'Apache License 2.0',
        category: LicenseCategory.PERMISSIVE,
        osiApproved: true,
        fsfApproved: true,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.NOTICE_PRESERVATION,
          ObligationType.PATENT_GRANT
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://www.apache.org/licenses/LICENSE-2.0'
      },
      {
        spdxId: 'BSD-3-Clause',
        name: 'BSD 3-Clause "New" or "Revised" License',
        category: LicenseCategory.PERMISSIVE,
        osiApproved: true,
        fsfApproved: true,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.NOTICE_PRESERVATION],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://opensource.org/licenses/BSD-3-Clause'
      },
      {
        spdxId: 'BSD-2-Clause',
        name: 'BSD 2-Clause "Simplified" License',
        category: LicenseCategory.PERMISSIVE,
        osiApproved: true,
        fsfApproved: true,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.NOTICE_PRESERVATION],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://opensource.org/licenses/BSD-2-Clause'
      },
      {
        spdxId: 'ISC',
        name: 'ISC License',
        category: LicenseCategory.PERMISSIVE,
        osiApproved: true,
        fsfApproved: true,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.NOTICE_PRESERVATION],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://opensource.org/licenses/ISC'
      },

      // Copyleft Licenses
      {
        spdxId: 'GPL-3.0-only',
        name: 'GNU General Public License v3.0 only',
        category: LicenseCategory.COPYLEFT,
        osiApproved: true,
        fsfApproved: true,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.COPYLEFT,
          ObligationType.DISCLOSE_SOURCE,
          ObligationType.SAME_LICENSE,
          ObligationType.PATENT_GRANT
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://www.gnu.org/licenses/gpl-3.0.html',
        deprecatedIds: ['GPL-3.0']
      },
      {
        spdxId: 'GPL-2.0-only',
        name: 'GNU General Public License v2.0 only',
        category: LicenseCategory.COPYLEFT,
        osiApproved: true,
        fsfApproved: true,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.COPYLEFT,
          ObligationType.DISCLOSE_SOURCE,
          ObligationType.SAME_LICENSE
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
        deprecatedIds: ['GPL-2.0']
      },
      {
        spdxId: 'AGPL-3.0-only',
        name: 'GNU Affero General Public License v3.0 only',
        category: LicenseCategory.COPYLEFT,
        osiApproved: true,
        fsfApproved: true,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.COPYLEFT,
          ObligationType.DISCLOSE_SOURCE,
          ObligationType.SAME_LICENSE,
          ObligationType.PATENT_GRANT
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://www.gnu.org/licenses/agpl-3.0.html',
        deprecatedIds: ['AGPL-3.0']
      },

      // Weak Copyleft Licenses
      {
        spdxId: 'LGPL-3.0-only',
        name: 'GNU Lesser General Public License v3.0 only',
        category: LicenseCategory.WEAK_COPYLEFT,
        osiApproved: true,
        fsfApproved: true,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.COPYLEFT,
          ObligationType.DISCLOSE_SOURCE
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://www.gnu.org/licenses/lgpl-3.0.html',
        deprecatedIds: ['LGPL-3.0']
      },
      {
        spdxId: 'LGPL-2.1-only',
        name: 'GNU Lesser General Public License v2.1 only',
        category: LicenseCategory.WEAK_COPYLEFT,
        osiApproved: true,
        fsfApproved: true,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.COPYLEFT,
          ObligationType.DISCLOSE_SOURCE
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html',
        deprecatedIds: ['LGPL-2.1']
      },
      {
        spdxId: 'MPL-2.0',
        name: 'Mozilla Public License 2.0',
        category: LicenseCategory.WEAK_COPYLEFT,
        osiApproved: true,
        fsfApproved: true,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.DISCLOSE_SOURCE,
          ObligationType.PATENT_GRANT
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://www.mozilla.org/en-US/MPL/2.0/'
      },
      {
        spdxId: 'EPL-2.0',
        name: 'Eclipse Public License 2.0',
        category: LicenseCategory.WEAK_COPYLEFT,
        osiApproved: true,
        fsfApproved: false,
        obligations: [
          ObligationType.ATTRIBUTION,
          ObligationType.DISCLOSE_SOURCE,
          ObligationType.PATENT_GRANT
        ],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://www.eclipse.org/legal/epl-2.0/'
      },

      // Creative Commons Licenses
      {
        spdxId: 'CC0-1.0',
        name: 'Creative Commons Zero v1.0 Universal',
        category: LicenseCategory.PUBLIC_DOMAIN,
        osiApproved: false,
        fsfApproved: true,
        obligations: [],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://creativecommons.org/publicdomain/zero/1.0/'
      },
      {
        spdxId: 'CC-BY-4.0',
        name: 'Creative Commons Attribution 4.0 International',
        category: LicenseCategory.PERMISSIVE,
        osiApproved: false,
        fsfApproved: false,
        obligations: [ObligationType.ATTRIBUTION],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://creativecommons.org/licenses/by/4.0/'
      },
      {
        spdxId: 'CC-BY-SA-4.0',
        name: 'Creative Commons Attribution Share Alike 4.0 International',
        category: LicenseCategory.COPYLEFT,
        osiApproved: false,
        fsfApproved: false,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.SHARE_ALIKE],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://creativecommons.org/licenses/by-sa/4.0/'
      },
      {
        spdxId: 'CC-BY-NC-4.0',
        name: 'Creative Commons Attribution Non Commercial 4.0 International',
        category: LicenseCategory.CUSTOM,
        osiApproved: false,
        fsfApproved: false,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.NO_COMMERCIAL_USE],
        allowsCommercialUse: false,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://creativecommons.org/licenses/by-nc/4.0/'
      },

      // Proprietary/Commercial Licenses
      {
        spdxId: 'UNLICENSED',
        name: 'No License (All Rights Reserved)',
        category: LicenseCategory.PROPRIETARY,
        osiApproved: false,
        fsfApproved: false,
        obligations: [],
        allowsCommercialUse: false,
        allowsModifications: false,
        allowsDistribution: false,
        requiresSourceDisclosure: false
      },

      // Other Important Licenses
      {
        spdxId: 'Unlicense',
        name: 'The Unlicense',
        category: LicenseCategory.PUBLIC_DOMAIN,
        osiApproved: true,
        fsfApproved: true,
        obligations: [],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://unlicense.org/'
      },
      {
        spdxId: 'WTFPL',
        name: 'Do What The F*ck You Want To Public License',
        category: LicenseCategory.PUBLIC_DOMAIN,
        osiApproved: false,
        fsfApproved: true,
        obligations: [],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'http://www.wtfpl.net/'
      },
      {
        spdxId: 'Zlib',
        name: 'zlib License',
        category: LicenseCategory.PERMISSIVE,
        osiApproved: true,
        fsfApproved: true,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.NOTICE_PRESERVATION],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: false,
        url: 'https://opensource.org/licenses/Zlib'
      },
      {
        spdxId: 'Artistic-2.0',
        name: 'Artistic License 2.0',
        category: LicenseCategory.WEAK_COPYLEFT,
        osiApproved: true,
        fsfApproved: true,
        obligations: [ObligationType.ATTRIBUTION, ObligationType.DISCLOSE_SOURCE],
        allowsCommercialUse: true,
        allowsModifications: true,
        allowsDistribution: true,
        requiresSourceDisclosure: true,
        url: 'https://opensource.org/licenses/Artistic-2.0'
      }
    ];

    // Add licenses to the map
    for (const license of licenses) {
      this.licenses.set(license.spdxId, license);
    }
  }

  /**
   * Initialize license aliases for common variations
   */
  private initializeAliases(): void {
    const aliases: Record<string, string> = {
      // MIT variations
      'mit': 'MIT',
      'mit license': 'MIT',
      'expat': 'MIT',

      // Apache variations
      'apache': 'Apache-2.0',
      'apache-2': 'Apache-2.0',
      'apache 2.0': 'Apache-2.0',
      'apache license 2.0': 'Apache-2.0',
      'asl-2.0': 'Apache-2.0',

      // BSD variations
      'bsd': 'BSD-3-Clause',
      'bsd-3': 'BSD-3-Clause',
      'bsd-2': 'BSD-2-Clause',
      'bsd 3-clause': 'BSD-3-Clause',
      'bsd 2-clause': 'BSD-2-Clause',
      'new bsd': 'BSD-3-Clause',
      'simplified bsd': 'BSD-2-Clause',

      // GPL variations
      'gpl': 'GPL-3.0-only',
      'gpl-3': 'GPL-3.0-only',
      'gpl-2': 'GPL-2.0-only',
      'gpl3': 'GPL-3.0-only',
      'gpl2': 'GPL-2.0-only',
      'gnu gpl': 'GPL-3.0-only',
      'gnu gpl v3': 'GPL-3.0-only',
      'gnu gpl v2': 'GPL-2.0-only',

      // LGPL variations
      'lgpl': 'LGPL-3.0-only',
      'lgpl-3': 'LGPL-3.0-only',
      'lgpl-2.1': 'LGPL-2.1-only',
      'lgpl3': 'LGPL-3.0-only',
      'lgpl2.1': 'LGPL-2.1-only',
      'lesser gpl': 'LGPL-3.0-only',

      // AGPL variations
      'agpl': 'AGPL-3.0-only',
      'agpl-3': 'AGPL-3.0-only',
      'affero gpl': 'AGPL-3.0-only',

      // MPL variations
      'mpl': 'MPL-2.0',
      'mozilla': 'MPL-2.0',
      'mozilla public license': 'MPL-2.0',

      // EPL variations
      'epl': 'EPL-2.0',
      'eclipse': 'EPL-2.0',
      'eclipse public license': 'EPL-2.0',

      // ISC variations
      'isc license': 'ISC',

      // Creative Commons variations
      'cc0': 'CC0-1.0',
      'public domain': 'CC0-1.0',
      'cc-by': 'CC-BY-4.0',
      'cc-by-sa': 'CC-BY-SA-4.0',
      'cc-by-nc': 'CC-BY-NC-4.0',
      'creative commons': 'CC-BY-4.0',

      // Other variations
      'unlicense': 'Unlicense',
      'wtfpl': 'WTFPL',
      'zlib': 'Zlib',
      'artistic': 'Artistic-2.0',
      'artistic license': 'Artistic-2.0',

      // Proprietary variations
      'proprietary': 'UNLICENSED',
      'all rights reserved': 'UNLICENSED',
      'copyright': 'UNLICENSED',
      'no license': 'UNLICENSED'
    };

    for (const [alias, canonical] of Object.entries(aliases)) {
      this.aliasMap.set(alias.toLowerCase(), canonical);
    }
  }
}

/**
 * Get the singleton license database instance
 */
export function getLicenseDatabase(): LicenseDatabase {
  return LicenseDatabase.getInstance();
}
