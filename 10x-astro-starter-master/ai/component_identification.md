# Identyfikacja komponentów do testów E2E z Playwright

## Główne ścieżki użytkownika do przetestowania

Na podstawie analizy dokumentów, najważniejsze ścieżki użytkownika do przetestowania z Playwright to:

### 1. Dostęp do aplikacji
- **Strona główna** (niezalogowany) - weryfikacja że niezalogowany użytkownik widzi tylko zachętę do rejestracji
- **Rejestracja** - sprawdzenie procesu tworzenia konta
- **Logowanie** - weryfikacja poprawnego logowania
- **Odzyskiwanie hasła** - testowanie całego procesu resetowania hasła

### 2. Zarządzanie fiszkami
- **Generowanie fiszek przez AI** - cały proces od wklejenia tekstu do zapisania fiszek
- **Ręczne tworzenie fiszek** - dodawanie własnych fiszek
- **Edycja i usuwanie fiszek** - zarządzanie istniejącymi fiszkami

### 3. Sesja nauki
- **System Leitnera** - weryfikacja algorytmu powtórek i przechodzenia fiszek między poziomami

## Komponenty do testowania

### Komponenty interfejsu:
1. **Formularze**:
   - Formularz rejestracji
   - Formularz logowania
   - Formularz odzyskiwania hasła
   - Formularz tworzenia/edycji fiszek
   - Formularz generowania fiszek (z polem na tekst źródłowy)

2. **Widoki**:
   - Strona główna (dla zalogowanych i niezalogowanych)
   - Panel zarządzania fiszkami
   - Widok sesji nauki
   - Panel użytkownika

3. **Komponenty interaktywne**:
   - Przyciski zatwierdzania/odrzucania fiszek generowanych przez AI
   - Kontrolki oceny znajomości fiszek podczas sesji nauki
   - Menu nawigacyjne

## Drzewa komponentów (ASCII)

### 1. Struktura głównego układu aplikacji
```
Layout.astro
├── Header
│   ├── Logo
│   ├── NavigationMenu
│   │   ├── NavLink (Strona główna)
│   │   ├── NavLink (Moje fiszki)
│   │   ├── NavLink (Generuj fiszki)
│   │   └── NavLink (Sesja nauki)
│   └── UserMenu
│       ├── UserAvatar
│       ├── DropdownMenu
│       │   ├── MenuItem (Panel użytkownika)
│       │   └── MenuItem (Wyloguj)
│       └── AuthButtons (gdy niezalogowany)
│           ├── Button (Zaloguj)
│           └── Button (Zarejestruj)
├── Main (slot dla treści strony)
└── Footer
    ├── Copyright
    └── SocialLinks
```

### 2. Proces rejestracji i logowania
```
AuthPage
├── AuthTabs
│   ├── TabButton (Logowanie)
│   └── TabButton (Rejestracja)
├── LoginForm (gdy wybrany tab "Logowanie")
│   ├── EmailInput
│   ├── PasswordInput
│   ├── RememberMeCheckbox
│   ├── ForgotPasswordLink
│   └── SubmitButton
├── RegisterForm (gdy wybrany tab "Rejestracja")
│   ├── EmailInput
│   ├── PasswordInput
│   ├── ConfirmPasswordInput
│   ├── TermsCheckbox
│   └── SubmitButton
└── ForgotPasswordForm (gdy kliknięty link "Zapomniałem hasła")
    ├── EmailInput
    └── SubmitButton
```

### 3. Zarządzanie fiszkami
```
FlashcardsManagementPage
├── TabNavigation
│   ├── TabButton (Moje fiszki)
│   ├── TabButton (Generuj fiszki)
│   └── TabButton (Dodaj fiszkę)
├── MyFlashcards (gdy wybrany tab "Moje fiszki")
│   ├── SearchBar
│   ├── SortDropdown
│   ├── FlashcardsList
│   │   ├── FlashcardItem
│   │   │   ├── FlashcardPreview
│   │   │   ├── EditButton
│   │   │   └── DeleteButton
│   │   └── ...więcej FlashcardItem
│   └── Pagination
├── GenerateFlashcards (gdy wybrany tab "Generuj fiszki")
│   ├── SourceTextForm
│   │   ├── TextareaInput
│   │   ├── AIModelSelector
│   │   └── GenerateButton
│   ├── GeneratedProposals
│   │   ├── ProposalItem
│   │   │   ├── FlashcardPreview
│   │   │   ├── ApproveButton
│   │   │   ├── EditButton
│   │   │   └── RejectButton
│   │   └── ...więcej ProposalItem
│   └── SaveApprovedButton
└── AddFlashcard (gdy wybrany tab "Dodaj fiszkę")
    ├── FlashcardForm
    │   ├── FrontInput
    │   ├── BackInput
    │   └── SaveButton
    └── PreviewCard
```

