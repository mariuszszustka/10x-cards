# Testy w projekcie 10x-cards

## Struktura testów

Testy w projekcie są zorganizowane w następującej strukturze:

- `tests/unit/` - testy jednostkowe
  - `components/` - testy komponentów UI
  - `setup.ts` - konfiguracja środowiska testowego dla testów jednostkowych
- `tests/e2e/` - testy end-to-end z użyciem Playwright
- `src/**/__tests__/` - testy jednostkowe umieszczone bezpośrednio obok kodu źródłowego

## Testy jednostkowe

Testy jednostkowe są realizowane przy użyciu:

- **Vitest** - szybki framework testowy, kompatybilny z API Jest
- **Testing Library** - biblioteka ułatwiająca testowanie komponentów React
- **jsdom** - implementacja środowiska DOM dla testów w Node.js

### Jak uruchomić testy jednostkowe?

```bash
# Uruchomienie wszystkich testów jednostkowych
npm run test

# Uruchomienie testów z obserwowaniem zmian
npm run test:watch

# Uruchomienie testów z interfejsem UI
npm run test:ui

# Generowanie raportu pokrycia testami
npm run test:coverage
```

### Struktura testów jednostkowych

Testy jednostkowe są zorganizowane w dwóch obszarach:

1. **Testy komponentów UI** - znajdują się w katalogu `tests/unit/components/`

   - Testują renderowanie i interakcje z komponentami UI
   - Wszystkie komponenty Shadcn/ui powinny być pokryte testami

2. **Testy modułów funkcjonalnych** - znajdują się w katalogach `src/**/__tests__/`
   - Testy znajdują się blisko kodu źródłowego, który testują
   - Główne moduły przetestowane to:
     - `src/auth/__tests__/` - funkcjonalność autoryzacji i zarządzania JWT
     - `src/utils/__tests__/` - funkcje pomocnicze, w tym walidacja danych
     - `src/learning/__tests__/` - system nauki i algorytm powtórek

### Dodawanie nowych testów jednostkowych

Aby dodać nowy test jednostkowy:

1. Dla komponentów UI:

   - Stwórz nowy plik w `tests/unit/components/` o nazwie `NazwaKomponentu.test.tsx`
   - Użyj `render` z Testing Library do renderowania komponentu
   - Wykorzystaj `screen` do wykonywania zapytań do wyrenderowanego DOM
   - Używaj asercji `expect` do weryfikacji stanu i zachowania komponentu

2. Dla modułów funkcjonalnych:
   - Stwórz katalog `__tests__` w folderze zawierającym testowany moduł
   - Nazwij plik testowy `NazwaModułu.test.ts`
   - Wykorzystaj mocki do izolacji testowanego modułu od zależności zewnętrznych

### Przykład testu komponentu

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MójKomponent } from "../../../src/components/MójKomponent";

describe("MójKomponent", () => {
  it("renderuje się poprawnie", () => {
    render(<MójKomponent />);
    expect(screen.getByText("Oczekiwany tekst")).toBeInTheDocument();
  });
});
```

## Testy E2E

Testy E2E (end-to-end) są realizowane przy użyciu Playwright. Pozwalają na testowanie aplikacji w rzeczywistych przeglądarkach, symulując interakcje użytkownika.

### Uproszczone podejście do testów E2E

W celu ułatwienia procesu rozwoju i utrzymania testów, zdecydowaliśmy się na uproszczone podejście:

- Testy są uruchamiane tylko na przeglądarce **Google Chrome**
- Skupiamy się na testowaniu kluczowych funkcjonalności aplikacji
- Kierujemy się zasadą MVP (Minimum Viable Product) dla testów

### Jak uruchomić testy E2E?

```bash
# Uruchomienie wszystkich testów E2E na Google Chrome
npm run test:e2e

# Uruchomienie konkretnego testu
npm run test:e2e -- tests/e2e/auth.spec.ts

# Uruchomienie testów z raportem HTML
npm run test:e2e -- --reporter=html
```

Szczegółowe informacje na temat testów E2E znajdują się w pliku [tests/e2e/README.md](./e2e/README.md).

## Ciągła integracja (CI)

Testy są automatycznie uruchamiane przy każdym pull requeście do głównych gałęzi (main, master) za pomocą GitHub Actions. Konfiguracja znajduje się w pliku `.github/workflows/tests.yml`.

Proces CI obejmuje:

1. Uruchomienie testów jednostkowych
2. Generowanie raportu pokrycia testami
3. Weryfikację typu TypeScript
4. Uruchomienie analizy statycznej kodu (ESLint)

## Wymagania dotyczące pokrycia testami

Celem projektu jest utrzymanie pokrycia testami na poziomie co najmniej 70%. Obecne pokrycie testami jest monitorowane i raportowane w procesie CI.
