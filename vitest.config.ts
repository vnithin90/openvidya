import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Needed so figure tests can render components to static markup and check the
  // geometry they actually emit, rather than the geometry they were written to.
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    testTimeout: 60_000, // the Gauss's law surface integrals are deliberately dense
  },
});
