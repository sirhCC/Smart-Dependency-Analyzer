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
  requireKnownPublisher: z.boolean().optional().default(false),
  allowedPublisherNames: z.array(z.string()).optional().default([]),
  allowedPublisherDomains: z.array(z.string()).optional().default([]),
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

  // Publisher policy (based on package metadata present in vulnerability scan reports)
  if (policy.requireKnownPublisher && vres && vres.reports && vres.reports.length > 0) {
    const allowNames = new Set(policy.allowedPublisherNames.map((s) => s.toLowerCase()));
    const allowDomains = new Set(policy.allowedPublisherDomains.map((s) => s.toLowerCase()));

    for (const report of vres.reports) {
      const pkg = report.package;
      const publishers: Array<{ name?: string; email?: string }> = [];
      const author = (pkg as any).author as { name?: string; email?: string } | undefined;
      const maintainers = (pkg as any).maintainers as Array<{ name?: string; email?: string }> | undefined;
      if (author) {
        const entry: { name?: string; email?: string } = {};
        if (author.name) entry.name = author.name;
        if (author.email) entry.email = author.email;
        if (Object.keys(entry).length > 0) publishers.push(entry);
      }
      if (Array.isArray(maintainers)) {
        for (const m of maintainers) {
          const entry: { name?: string; email?: string } = {};
          if (m.name) entry.name = m.name;
          if (m.email) entry.email = m.email;
          if (Object.keys(entry).length > 0) publishers.push(entry);
        }
      }

      const hasAnyPublisher = publishers.length > 0;
      const matchesAllowed = publishers.some((p) => {
        const n = (p.name || '').toLowerCase();
        const e = (p.email || '').toLowerCase();
  const domain = e.includes('@') ? (e.split('@')[1] ?? '') : '';
        return (allowNames.size > 0 && allowNames.has(n)) || (allowDomains.size > 0 && allowDomains.has(domain));
      });

      const ok = (allowNames.size > 0 || allowDomains.size > 0) ? matchesAllowed : hasAnyPublisher;
      if (!ok) {
        violations.push(
          `Unknown or unapproved publisher for ${pkg.name}@${pkg.version} (no matching author/maintainer)`
        );
      }
    }
  }

  return { violations, hasViolations: violations.length > 0 };
}
