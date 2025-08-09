# Smart Dependency Analyzer (SDA)

![npm](https://img.shields.io/npm/v/@sirhcc/smart-dependency-analyzer?color=blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A518-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

AI-powered dependency security, license intelligence, and blazing-fast analysis—built for enterprise scale.

- 94%+ attack vector coverage across 12 categories
- Sub-100ms core operations, optimized for 10k+ packages
- Clean CLI and policy enforcement for CI/CD

---

## Features

- AI Security Intelligence: Unicode homographs, supply chain injection, brand jacking, typosquatting, and more
- Vulnerability scanning: Multi-source aggregation with risk scoring and recommendations
- License Intelligence: SPDX detection, compatibility analysis, legal risk assessment, compliance docs
- Performance: Intelligent caching, parallel processing, optimized graph analysis
- CI-ready: Policy enforcement (severity thresholds, disallowed licenses) and nonzero exit on violations

---

## Quick Start

Install globally or run via npx.

```bash
# Global install
npm install -g @sirhcc/smart-dependency-analyzer

# Or use directly
npx @sirhcc/smart-dependency-analyzer --help
```

Analyze a project:

```bash
sda analyze
```

Generate license compliance:

```bash
sda license --format html --output compliance.html
```

---

## CLI Reference

### analyze

```bash
sda analyze [path]

Options:
  --output <format>       json | table | html (default: table)
  --include-dev           include devDependencies
  --severity <level>      low | medium | high | critical (default: medium)
  --licenses              include license analysis (default: true)
  --compatibility         include license compatibility (default: true)
  --risk                  include legal risk assessment (default: true)
  --save <file>           save full results to file
  --policy <file>         apply policy (yaml/json)
  --max-concurrency <n>   limit parallel package scans (defaults to adaptive heuristic)
  --log-level <level>     set log level (silent|fatal|error|warn|info|debug|trace)
  --silent                suppress all logs (overrides log level)
```

### license

```bash
sda license [path]

Options:
  --format <format>       text | html | markdown | json (default: text)
  --output <file>         save to file
  --group-by-license      group packages by license type
  --include-texts         include full license texts
  --verbose               enable verbose logging
  --log-level <silent|fatal|error|warn|info|debug|trace> control the log level
  --silent                run in silent mode (no logs)
```

---

## Policy Enforcement

Enforce organizational rules during analysis: disallow specific licenses, cap vulnerability severity, and restrict publishers.

Example (see `config/policy.example.yaml`):

```yaml
disallowedLicenses:
  - GPL-3.0-only
  - AGPL-3.0-only
maxSeverity: high
failOnPolicyViolation: true
requireKnownPublisher: true
allowedPublisherNames:
  - Microsoft
allowedPublisherDomains:
  - microsoft.com
```

Run with a policy:

```bash
sda analyze --policy ./config/policy.example.yaml
```

In CI, fail the job when violations are found (nonzero exit code when `failOnPolicyViolation: true`).

---

## Architecture

Core layers and priorities:

- Phase 1: Package Discovery (npm, Yarn, pnpm; monorepos; dependency graph)
- Phase 2: Security Intelligence (vulnerability aggregation, risk scoring)
- Phase 3: License Intelligence (SPDX detection, compatibility, legal risk)
- Intelligence & Performance: AI heuristics, caching, parallel execution

Project structure highlights:

```text
src/
  core/            # business logic (security, license, performance)
  integrations/    # external data sources (e.g., GitHub advisory)
  cli/             # CLI entrypoint and commands
  utils/           # shared utilities (logger, lifecycle, policy)
  types/           # TypeScript definitions
```

---

## Performance Targets

- Package analysis: < 100ms
- Vulnerability scanning: < 500ms
- Report generation: < 2s
- API response times: < 100ms
- Memory: < 1GB standard ops

---

## Development

Scripts:

```bash
npm run build         # compile TS
npm test              # run tests
npm run lint          # lint sources
npm run typecheck     # strict type checking
```

Quality gates:

- TypeScript strict mode
- ESLint clean
- Jest passing tests
- Security scanning with zero high/critical issues

---

## License

MIT © Chris (@sirhCC)
