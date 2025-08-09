/**
 * Typed error classes for integrations and HTTP operations
 */

export class DataSourceError extends Error {
  readonly code: string;
  constructor(message: string, code = 'DATASOURCE_ERROR') {
    super(message);
    this.name = 'DataSourceError';
    this.code = code;
  }
}

export class RateLimitError extends DataSourceError {
  readonly retryAfterMs?: number;
  constructor(message = 'Rate limited', retryAfterMs?: number) {
    super(message, 'RATE_LIMIT');
    this.name = 'RateLimitError';
    if (typeof retryAfterMs === 'number') {
      this.retryAfterMs = retryAfterMs;
    }
  }
}

export class NetworkError extends DataSourceError {
  constructor(message = 'Network error') {
    super(message, 'NETWORK');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends DataSourceError {
  constructor(message = 'Request timeout') {
    super(message, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class CircuitOpenError extends DataSourceError {
  constructor(message = 'Circuit breaker open') {
    super(message, 'CIRCUIT_OPEN');
    this.name = 'CircuitOpenError';
  }
}

export function normalizeHttpError(response: Response, url: string): DataSourceError {
  const status = response.status;
  const text = `${status} ${response.statusText}`.trim();
  if (status === 429) {
    const retryAfter = response.headers.get('retry-after');
    const ms = retryAfter ? parseInt(retryAfter, 10) * 1000 : undefined;
    return new RateLimitError(`HTTP 429 at ${url}`, ms);
  }
  if (status >= 500) return new DataSourceError(`HTTP ${text} at ${url}`, 'HTTP_5XX');
  if (status >= 400) return new DataSourceError(`HTTP ${text} at ${url}`, 'HTTP_4XX');
  return new DataSourceError(`HTTP ${text} at ${url}`);
}
