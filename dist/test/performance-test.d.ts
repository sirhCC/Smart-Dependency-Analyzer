/**
 * Performance Engine Integration Test
 * Test the enterprise-grade performance optimization components
 */
declare function runPerformanceTest(): Promise<{
    success: boolean;
    totalTime: number;
    packagesPerSecond: number;
    targetMet: boolean;
    error?: never;
} | {
    success: boolean;
    error: string;
    totalTime?: never;
    packagesPerSecond?: never;
    targetMet?: never;
}>;
export { runPerformanceTest };
//# sourceMappingURL=performance-test.d.ts.map