# Testowanie w projekcie 10x-cards

## Przegląd

Ten projekt wykorzystuje dwa główne rodzaje testów:

1. **Testy jednostkowe** - używając Vitest + Testing Library
2. **Testy E2E** - wykorzystując Playwright

## Konfiguracja testów

W projekcie skonfigurowano następujące elementy:

1. **Vitest** - do testów jednostkowych
   - Plik konfiguracyjny: `vitest.config.ts`
   - Setup testów: `tests/unit/setup.ts`
   - Przykładowy test: `tests/unit/components/Button.test.tsx`

2. **Playwright** - do testów E2E
   - Plik konfiguracyjny: `playwright.config.ts`
   - Przykładowy test: `tests/e2e/homepage.spec.ts`

3. **GitHub Actions Workflow**
   - Plik konfiguracyjny: `.github/workflows/tests.yml`
   - Workflow uruchamia zarówno testy jednostkowe jak i E2E
   - Generuje i archiwizuje raporty pokrycia kodu i wyniki testów

## Testy jednostkowe (Vitest)

### Uruchamianie testów

```bash
# Uruchomienie wszystkich testów jednostkowych
npm run test

# Uruchomienie testów w trybie watch
npm run test:watch

# Uruchomienie testów z interfejsem graficznym
npm run test:ui

# Uruchomienie testów z raportem pokrycia
npm run test:coverage
```

### Pisanie testów jednostkowych

- Testy jednostkowe znajdują się w katalogu `tests/unit`
- Struktura katalogów testów powinna odzwierciedlać strukturę źródłową
- Zgodnie z wytycznymi w `vitest-unit-testing.mdc`:

1. Używaj `vi.fn()` do mockowania funkcji
2. Używaj `vi.spyOn()` do monitorowania istniejących funkcji
3. Preferuj spies zamiast mocków gdy potrzebujesz tylko zweryfikować interakcje
4. Stosuj wzorce fabrykowe dla `vi.mock()` na poziomie testów
5. Używaj plików konfiguracyjnych dla powtarzalnych ustawień
6. Używaj inlineowych snapshottów dla czytelnych asercji
7. Uruchamiaj testy w trybie watch podczas developmentu
8. Grupuj testy dla utrzymywalności używając bloków `describe`
9. Strukturyzuj testy wg. wzorca Arrange-Act-Assert

## Testy E2E (Playwright)

### Uruchamianie testów

```bash
# Uruchomienie wszystkich testów E2E
npm run test:e2e

# Uruchomienie testów z interfejsem graficznym
npm run test:e2e:ui

# Uruchomienie testów w trybie debug
npm run test:e2e:debug
```

### Pisanie testów E2E

- Testy E2E znajdują się w katalogu `tests/e2e`
- Zgodnie z wytycznymi w `playwright-e2e-testing.mdc`:

1. Inicjalizuj testy tylko dla Chromium/Desktop Chrome
2. Używaj kontekstów przeglądarki do izolowania środowisk testowych
3. Implementuj wzorzec Page Object Model dla utrzymywalnych testów
4. Używaj lokalizatorów dla odpornego wybierania elementów
5. Wykorzystuj testy API do walidacji backendu
6. Implementuj porównania wizualne z `expect(page).toHaveScreenshot()`
7. Używaj narzędzia codegen do nagrywania testów
8. Korzystaj z trace viewer do debugowania testów
9. Implementuj hooki testowe do setup/teardown
10. Wykorzystuj asercje expect z odpowiednimi matcherami
11. Wykorzystuj równoległe wykonywanie dla szybszego działania testów

## Przykłady

### Przykład testu jednostkowego (Vitest + React Testing Library)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/ui/button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Test Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /test button/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
```

### Przykład testu E2E (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Strona główna', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('powinna wyświetlać główny nagłówek', async ({ page }) => {
    const heading = await page.locator('h1').textContent();
    expect(heading).toContain('Witaj w 10xDevs Astro Starter');
  });
});
```

## CI/CD

Projekt ma skonfigurowany workflow GitHub Actions, który uruchamia testy w środowisku ciągłej integracji. Workflow:

1. Uruchamia się na:
   - Push do gałęzi main/master
   - Pull Request do gałęzi main/master
   - Ręczne uruchomienie (workflow_dispatch)

2. Uruchamia testy jednostkowe:
   - Instaluje zależności
   - Uruchamia testy Vitest
   - Generuje raport pokrycia kodu
   - Archiwizuje raport pokrycia

3. Uruchamia testy E2E:
   - Instaluje zależności
   - Instaluje Playwright (tylko Chromium)
   - Buduje aplikację
   - Uruchamia testy E2E
   - Archiwizuje raport z testów Playwright 