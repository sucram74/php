import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm --workspace @apps/backend run start',
      port: 3001,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'npm --workspace @apps/frontend run start',
      port: 3000,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
