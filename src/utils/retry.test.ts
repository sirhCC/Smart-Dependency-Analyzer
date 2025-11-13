/**
 * Retry utility tests
 * Tests exponential backoff, jitter, and retry logic
 */

import { retry, createRetryableFetch } from "./retry";
import { RateLimitError, TimeoutError, NetworkError } from "./errors";

describe("Retry Utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("retry function", () => {
    it("should succeed on first attempt", async () => {
      const fn = jest.fn().mockResolvedValue("success");

      const result = await retry(fn, { maxRetries: 3 });

      expect(result.result).toBe("success");
      expect(result.attempts).toBe(1);
      expect(result.hadRetries).toBe(false);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on retryable errors", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError("Connection failed"))
        .mockRejectedValueOnce(new TimeoutError("Request timeout"))
        .mockResolvedValue("success");

      const result = await retry(fn, {
        maxRetries: 3,
        initialDelayMs: 10,
        enableJitter: false,
      });

      expect(result.result).toBe("success");
      expect(result.attempts).toBe(3);
      expect(result.hadRetries).toBe(true);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should honor rate limit retry-after", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new RateLimitError("Rate limited", 500))
        .mockResolvedValue("success");

      const startTime = Date.now();
      const result = await retry(fn, {
        maxRetries: 3,
        initialDelayMs: 10,
        enableJitter: false,
      });
      const elapsed = Date.now() - startTime;

      expect(result.result).toBe("success");
      expect(result.attempts).toBe(2);
      expect(result.hadRetries).toBe(true);
      expect(elapsed).toBeGreaterThanOrEqual(500);
    });

    it("should throw after max retries exhausted", async () => {
      const error = new NetworkError("Persistent failure");
      const fn = jest.fn().mockRejectedValue(error);

      await expect(
        retry(fn, { maxRetries: 2, initialDelayMs: 10 }),
      ).rejects.toThrow("Persistent failure");

      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it("should not retry non-retryable errors", async () => {
      const error = new Error("Non-retryable error");
      const fn = jest.fn().mockRejectedValue(error);

      await expect(
        retry(fn, {
          maxRetries: 3,
          isRetryable: () => false,
        }),
      ).rejects.toThrow("Non-retryable error");

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should apply exponential backoff", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError())
        .mockRejectedValueOnce(new NetworkError())
        .mockResolvedValue("success");

      const delays: number[] = [];
      const onRetry = jest.fn((_attempt: number, delay: number) => {
        delays.push(delay);
      });

      await retry(fn, {
        maxRetries: 3,
        initialDelayMs: 100,
        backoffMultiplier: 2,
        enableJitter: false,
        onRetry,
      });

      expect(delays).toHaveLength(2);
      expect(delays[0]).toBe(100);
      expect(delays[1]).toBe(200);
    });

    it("should cap backoff at max delay", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError())
        .mockRejectedValueOnce(new NetworkError())
        .mockResolvedValue("success");

      const delays: number[] = [];
      const onRetry = jest.fn((_attempt: number, delay: number) => {
        delays.push(delay);
      });

      await retry(fn, {
        maxRetries: 3,
        initialDelayMs: 1000,
        maxDelayMs: 1500,
        backoffMultiplier: 2,
        enableJitter: false,
        onRetry,
      });

      expect(delays).toHaveLength(2);
      expect(delays[0]).toBe(1000);
      expect(delays[1]).toBe(1500); // capped at maxDelayMs
    });

    it("should apply jitter when enabled", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError())
        .mockResolvedValue("success");

      const delays: number[] = [];
      const onRetry = jest.fn((_attempt: number, delay: number) => {
        delays.push(delay);
      });

      await retry(fn, {
        maxRetries: 2,
        initialDelayMs: 100,
        enableJitter: true,
        onRetry,
      });

      expect(delays).toHaveLength(1);
      // With jitter, delay should be between 0 and 100
      expect(delays[0]).toBeGreaterThanOrEqual(0);
      expect(delays[0]).toBeLessThanOrEqual(100);
    });

    it("should timeout long-running operations", async () => {
      const fn = jest
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 1000)),
        );

      await expect(
        retry(fn, {
          maxRetries: 0,
          timeoutMs: 100,
        }),
      ).rejects.toThrow(/timed out/i);
    });

    it("should call onRetry callback", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError("Failure 1"))
        .mockResolvedValue("success");

      const onRetry = jest.fn();

      await retry(fn, {
        maxRetries: 2,
        initialDelayMs: 10,
        enableJitter: false,
        onRetry,
      });

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(
        1,
        10,
        expect.objectContaining({ message: "Failure 1" }),
      );
    });
  });

  describe("createRetryableFetch", () => {
    it("should create a fetch function with retry logic", async () => {
      const mockFetch = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError())
        .mockResolvedValue({ ok: true, json: async () => ({ data: "test" }) });

      global.fetch = mockFetch as any;

      const retryableFetch = createRetryableFetch({
        maxRetries: 2,
        initialDelayMs: 10,
      });

      const response = await retryableFetch("https://api.example.com/data");

      expect(response.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("error type detection", () => {
    it("should retry on rate limit errors", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new RateLimitError())
        .mockResolvedValue("success");

      const result = await retry(fn, {
        maxRetries: 1,
        initialDelayMs: 10,
      });

      expect(result.result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should retry on network errors", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError())
        .mockResolvedValue("success");

      const result = await retry(fn, {
        maxRetries: 1,
        initialDelayMs: 10,
      });

      expect(result.result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should retry on timeout errors", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new TimeoutError())
        .mockResolvedValue("success");

      const result = await retry(fn, {
        maxRetries: 1,
        initialDelayMs: 10,
      });

      expect(result.result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
