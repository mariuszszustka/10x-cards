import { test, expect } from "@playwright/test";

test("Debug logowania - sprawdzenie co się dzieje po wypełnieniu formularza", async ({ page }) => {
  console.log("Zaczynam test debugujący logowania");

  // Otwórz stronę logowania
  await page.goto("/auth/login");
  console.log("Otwarto stronę logowania");

  // Zapisz aktualny HTML strony przed wypełnieniem formularza
  const htmlBeforeLogin = await page.content();
  console.log("HTML strony przed logowaniem:\n", htmlBeforeLogin.substring(0, 500) + "...");

  // Znajdź pola formularza i wypełnij je
  const emailInput = await page.locator('input[type="email"]');
  const passwordInput = await page.locator('input[type="password"]');
  const loginButton = await page.locator('button[type="submit"]');

  console.log(
    "Znaleziono pola formularza?",
    (await emailInput.count()) > 0 ? "Email: Tak" : "Email: Nie",
    (await passwordInput.count()) > 0 ? "Hasło: Tak" : "Hasło: Nie",
    (await loginButton.count()) > 0 ? "Przycisk: Tak" : "Przycisk: Nie"
  );

  // Wypełnij formularz
  await emailInput.fill("test-e2e@example.com");
  await passwordInput.fill("Test123!@#");
  console.log("Wypełniono formularz");

  // Zapisz screenshota przed kliknięciem
  await page.screenshot({ path: "before-login.png" });

  // Włącz śledzenie requestów
  const requests: string[] = [];
  page.on("request", (request) => {
    requests.push(`${request.method()} ${request.url()}`);
  });

  // Włącz logowanie konsoli
  page.on("console", (msg) => {
    console.log(`KONSOLA STRONY: ${msg.type()}: ${msg.text()}`);
  });

  // Kliknij przycisk zaloguj i czekaj długo na przekierowanie
  console.log("Klikam przycisk logowania...");
  await loginButton.click();

  // Czekaj 5 sekund, aby zobaczyć, co się dzieje
  console.log("Czekam 5 sekund...");
  await page.waitForTimeout(5000);

  // Zapisz aktualny URL
  const currentUrl = page.url();
  console.log("Aktualny URL po czekaniu:", currentUrl);

  // Sprawdź localStorage
  const localStorage = await page.evaluate(() => {
    const items: Record<string, string> = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key !== null) {
        const value = window.localStorage.getItem(key);
        if (value !== null) {
          items[key] = value;
        }
      }
    }
    return items;
  });

  console.log("Stan localStorage:", JSON.stringify(localStorage, null, 2));

  // Zapisz screenshota po zalogowaniu
  await page.screenshot({ path: "after-login.png" });

  // Zapisz HTML strony po logowaniu
  const htmlAfterLogin = await page.content();
  console.log("HTML strony po logowaniu:\n", htmlAfterLogin.substring(0, 500) + "...");

  // Pokaż wszystkie żądania
  console.log("Wszystkie żądania:", requests);

  // Spróbuj ręcznie przejść na dashboard
  console.log("Próbuję ręcznie przejść na dashboard...");
  await page.goto("/dashboard");
  console.log("URL po próbie ręcznego przejścia:", page.url());

  // Zrzut ekranu po próbie ręcznego przejścia
  await page.screenshot({ path: "manual-dashboard.png" });
});

