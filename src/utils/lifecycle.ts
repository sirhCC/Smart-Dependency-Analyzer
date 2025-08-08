/**
 * Lifecycle Manager
 * Centralized registration and graceful shutdown of resources (timers, clients, caches).
 */

import { logger as baseLogger } from './logger';

type CleanupFn = () => void | Promise<void>;

interface RegisteredHook {
  name: string;
  cleanup: CleanupFn;
}

class LifecycleManager {
  private hooks: RegisteredHook[] = [];
  private shuttingDown = false;
  private signalsHooked = false;

  register(name: string, cleanup: CleanupFn): void {
    this.hooks.push({ name, cleanup });
  }

  /**
   * Run all registered cleanup hooks with a timeout per hook.
   */
  async shutdown(timeoutMs = 5000): Promise<void> {
    if (this.shuttingDown) return;
    this.shuttingDown = true;

    const logger = baseLogger.child({ component: 'Lifecycle' });
    logger.info('🛑 Initiating graceful shutdown');

    const results = await Promise.all(
      this.hooks.map(async ({ name, cleanup }) => {
        const start = Date.now();
        try {
          await Promise.race([
            Promise.resolve().then(cleanup),
            new Promise<void>((_, reject) => {
              const t = setTimeout(() => reject(new Error(`Timeout in ${name}`)), timeoutMs);
              if (typeof (t as any).unref === 'function') (t as any).unref();
            }),
          ]);
          return { name, ok: true, ms: Date.now() - start } as const;
        } catch (error) {
          logger.warn(`⚠️  Cleanup failed for ${name}`, { error });
          return { name, ok: false, ms: Date.now() - start } as const;
        }
      })
    );

    const ok = results.filter(r => r.ok).length;
    const total = results.length;
    logger.info(`✅ Shutdown complete: ${ok}/${total} hooks executed`);
  }

  /**
   * Attach process signal handlers once.
   */
  hookProcessSignals(): void {
    if (this.signalsHooked) return;
    this.signalsHooked = true;
    const logger = baseLogger.child({ component: 'Lifecycle' });

    const handle = async (signal: NodeJS.Signals) => {
      logger.info(`📴 Received ${signal}, shutting down...`);
      try {
        await this.shutdown();
      } finally {
        process.exit(0);
      }
    };

    process.once('SIGINT', handle);
    process.once('SIGTERM', handle);

    process.on('uncaughtException', async (err) => {
      logger.error('Uncaught exception', { err });
      await this.shutdown();
      process.exit(1);
    });

    process.on('unhandledRejection', async (reason) => {
      logger.error('Unhandled rejection', { reason });
      await this.shutdown();
      process.exit(1);
    });
  }
}

export const lifecycle = new LifecycleManager();
export type { CleanupFn };
