# Smart Dependency Analyzer – Prioritized Improvements

This document lists concrete improvements by priority to enhance code quality, security, performance, DX, and scalability. Items are grouped by P0 (highest) → P3 (nice-to-have). Each item includes rationale and suggested action(s).

## P0 – Critical quality, security, and correctness

- Harden background timers and lifecycle further
  - Rationale: We unref()’d timers to stop test leaks; production should also guarantee clean shutdowns.
  - Actions:
    - [ ] Ensure every service with timers exposes `start()`/`stop()`
    - [x] Call `stop()`/cleanup on process signals (SIGINT/SIGTERM) in CLI
    - [x] Add a lightweight lifecycle orchestrator to tear down `AIEngine`, `CacheManager`, network clients, and file handles
    - [ ] Add an automated Jest test with `--detectOpenHandles` to guard against regressions

- Input validation and config schema
  - Rationale: Enterprise security model requires strict user input/config parsing.
  - Actions:
    - [x] Introduce Zod schemas (policy file validation)
  - [x] Extend schemas to CLI options, file paths, and service configs (scanner, license, discovery)
    - [x] Validate before execution; provide actionable error messages (policy load)

- Robust error boundaries and retries for integrations
  - Rationale: External APIs (e.g., GitHub Advisory) can fail or rate-limit.
  - Actions:
  - [x] Wrap GitHub Advisory source with circuit breaker + retry (exponential backoff, jitter); cap total time by existing timeout
  - [x] Normalize errors into typed domain errors; log with correlation IDs

- Security policy enforcement (baseline)
  - Rationale: Enforce organization policies consistently.
  - Actions:
    - [x] Add policy module to fail/flag on disallowed licenses
    - [x] Enforce vulnerable severities over threshold
  - [x] Flag unknown publishers
    - [x] Add `--policy <file>` CLI flag; load YAML/JSON policy and validate findings

## P1 – Performance and scalability

- Concurrency and backpressure controls
  - Rationale: Safe parallelism for 10k+ packages.
  - Actions:
  - [x] Add bounded concurrency for package vulnerability scanning (initial implementation with global limiter)
  - [ ] Add per-data-source concurrency pools (API-specific throttling)
  - [ ] Add phase-specific limits (discovery vs scan vs AI prediction)
  - [ ] Queue large scans; surface progress + ETA

- Intelligent caching enhancements
  - Rationale: Further reduce duplicate work and memory.
  - Actions:
    - [ ] Separate in-memory vs. persistent cache (L2) with TTL + size limits; optional disk or Redis backend
    - [ ] Add cache key versioning and namespace per model version
    - [ ] Add cache hit/miss metrics export (Prometheus-friendly)

- Streaming and incremental output
  - Rationale: Reduce latency for large repos.
  - Actions:
    - [ ] Stream analysis results (Ndjson/JSONL) and progressive CLI updates
    - [ ] Provide `--output stream|jsonl` for consumers

- Efficient graph operations
  - Rationale: Package graphs can be large.
  - Actions:
    - [ ] Use adjacency lists with typed nodes/edges and iterative algorithms to keep memory sublinear
    - [ ] Memoize repeated subgraph traversals

## P2 – Developer experience, testing, and maintainability

- 100% test coverage and quality gates tightening
  - Rationale: Align with project standards file.
  - Actions:
    - [ ] Add unit tests for CLI command handlers and error paths
    - [ ] Add integration tests for multi-source vulnerability aggregation and license conflict resolution
    - [ ] Add performance tests asserting P50/P95 latency targets

- Strict types and domain models
  - Rationale: Fewer runtime bugs.
  - Actions:
    - [ ] Introduce richer domain types for Vulnerability, Package, License, Policy
    - [ ] Prefer readonly and exact object shapes; enable `noPropertyAccessFromIndexSignature` if viable

- Dependency injection and factories
  - Rationale: Swap implementations and improve testability.
  - Actions:
    - [ ] Add a minimal IoC container (e.g., tsyringe) and factories for engines/data sources
    - [ ] Wire CLI via DI to pass mocks in tests

- Logging improvements
  - Rationale: Better observability.
  - Actions:
    - [ ] Add structured request/scan IDs and span timing; expose log level via CLI `--log-level`
    - [ ] Make console pretty transport optional with pino-pretty in dev only

- Configuration management
  - Rationale: Consistent settings across environments.
  - Actions:
    - [ ] Add `src/config/default.ts` + environment overlays; validate via schema
    - [ ] Support env vars and config file precedence order

## P3 – Features and polish

- Rich report generation
  - Actions:
  - [ ] Add HTML/Markdown reports with charts; include SBOM export (CycloneDX/SPDX JSON)

- More security intelligence sources
  - Actions:
  - [ ] Add OSV, NVD, Snyk integrations behind feature flags; unify via a `SecurityDataSource` adapter with normalization

- License intelligence depth
  - Actions:
  - [ ] Add SPDX expression parsing and resolution; heuristics for dual-licenses; curated license risk metadata

- CLI UX
  - Actions:
  - [ ] Add `--ci` mode (non-interactive, machine-readable output and nonzero exit codes on thresholds)
  - [ ] Add progress bars and concise summaries; `--silent` for logs

---

## Quick wins (low risk)

- [x] Unify and expose a `shutdown()` in CLI to call `destroy()` on engines and caches on exit signals
- [x] Add `--log-level` and `--silent` flags; thread through to `Logger`
- [ ] Cache key namespaces based on model version to prevent stale predictions reuse
- [x] Add `npm run test:detect` shortcut that runs Jest with `--detectOpenHandles`
- [x] Add publisher policy edge‑case unit tests (names/domains, absence, case-insensitive)

## Longer-term initiatives

- Persistent caching layer (Redis/disk) with cache warming in CI for popular packages.
- Full DI refactor for core services and data sources.
- Telemetry: Prometheus metrics exporter for analysis timings, cache stats, and error rates.
- Performance budget checks in CI with thresholds (P50/P95/Max).
