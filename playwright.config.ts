import { defineConfig, devices } from "@playwright/test";
import * as path from "path";
import * as dotenv from "dotenv";
import * as fs from "fs";

// Sprawdzamy platformę
const isPlatformWindows = process.env.PLATFORM === 'windows' || process.platform === 'win32';
console.log(`[Playwright Config] Wykryta platforma: ${isPlatformWindows ? 'Windows' : 'Linux/Unix'}`);

// Utworzenie katalogów tymczasowych, jeśli nie istnieją
const tmpDir = path.resolve(process.cwd(), "tmp");
const screenshotsDir = path.resolve(tmpDir, "test-screenshots");
const videosDir = path.resolve(tmpDir, "test-videos");

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
  dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
  console.log("Załadowano zmienne środowiskowe z .env.test");
} catch (error) {
  console.error("Błąd podczas ładowania pliku .env.test:", error);
}

/**
 * Konfiguracja Playwright dla testów E2E aplikacji 10x-cards
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./src/tests/e2e",
  // Maksymalny czas wykonania pojedynczego testu
  timeout: 90 * 1000,
  // Oczekuj na zakończenie testów przed zamknięciem
  expect: {
    timeout: 15000,
  },
  // Nie uruchamiaj testów równolegle, by uniknąć konfliktów w bazie danych
  fullyParallel: false,
  // Liczba powtórzeń w przypadku niestabilnego testu
  retries: process.env.CI ? 2 : 2,
  // Nie uruchamiaj testów równolegle przez pracowników, ponieważ mają współdzielony stan bazy
  workers: 1,
  // Reporter do wyświetlania wyników testów
  reporter: [["html", { open: "never" }], ["list"]],
  // Konfiguracje dla każdej przeglądarki
  use: {
    // Bazowy URL aplikacji
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    // Przechwytuj zrzuty ekranu tylko przy niepowodzeniu (zamiast zawsze)
    screenshot: "only-on-failure",
    // Nagrywaj filmy z przebiegu testów tylko przy niepowodzeniu (zamiast zawsze)
    video: "retain-on-failure",
    // Rejestruj ślad wykonania testu (trace) tylko przy niepowodzeniu
    trace: "retain-on-failure",
    // Dodawaj znaczniki czasowe do logów
    actionTimeout: 20000,
    navigationTimeout: 40000,
    // Dodatkowe opcje konfiguracyjne
    launchOptions: {
      slowMo: 100,
      // Dodaj limity pamięci dla przeglądarki
      args: [
        '--js-flags=--max-old-space-size=2048',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-sandbox'
      ],
    },
    // Ustawienie kontekstu przeglądarki aby zmniejszyć zużycie pamięci
    contextOptions: {
      reducedMotion: 'reduce',
    },
    // Dodajemy specjalne nagłówki dla Windows jeśli wykryto tę platformę
    extraHTTPHeaders: isPlatformWindows 
      ? { 'X-Test-Windows': 'true', 'X-Test-E2E': 'true' } 
      : { 'X-Test-E2E': 'true' },
  },

  // Konfiguracje projektów testowych
  projects: [
    // Projekt konfiguracji bazy danych do testów
    {
      name: "setup db",
      testMatch: "**/global.setup.ts",
    },
    // Projekt dla zakończenia testów i sprzątania
    {
      name: "teardown",
      testMatch: "**/global.teardown.ts",
    },
    // Projekt dla Google Chrome
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
      testIgnore: ["**/global.setup.ts", "**/global.teardown.ts"],
      // W trybie UI i debug dependencies powodują problemy, więc dodajemy warunek
      dependencies: process.env.PLAYWRIGHT_UI_MODE || process.env.PLAYWRIGHT_DEBUG_MODE ? [] : ["setup db"],
      teardown: "teardown",
    },
    // Projekt dla szybkiego debugowania pojedynczych testów
    {
      name: "direct-chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
      testIgnore: ["**/global.setup.ts", "**/global.teardown.ts"],
      teardown: "teardown",
    },
    // Specjalny projekt dla testów na Windows
    ...(isPlatformWindows ? [{
      name: "windows-chromium",
      use: {
        ...devices["Desktop Chrome"],
        extraHTTPHeaders: { 
          'X-Test-Windows': 'true', 
          'X-Test-E2E': 'true',
          'X-Platform': 'windows' 
        },
      },
      testIgnore: ["**/global.setup.ts", "**/global.teardown.ts"],
      teardown: "teardown",
    }] : []),
  ],

  // Modyfikuję konfigurację webServer, aby wykorzystać istniejący serwer
  webServer: {
    command: "npm run dev",
    port: 3000,
    timeout: 180 * 1000,
    reuseExistingServer: true,
  },

  // Konfiguracja katalogów wyjściowych
  outputDir: "./tmp/test-results",
});
