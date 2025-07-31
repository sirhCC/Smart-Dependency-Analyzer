/**
 * Core types tests
 */

import { VulnerabilitySeverity, CopyleftType, FindingType } from '../types';

describe('Core Types', () => {
  describe('VulnerabilitySeverity enum', () => {
    it('should have all expected severity levels', () => {
      expect(VulnerabilitySeverity.LOW).toBe('low');
      expect(VulnerabilitySeverity.MEDIUM).toBe('medium');
      expect(VulnerabilitySeverity.HIGH).toBe('high');
      expect(VulnerabilitySeverity.CRITICAL).toBe('critical');
    });

    it('should have exactly 4 severity levels', () => {
      const severityValues = Object.values(VulnerabilitySeverity);
      expect(severityValues).toHaveLength(4);
    });
  });

  describe('CopyleftType enum', () => {
    it('should have all expected copyleft types', () => {
      expect(CopyleftType.NONE).toBe('none');
      expect(CopyleftType.WEAK).toBe('weak');
      expect(CopyleftType.STRONG).toBe('strong');
      expect(CopyleftType.NETWORK).toBe('network');
    });

    it('should have exactly 4 copyleft types', () => {
      const copyleftValues = Object.values(CopyleftType);
      expect(copyleftValues).toHaveLength(4);
    });
  });

  describe('FindingType enum', () => {
    it('should have all expected finding types', () => {
      expect(FindingType.VULNERABILITY).toBe('vulnerability');
      expect(FindingType.LICENSE).toBe('license');
      expect(FindingType.PERFORMANCE).toBe('performance');
      expect(FindingType.SUPPLY_CHAIN).toBe('supply_chain');
      expect(FindingType.POLICY).toBe('policy');
      expect(FindingType.QUALITY).toBe('quality');
    });

    it('should have exactly 6 finding types', () => {
      const findingValues = Object.values(FindingType);
      expect(findingValues).toHaveLength(6);
    });
  });
});
