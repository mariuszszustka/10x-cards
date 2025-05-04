import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

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
  testDir: './tests/e2e',
  // Maksymalny czas wykonania pojedynczego testu
  timeout: 30 * 1000,
  // Oczekuj na zakończenie testów przed zamknięciem
  expect: {
    timeout: 5000
  },
  // Nie uruchamiaj testów równolegle, by uniknąć konfliktów w bazie danych
  fullyParallel: false,
  // Liczba powtórzeń w przypadku niestabilnego testu
  retries: process.env.CI ? 2 : 0,
  // Nie uruchamiaj testów równolegle przez pracowników, ponieważ mają współdzielony stan bazy
  workers: process.env.CI ? 1 : undefined,
  // Reporter do wyświetlania wyników testów
  reporter: 'html',
  // Konfiguracje dla każdej przeglądarki
  use: {
    // Bazowy URL aplikacji
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    // Przechwytuj zrzuty ekranu w przypadku niepowodzenia
    screenshot: 'only-on-failure',
    // Nagrywaj filmy z przebiegu testów w przypadku niepowodzenia
    video: 'on-first-retry',
    // Rejestruj ślad wykonania testu (trace)
    trace: 'on-first-retry',
    // Dodawaj znaczniki czasowe do logów
    actionTimeout: 0,
  },

  // Konfiguracje projektów testowych
  projects: [
    // Projekt konfiguracyjny dla przygotowania bazy danych
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup db',
    },
    // Projekt czyszczący bazę danych po wszystkich testach
    {
      name: 'cleanup db',
      testMatch: /global\.teardown\.ts/,
    },
    // Projekt dla Chromium z zależnością od konfiguracji bazy
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup db'],
    },
    // Projekt dla Firefox z zależnością od konfiguracji bazy
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup db'],
    },
    // Projekt dla WebKit z zależnością od konfiguracji bazy
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
      dependencies: ['setup db'],
    },
    // Projekt dla urządzeń mobilnych z zależnością od konfiguracji bazy
    {
      name: 'mobile chrome',
      use: { 
        ...devices['Pixel 5'],
      },
      dependencies: ['setup db'],
    },
    {
      name: 'mobile safari',
      use: {
        ...devices['iPhone 12'],
      },
      dependencies: ['setup db'],
    },
  ],

  // Konfiguracja serwera do testów
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // Zawsze używaj istniejącego serwera, jeśli jest dostępny
    timeout: 120 * 1000,
  },
}); 