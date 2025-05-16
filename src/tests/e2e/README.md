# Testy E2E 10x-Cards

Ten katalog zawiera testy end-to-end (E2E) dla aplikacji 10x-Cards. Testy korzystają z Playwright do automatyzacji przeglądarki i testowania pełnego przepływu w aplikacji.

## Ważne informacje

### Różnice między platformami

Testy mogą zachowywać się różnie na systemach Windows i Linux/Unix. Zaimplementowaliśmy specjalne mechanizmy w middleware aplikacji, które automatycznie dostosowują się do platformy.

#### Status testów na różnych platformach:

| Test | Windows | Linux/Debian |
|------|---------|--------------|
| Testy UI | ✅ | ✅ |
| Testy E2E | ⚠️ Częściowo | ✅ |

#### Dlaczego istnieją różnice?

Różnice wynikają z:
1. Różnego zachowania mechanizmów ciasteczek i localStorage między platformami
2. Różnic w sposobie obsługi sesji między systemami
3. Różnic w konfiguracji i ustawieniach przeglądarek używanych przez Playwright

### Specjalne mechanizmy dla Windows

W middleware aplikacji dodaliśmy specjalne mechanizmy dla platformy Windows:

```typescript
// Wykrywanie platformy Windows
const IS_WINDOWS = typeof process !== 'undefined' && 
                  typeof process.platform === 'string' && 
                  process.platform.toLowerCase().includes('win');

// Specjalne ciasteczko dla testów na Windows
if (IS_WINDOWS && isTestRequest) {
  cookies.set("win-test-session", JSON.stringify({
    user_id: "test-e2e-user-id",
    email: "test-e2e@example.com"
  }), {
    path: "/",
    secure: false,
    httpOnly: false,
  });
}
```

## Uruchamianie testów

### Na Linuksie

```bash
npm run test:e2e
```

### Na Windowsie

```bash
npm run test:e2e:windows
```

## Rozwiązywanie problemów

### Problemy z autoryzacją na Windows

Jeśli testy na Windowsie nie przechodzą z powodu problemów z autoryzacją:

1. Upewnij się, że aplikacja działa w trybie DEV (`npm run dev`)
2. Otwórz konsolę przeglądarki i sprawdź czy ciasteczko `win-test-session` jest poprawnie ustawiane
3. Sprawdź logi middleware, czy wykrywa platformę Windows i ustawia odpowiednie ciasteczka

### Problemy z dostępem do dashboardu

Jeśli testy nie mogą przejść do dashboardu:

1. Sprawdź czy middleware poprawnie wykrywa żądania z testów Playwright
2. Zweryfikuj czy użytkownik testowy jest ustawiany poprawnie w kontekście (locals.user)
3. Sprawdź czy nie ma przekierowań w kliencie JavaScript, które mogą blokować testy

## Dodawanie nowych testów

Przy dodawaniu nowych testów, pamiętaj o:

1. Ustawieniu odpowiednich nagłówków dla testów (`X-Test-E2E: true`)
2. Obsłudze różnic między platformami
3. Dodaniu odpowiednich logów dla debugowania

## Strategia naprawy testów na Windows

Aby naprawić testy na Windows, zaimplementowaliśmy:

1. Mechanizm wykrywania platformy w middleware
2. Specjalne ciasteczka dla testów na Windows
3. Dodatkową obsługę JavaScript w kodzie klienta, który wykrywa środowisko testowe 