import { promises as fs } from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { parse as parseYAML } from 'yaml';
import type { LicenseAnalysis } from '../types/license';
import type { VulnerabilityScanResult, Vulnerability } from '../types';
import { logger as baseLogger } from './logger';

const logger = baseLogger.child({ component: 'Policy' });

const SeverityLevels = ['low', 'medium', 'high', 'critical'] as const;
export type Severity = typeof SeverityLevels[number];

export const PolicySchema = z.object({
  disallowedLicenses: z.array(z.string()).optional().default([]),
  maxSeverity: z.enum(SeverityLevels).optional().default('critical'),
  failOnPolicyViolation: z.boolean().optional().default(false),
});

export type Policy = z.infer<typeof PolicySchema>;

export interface PolicyEvaluationInput {
  vulnerabilityResults?: VulnerabilityScanResult | null;
  licenseAnalyses?: LicenseAnalysis[] | null;
}

export interface PolicyEvaluationResult {
  violations: string[];
  hasViolations: boolean;
}

const severityRank: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export async function loadPolicy(filePath: string): Promise<Policy> {
  const content = await fs.readFile(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();
  let raw: unknown;
  try {
  if (ext === '.yaml' || ext === '.yml') raw = parseYAML(content);
    else raw = JSON.parse(content);
  } catch (err) {
    logger.error('Failed to parse policy file', { filePath, err });
    throw new Error(`Invalid policy file: ${filePath}`);
  }

  const parsed = PolicySchema.safeParse(raw);
  if (!parsed.success) {
    logger.error('Policy validation failed', { issues: parsed.error.issues });
    throw new Error(`Policy validation failed: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function evaluatePolicy(
  policy: Policy,
  input: PolicyEvaluationInput
): PolicyEvaluationResult {
  const violations: string[] = [];

  // License policy
  const analyses = input.licenseAnalyses ?? [];
  if (analyses.length > 0 && policy.disallowedLicenses.length > 0) {
    for (const analysis of analyses) {
      for (const lic of analysis.licenses) {
        if (policy.disallowedLicenses.includes(lic.spdxId)) {
          violations.push(
            `Disallowed license ${lic.spdxId} found in ${analysis.package.name}@${analysis.package.version}`
          );
        }
      }
    }
  }

  // Vulnerability severity policy
  const vres = input.vulnerabilityResults;
  if (vres && vres.reports) {
    const maxAllowed = severityRank[policy.maxSeverity];
    const allVulns: Vulnerability[] = vres.reports.flatMap(r => r.vulnerabilities);
    for (const v of allVulns) {
      const sev = (v.severity as Severity) ?? 'low';
      if (severityRank[sev] > maxAllowed) {
        violations.push(`Vulnerability ${v.id ?? v.cveId ?? 'unknown'} severity ${sev} exceeds max ${policy.maxSeverity}`);
      }
    }
  }

  return { violations, hasViolations: violations.length > 0 };
}