// Dodaję nowy test diagnostyczny, który sprawdzi, czy strona logowania ładuje się poprawnie
test("Test diagnostyczny dostępu do strony logowania", async ({ page }) => {
  console.log("Rozpoczynam test diagnostyczny strony logowania");

  // Włączam przechwytywanie błędów strony
  page.on("pageerror", (exception) => {
    console.error(`Błąd strony: ${exception.message}`);
  });

  // Włączam przechwytywanie błędów sieci
  page.on("requestfailed", (request) => {
    const failure = request.failure();
    console.error(`Błąd żądania: ${request.url()} - ${failure ? failure.errorText : "nieznany błąd"}`);
  });

  // Włączam logowanie konsoli
  page.on("console", (msg) => {
    console.log(`KONSOLA STRONY [${msg.type()}]: ${msg.text()}`);
  });

  try {
    // Najpierw spróbuję otworzyć stronę główną aby sprawdzić, czy serwer działa
    console.log("Próba otwarcia strony głównej...");
    await page.goto("/", { timeout: 30000 });
    console.log("Strona główna: " + page.url());

    // Zapisuję zrzut ekranu strony głównej
    await page.screenshot({ path: "homepage.png" });

    // Sprawdzam, czy strona główna załadowała się poprawnie
    const homepageHtml = await page.content();
    console.log("Pierwsze 100 znaków HTML strony głównej: " + homepageHtml.substring(0, 100));

    // Próba otwarcia strony logowania
    console.log("Próba otwarcia strony logowania...");
    await page.goto("/auth/login", { timeout: 30000 });
    console.log("Strona logowania: " + page.url());

    // Zapisuję zrzut ekranu strony logowania
    await page.screenshot({ path: "login-page.png" });

    // Sprawdzam, czy strona logowania załadowała się poprawnie
    const loginHtml = await page.content();
    console.log("Pierwsze 100 znaków HTML strony logowania: " + loginHtml.substring(0, 100));

    // Sprawdzam, czy widoczny jest formularz logowania
    const emailInputExists = (await page.locator('input[type="email"]').count()) > 0;
    const passwordInputExists = (await page.locator('input[type="password"]').count()) > 0;
    const loginButtonExists = (await page.locator('button[type="submit"]').count()) > 0;

    console.log(
      "Formularz logowania:",
      emailInputExists ? "Email: Tak" : "Email: Nie",
      passwordInputExists ? "Hasło: Tak" : "Hasło: Nie",
      loginButtonExists ? "Przycisk: Tak" : "Przycisk: Nie"
    );

    // Sprawdzam, czy strona używa selektorów testowych
    const emailInputByTestId = (await page.getByTestId("auth-email-input").count()) > 0;
    const passwordInputByTestId = (await page.getByTestId("auth-password-input").count()) > 0;
    const submitButtonByTestId = (await page.getByTestId("auth-submit-button").count()) > 0;

    console.log(
      "Selektory testowe:",
      emailInputByTestId ? "Email: Tak" : "Email: Nie",
      passwordInputByTestId ? "Hasło: Tak" : "Hasło: Nie",
      submitButtonByTestId ? "Przycisk: Tak" : "Przycisk: Nie"
    );
  } catch (error) {
    console.error("Błąd podczas testu diagnostycznego:", error);
    await page.screenshot({ path: "error-screenshot.png" });
  }
});

// Dodaję nowy test do debugowania strony logowania
test("Test renderowania selektorów testowych na stronie logowania", async ({ page }) => {
  // Ustawiam nagłówek E2E
  await page.setExtraHTTPHeaders({
    "X-Test-E2E": "true",
  });

  // Włączam rejestrowanie błędów
  page.on("pageerror", (error) => {
    console.error("Błąd strony:", error.message);
  });

  console.log("Próba otwarcia strony logowania...");
  await page.goto("/auth/login", { timeout: 30000, waitUntil: "networkidle" });
  console.log("Strona logowania otwarta, URL:", page.url());

  // Zapisuję zrzut ekranu
  await page.screenshot({ path: "login-render-debug.png" });

  // Sprawdzam HTML strony
  const html = await page.content();
  console.log("Pełny HTML strony logowania:");
  console.log(html);

  // Sprawdzam, czy LoginForm jest załadowany jako komponent kliencki
  const hasLoginForm = html.includes("LoginForm");
  console.log("HTML zawiera nazwę LoginForm:", hasLoginForm);

  // Sprawdzam, czy występują data-testid w kodzie HTML
  const hasTestIds = html.includes("data-testid");
  console.log("HTML zawiera atrybuty data-testid:", hasTestIds);

  // Sprawdzam, czy atrybuty testowe są obecne
  const authEmailInput = html.includes('data-testid="auth-email-input"');
  const authPasswordInput = html.includes('data-testid="auth-password-input"');
  const authSubmitButton = html.includes('data-testid="auth-submit-button"');

  console.log("Atrybuty testowe w HTML:", {
    "auth-email-input": authEmailInput,
    "auth-password-input": authPasswordInput,
    "auth-submit-button": authSubmitButton,
  });

  // Sprawdzam, czy React został załadowany
  const reactLoaded = await page.evaluate(() => {
    return typeof window.React !== "undefined";
  });

  console.log("React jest załadowany:", reactLoaded);

  // Sprawdzam, czy komponent został prawidłowo zahydrowany
  await page.waitForTimeout(5000); // Czekam na hydratację

  // Sprawdzam, czy po hydratacji elementy są dostępne
  const emailInputAfterHydration = await page.evaluate(() => {
    return document.querySelector('[data-testid="auth-email-input"]') !== null;
  });

  console.log("Element email po hydratacji:", emailInputAfterHydration);

  // Zrzut ekranu po hydratacji
  await page.screenshot({ path: "login-after-hydration.png" });
});
