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
});

export type AnalyzeOptions = z.infer<typeof AnalyzeOptionsSchema>;

export const LicenseOptionsSchema = z.object({
  format: z.enum(['text', 'html', 'markdown', 'json']).default('text'),
  output: z.string().min(1).optional(),
  groupByLicense: z.boolean().default(false),
  includeTexts: z.boolean().default(false),
});

export type LicenseOptions = z.infer<typeof LicenseOptionsSchema>;
