import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@application': path.resolve(__dirname, './src/application'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@di': path.resolve(__dirname, './src/di'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@bicipop/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.test.ts'],
    testTimeout: 30000,
    pool: 'forks',
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
    isolate: true,
  },
});
