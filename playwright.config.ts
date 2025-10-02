import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 128, height: 128 },
    colorScheme: 'light',
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npm run build && vite preview --strictPort --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});


