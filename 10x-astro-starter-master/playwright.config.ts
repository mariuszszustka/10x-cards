import { defineConfig, devices } from '@playwright/test';

/**
 * Konfiguracja dla testów E2E z Playwright
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : [['html'], ['list']],
  use: {
    // Bazowy URL dla wszystkich nawigacji
    baseURL: 'http://localhost:4321',
    
    // Przechwytywanie trace'ów dla przeglądarki tylko przy niepowodzeniu
    trace: 'on-first-retry',
    
    // Automatyczne wykonywanie zrzutów ekranu przy błędach
    screenshot: 'only-on-failure',
  },
  
  // Konfiguracja projektów (tylko Chromium zgodnie z wytycznymi)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // Lokalny serwer uruchamiany przed testami
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
}); 