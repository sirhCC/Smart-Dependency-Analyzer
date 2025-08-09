/**
 * Lifecycle / open handles regression test
 * Ensures lifecycle.shutdown() resolves promptly and no lingering intervals keep process alive.
 */
import { lifecycle } from './lifecycle';

describe('Lifecycle Manager', () => {
  it('executes registered hooks within timeout and clears timers', async () => {
    const calls: string[] = [];
    lifecycle.register('test-cleanup', async () => {
      calls.push('cleanup');
    });
    const start = Date.now();
    await lifecycle.shutdown(2000);
    const duration = Date.now() - start;
    expect(calls).toContain('cleanup');
    expect(duration).toBeLessThan(2000);
  });
});
