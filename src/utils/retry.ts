/**
 * Retry utility with exponential backoff and jitter
 * Provides resilient HTTP request handling with configurable retry strategies
 */

import { getLogger } from "./logger";
import {
  RateLimitError,
  TimeoutError,
  NetworkError,
  CircuitOpenError,
} from "./errors";

const logger = getLogger("Retry");

export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial backoff delay in milliseconds */
  initialDelayMs?: number;
  /** Maximum backoff delay in milliseconds */
  maxDelayMs?: number;
  /** Backoff multiplier for exponential backoff */
  backoffMultiplier?: number;
  /** Enable random jitter to prevent thundering herd */
  enableJitter?: boolean;
  /** Timeout for each attempt in milliseconds */
  timeoutMs?: number;
  /** Function to determine if error is retryable */
  isRetryable?: (error: Error) => boolean;
  /** Callback on retry attempt */
  onRetry?: (attempt: number, delay: number, error: Error) => void;
}

export interface RetryResult<T> {
  /** Result of successful operation */
  result: T;
  /** Number of attempts made */
  attempts: number;
  /** Total time taken including retries */
  totalTimeMs: number;
  /** Whether any retries were performed */
  hadRetries: boolean;
}

/**
 * Default retry configuration
 */
const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 250,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
  enableJitter: true,
  timeoutMs: 30000,
  isRetryable: isDefaultRetryable,
  onRetry: () => {},
};

/**
 * Default logic for determining if an error is retryable
 */
function isDefaultRetryable(error: Error): boolean {
  // Rate limits are retryable
  if (error instanceof RateLimitError) return true;

  // Network errors are retryable
  if (error instanceof NetworkError) return true;

  // Timeouts are retryable
  if (error instanceof TimeoutError) return true;

  // Circuit open is not retryable (already handled by circuit breaker)
  if (error instanceof CircuitOpenError) return false;

  // 5xx server errors are retryable
  if ("code" in error && typeof error.code === "string") {
    if (error.code === "HTTP_5XX") return true;
    if (error.code === "NETWORK") return true;
  }

  // ECONNRESET, ETIMEDOUT, etc.
  if ("code" in error) {
    const code = String(error.code);
    if (code.startsWith("E")) return true;
  }

  return false;
}

/**
 * Calculate backoff delay with exponential backoff and optional jitter
 */
function calculateBackoff(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number,
  enableJitter: boolean,
): number {
  // Exponential backoff: delay = initialDelay * (multiplier ^ attempt)
  const exponentialDelay =
    initialDelayMs * Math.pow(backoffMultiplier, attempt);

  // Cap at max delay
  let delay = Math.min(exponentialDelay, maxDelayMs);

  // Add jitter to prevent thundering herd
  if (enableJitter) {
    // Random jitter between 0 and delay
    const jitter = Math.random() * delay;
    delay = jitter;
  }

  return Math.floor(delay);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 *
 * @example
 * ```typescript
 * const result = await retry(
 *   async () => fetch('https://api.example.com/data'),
 *   { maxRetries: 3, initialDelayMs: 500 }
 * );
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<RetryResult<T>> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = Date.now();
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      // Wrap in timeout if specified
      const result = opts.timeoutMs
        ? await withTimeout(fn(), opts.timeoutMs)
        : await fn();

      const totalTimeMs = Date.now() - startTime;

      if (attempt > 0) {
        logger.info(
          `✅ Retry succeeded on attempt ${attempt + 1}/${opts.maxRetries + 1} after ${totalTimeMs}ms`,
        );
      }

      return {
        result,
        attempts: attempt + 1,
        totalTimeMs,
        hadRetries: attempt > 0,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      const isLastAttempt = attempt === opts.maxRetries;
      const shouldRetry = !isLastAttempt && opts.isRetryable(lastError);

      if (!shouldRetry) {
        logger.warn(
          `❌ Retry exhausted or non-retryable error after ${attempt + 1} attempts:`,
          lastError,
        );
        throw lastError;
      }

      // Calculate delay with exponential backoff
      let delay = calculateBackoff(
        attempt,
        opts.initialDelayMs,
        opts.maxDelayMs,
        opts.backoffMultiplier,
        opts.enableJitter,
      );

      // Honor rate limit retry-after if present
      if (lastError instanceof RateLimitError && lastError.retryAfterMs) {
        delay = Math.max(delay, lastError.retryAfterMs);
      }

      logger.info(
        `🔄 Retrying after ${delay}ms (attempt ${attempt + 1}/${opts.maxRetries + 1}): ${lastError.message}`,
      );

      opts.onRetry(attempt + 1, delay, lastError);

      await sleep(delay);
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error("Retry failed with unknown error");
}

/**
 * Wrap a promise with a timeout
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

/**
 * Retry decorator for class methods
 *
 * @example
 * ```typescript
 * class ApiClient {
 *   @retryable({ maxRetries: 3 })
 *   async fetchData(): Promise<Data> {
 *     return fetch('/api/data').then(r => r.json());
 *   }
 * }
 * ```
 */
export function retryable(options: RetryOptions = {}) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await retry(
        () => originalMethod.apply(this, args),
        options,
      );
      return result.result;
    };

    return descriptor;
  };
}

/**
 * Create a retry-enabled fetch function
 *
 * @example
 * ```typescript
 * const resilientFetch = createRetryableFetch({ maxRetries: 3 });
 * const response = await resilientFetch('https://api.example.com/data');
 * ```
 */
export function createRetryableFetch(options: RetryOptions = {}) {
  return async (url: string, init?: RequestInit): Promise<Response> => {
    const result = await retry(() => fetch(url, init), {
      ...options,
      isRetryable: (error) => {
        // Custom retry logic for fetch responses
        if (options.isRetryable && options.isRetryable(error)) {
          return true;
        }
        return isDefaultRetryable(error);
      },
    });
    return result.result;
  };
}
