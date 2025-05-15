import { type Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Ścieżka do katalogu z artefaktami testów
 */
const ARTIFACTS_DIR = "./test-artifacts";

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
