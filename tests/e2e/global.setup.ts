import { test as setup } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

/**
 * Ustawianie potrzebnych danych testowych i konfiguracji przed rozpoczęciem testów
 */
setup("Przygotowanie środowiska testowego", async ({ page }) => {
  console.log("Uruchamianie globalnej konfiguracji testów...");

  // Wczytanie zmiennych środowiskowych
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });
    console.log("Załadowano zmienne środowiskowe z .env.test");
  } catch (error) {
    console.warn("Nie udało się załadować pliku .env.test:", error);

    // Tworzymy testowe zmienne środowiskowe bezpośrednio w kodzie
    process.env.TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || "test-e2e@example.com";
    process.env.TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || "Test123!@#";
  }

  // Sprawdzamy czy serwer jest dostępny
  try {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
    console.log(`Sprawdzanie dostępności serwera pod adresem: ${baseURL}`);

    const response = await page.request.get(baseURL);
    if (response.ok()) {
      console.log("Serwer jest dostępny, można rozpocząć testy");
    } else {
      console.error("Serwer nie zwrócił poprawnej odpowiedzi, kod:", response.status());
    }
  } catch (error) {
    console.error("Nie udało się nawiązać połączenia z serwerem:", error);
  }

  // Sprawdzamy dostępność API
  try {
    const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

    // Sprawdzamy czy endpoint API jest dostępny - GET, bo nie wysyłamy danych
    const apiResponse = await page.request.get(`${baseURL}/api/auth/check`);
    console.log("API status:", apiResponse.status());

    if (apiResponse.ok()) {
      console.log("API jest dostępne");
    } else {
      console.warn("API może nie być dostępne poprawnie, kod:", apiResponse.status());
    }
  } catch (error) {
    console.error("Błąd podczas sprawdzania API:", error);
  }
});
