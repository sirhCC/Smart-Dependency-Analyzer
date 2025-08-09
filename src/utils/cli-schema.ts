import { z } from 'zod';

export const AnalyzeOptionsSchema = z.object({
  output: z.enum(['json', 'table', 'html']).default('table'),
  includeDev: z.boolean().default(false),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  licenses: z.boolean().default(true),
  compatibility: z.boolean().default(true),
  risk: z.boolean().default(true),
  policy: z.string().min(1).optional(),
  save: z.string().min(1).optional(),
  maxConcurrency: z.preprocess((v) => (v === undefined ? undefined : Number(v)), z.number().int().positive().max(1000).optional()),
  logLevel: z.enum(['silent', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),
  silent: z.boolean().optional(),
});

export type AnalyzeOptions = z.infer<typeof AnalyzeOptionsSchema>;

export const LicenseOptionsSchema = z.object({
  format: z.enum(['text', 'html', 'markdown', 'json']).default('text'),
  output: z.string().min(1).optional(),
  groupByLicense: z.boolean().default(false),
  includeTexts: z.boolean().default(false),
  logLevel: z.enum(['silent', 'fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),
  silent: z.boolean().optional(),
});

export type LicenseOptions = z.infer<typeof LicenseOptionsSchema>;
