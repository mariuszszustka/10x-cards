import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// Utworzenie katalogów tymczasowych, jeśli nie istnieją
const tmpDir = path.resolve(process.cwd(), 'tmp');
const screenshotsDir = path.resolve(tmpDir, 'test-screenshots');
const videosDir = path.resolve(tmpDir, 'test-videos');

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Wczytanie zmiennych środowiskowych z pliku .env.test
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
  console.log('Załadowano zmienne środowiskowe z .env.test');
} catch (error) {
  console.error('Błąd podczas ładowania pliku .env.test:', error);
}

/**
 * Konfiguracja Playwright dla testów E2E aplikacji 10x-cards
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/tests/e2e',
  // Maksymalny czas wykonania pojedynczego testu
  timeout: 90 * 1000,
  // Oczekuj na zakończenie testów przed zamknięciem
  expect: {
    timeout: 15000
  },
  // Nie uruchamiaj testów równolegle, by uniknąć konfliktów w bazie danych
  fullyParallel: false,
  // Liczba powtórzeń w przypadku niestabilnego testu
  retries: process.env.CI ? 2 : 2,
  // Nie uruchamiaj testów równolegle przez pracowników, ponieważ mają współdzielony stan bazy
  workers: 1,
  // Reporter do wyświetlania wyników testów
  reporter: [['html', { open: 'never' }], ['list']],
  // Konfiguracje dla każdej przeglądarki
  use: {
    // Bazowy URL aplikacji
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    // Przechwytuj zrzuty ekranu zawsze
    screenshot: 'on',
    // Nagrywaj filmy z przebiegu testów zawsze
    video: 'on',
    // Rejestruj ślad wykonania testu (trace)
    trace: 'on',
    // Dodawaj znaczniki czasowe do logów
    actionTimeout: 20000,
    navigationTimeout: 40000,
    // Dodatkowe opcje konfiguracyjne
    launchOptions: {
      slowMo: 100,
    },
  },

  // Konfiguracje projektów testowych
  projects: [
    // Projekt konfiguracji bazy danych do testów
    {
      name: 'setup db',
      testMatch: '**/global.setup.ts',
    },
    // Projekt dla Google Chrome z zależnością od konfiguracji bazy
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup db']
    },
  ],

  // Modyfikuję konfigurację webServer, aby wykorzystać istniejący serwer
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 180 * 1000,
    reuseExistingServer: true,
  },
  
  // Konfiguracja katalogów wyjściowych
  outputDir: './tmp/test-results',
}); 