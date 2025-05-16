import { type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Ścieżka do katalogu z artefaktami testów
 */
const ARTIFACTS_DIR = "./test-artifacts";

/**
 * Sprawdza czy test jest uruchamiany na platformie Windows
 */
export function isWindowsPlatform(): boolean {
  return typeof process !== 'undefined' && 
         typeof process.platform === 'string' && 
         (process.platform.toLowerCase().includes('win') || 
          process.env.PLATFORM === 'windows');
}

/**
 * Sprawdza, czy nagłówki żądania wskazują na test z platformy Windows
 * @param headers Nagłówki żądania
 */
export function isWindowsTestRequest(headers: Headers): boolean {
  return headers.get("X-Test-Windows") === "true" || 
         headers.get("X-Platform") === "windows";
}

/**
 * Upewnia się, że katalog z artefaktami testów istnieje
 */
export function ensureArtifactsDir(): void {
  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }
}

/**
 * Zapisuje zrzut ekranu strony
 *
 * @param page Strona Playwright
 * @param name Nazwa pliku (bez rozszerzenia)
 * @param fullPage Czy zapisać cały widoczny obszar strony
 */
export async function saveScreenshot(page: Page, name: string, fullPage: boolean = false): Promise<void> {
  ensureArtifactsDir();
  const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-");
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(ARTIFACTS_DIR, filename);

  await page.screenshot({ path: filepath, fullPage });
  console.log(`📸 Zapisano zrzut ekranu: ${filepath}`);
}

/**
 * Zapisuje zawartość HTML strony
 *
 * @param page Strona Playwright
 * @param name Nazwa pliku (bez rozszerzenia)
 */
export async function savePageContent(page: Page, name: string): Promise<void> {
  ensureArtifactsDir();
  const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-");
  const filename = `${name}-${timestamp}.html`;
  const filepath = path.join(ARTIFACTS_DIR, filename);

  const html = await page.content();
  fs.writeFileSync(filepath, html);
  console.log(`📄 Zapisano zawartość strony: ${filepath}`);
}

/**
 * Zapisuje logi konsoli przeglądarki
 *
 * @param logs Logi konsoli
 * @param name Nazwa pliku (bez rozszerzenia)
 */
export function saveConsoleLogs(logs: string[], name: string): void {
  ensureArtifactsDir();
  const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-");
  const filename = `${name}-console-${timestamp}.log`;
  const filepath = path.join(ARTIFACTS_DIR, filename);

  fs.writeFileSync(filepath, logs.join("\n"));
  console.log(`📝 Zapisano logi konsoli: ${filepath}`);
}

/**
 * Pomocnik dla testów E2E do ustawienia nagłówków odpowiednich dla platformy
 * 
 * @param page Strona Playwright
 */
export async function setupTestHeaders(page: Page): Promise<void> {
  // Dodaj nagłówki dla testów E2E
  const headers = {
    'X-Test-E2E': 'true'
  };
  
  // Dodaj specjalne nagłówki dla Windows
  if (isWindowsPlatform()) {
    Object.assign(headers, {
      'X-Test-Windows': 'true',
      'X-Platform': 'windows'
    });
    console.log('Ustawiono nagłówki dla testów na platformie Windows');
  }
  
  await page.setExtraHTTPHeaders(headers);
}

/**
 * Sprawdza czy na stronie jest obecne ciasteczko testowe dla Windows
 * 
 * @param page Strona Playwright
 */
export async function hasWindowsTestCookie(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  return cookies.some(cookie => cookie.name === 'win-test-session');
}

/**
 * Dodaje specjalne obsługi dla testów na Windows
 * 
 * @param page Strona Playwright
 */
export async function setupWindowsTestEnvironment(page: Page): Promise<void> {
  if (!isWindowsPlatform()) {
    return; // Nic nie rób na innych platformach
  }
  
  // Ustaw nagłówki
  await setupTestHeaders(page);
  
  // Dodaj nasłuchiwanie na zdarzenia konsoli
  page.on('console', msg => {
    if (msg.text().includes('Windows') || msg.text().includes('test-session')) {
      console.log(`🪟 [Konsola Windows]: ${msg.text()}`);
    }
  });
  
  console.log('Skonfigurowano środowisko testowe dla Windows');
}
