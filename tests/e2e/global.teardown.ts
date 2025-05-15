import { test as teardown } from "@playwright/test";

/**
 * Skrypt czyszczący po wykonaniu testów E2E, aby zmniejszyć zużycie pamięci
 * i upewnić się, że przeglądarki są poprawnie zamykane
 */
teardown("Czyszczenie po testach E2E", async ({ page, context, browser }) => {
  console.log("Wykonuję czyszczenie po testach E2E...");

  try {
    // Czyścimy ciasteczka i dane sesji
    await context.clearCookies();
    
    // Zamykamy stronę i kontekst
    await page.close();
    await context.close();

    // Upewniamy się, że przeglądarka jest zamknięta
    await browser.close();

    console.log("Zakończono czyszczenie po testach E2E");
  } catch (error) {
    console.error("Błąd podczas czyszczenia po testach E2E:", error);
  }

  // Wymuszenie zwolnienia pamięci
  if (global.gc) {
    global.gc();
  }
}); 