### 4. Sesja nauki
```
StudySessionPage
├── SessionProgress
│   ├── ProgressBar
│   ├── FlashcardCounter
│   └── TimeElapsed
├── FlashcardView
│   ├── FlashcardFront (pokazywana najpierw)
│   ├── RevealAnswerButton
│   ├── FlashcardBack (pokazywana po kliknięciu "Pokaż odpowiedź")
│   └── DifficultyButtons (pokazywane po ujawnieniu odpowiedzi)
│       ├── Button (Trudna)
│       ├── Button (Średnia)
│       └── Button (Łatwa)
└── SessionSummary (pokazywane po zakończeniu sesji)
    ├── StatsOverview
    │   ├── TotalFlashcards
    │   ├── CorrectAnswers
    │   └── TimeStats
    ├── LevelDistribution
    │   ├── Level1Count
    │   ├── Level2Count
    │   └── Level3Count
    └── FinishButton
```

## Scenariusze testowe E2E

### 1. Rejestracja i logowanie
```typescript
test('Rejestracja nowego użytkownika', async ({ page }) => {
  await page.goto('/');
  await page.click('button:text("Zarejestruj się")'); 
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Witaj');
});

test('Logowanie istniejącego użytkownika', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

### 2. Generowanie fiszek przez AI
```typescript
test('Generowanie fiszek przez AI', async ({ page }) => {
  await logIn(page); // helper do logowania
  await page.click('a:text("Generuj fiszki")');
  
  const tekst = 'Długi tekst źródłowy...' // tekst 1000-10000 znaków
  await page.fill('textarea[name="sourceText"]', tekst);
  await page.click('button:text("Generuj fiszki")');
  
  // Oczekiwanie na wygenerowanie propozycji
  await expect(page.locator('.flashcard-proposal')).toBeVisible();
  await expect(page.locator('.flashcard-proposal')).toHaveCount.greaterThan(0);
  
  // Zatwierdzenie pierwszej fiszki
  await page.click('.flashcard-proposal:first-child button:text("Zatwierdź")');
  
  // Zapisanie zatwierdzonych fiszek
  await page.click('button:text("Zapisz zatwierdzone")');
  await expect(page.locator('.notification-success')).toBeVisible();
});
```

### 3. Sesja nauki z systemem Leitnera
```typescript
test('Przejście przez sesję nauki', async ({ page }) => {
  await logIn(page);
  await page.click('a:text("Sesja nauki")');
  await page.click('button:text("Rozpocznij sesję")');
  
  // Przejście przez kilka fiszek z różnymi ocenami
  for(let i = 0; i < 3; i++) {
    await expect(page.locator('.flashcard-front')).toBeVisible();
    await page.click('button:text("Pokaż odpowiedź")');
    await expect(page.locator('.flashcard-back')).toBeVisible();
    
    // Wybór różnych ocen dla różnych fiszek
    if (i % 3 === 0) {
      await page.click('button:text("Trudna")'); // Poziom 1
    } else if (i % 3 === 1) {
      await page.click('button:text("Średnia")'); // Poziom 2
    } else {
      await page.click('button:text("Łatwa")'); // Poziom 3
    }
  }
  
  // Sprawdzenie czy sesja została zakończona
  await expect(page.locator('h2:text("Podsumowanie sesji")')).toBeVisible();
});
```

## Priorytetyzacja testów

Najważniejsze testy E2E w kolejności priorytetów:

1. **Dostęp do aplikacji** - podstawowa funkcjonalność warunkująca korzystanie z aplikacji
   - Rejestracja
   - Logowanie 
   - Wylogowanie

2. **Zarządzanie fiszkami** - kluczowa funkcjonalność produktu
   - Generowanie przez AI (unikalna wartość aplikacji)
   - Tworzenie ręczne
   - Przeglądanie i edycja

3. **Sesja nauki** - realizacja głównego celu produktu
   - Przeprowadzenie pełnej sesji nauki
   - Weryfikacja działania algorytmu powtórek

4. **Zarządzanie kontem** - funkcjonalności uzupełniające
   - Zmiana hasła
   - Usunięcie konta

## Zalecenia dotyczące implementacji testów

1. Utworzenie **fixture'ów Playwright** do powtarzalnych zadań (logowanie, tworzenie fiszek)
2. Testowanie na różnych rozmiarach ekranu (desktop, tablet, mobile)
3. Wykorzystanie izolowanych środowisk testowych z przygotowanymi danymi
4. Implementacja testów w języku polskim (zgodnie z interfejsem aplikacji)
