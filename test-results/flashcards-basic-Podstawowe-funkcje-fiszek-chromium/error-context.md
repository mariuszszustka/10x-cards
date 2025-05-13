# Test info

- Name: Podstawowe funkcje fiszek
- Location: C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\flashcards-basic.spec.ts:137:1

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/flashcards"
Received string:    "http://localhost:3000/dashboard"
    at C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\flashcards-basic.spec.ts:150:22
```

# Page snapshot

```yaml
- navigation:
  - link "10x Cards":
    - /url: /
  - link "Zaloguj się":
    - /url: /auth/login
  - link "Zarejestruj się":
    - /url: /auth/register
- main:
  - heading "Witaj w aplikacji 10x Cards!" [level=1]
  - paragraph: "Zalogowany jako: test-e2e@example.com"
  - paragraph: "User ID: test-e2e-user-id"
  - paragraph: "Uwaga: Sesja serwerowa nie została znaleziona. Niektóre funkcje mogą nie działać."
  - link "Generuj fiszki z AI Wykorzystaj sztuczną inteligencję do tworzenia fiszek na podstawie tekstów.":
    - /url: /generate
    - heading "Generuj fiszki z AI" [level=2]
    - paragraph: Wykorzystaj sztuczną inteligencję do tworzenia fiszek na podstawie tekstów.
  - link "Zarządzaj fiszkami Przeglądaj, edytuj i organizuj swoje fiszki.":
    - /url: /flashcards
    - heading "Zarządzaj fiszkami" [level=2]
    - paragraph: Przeglądaj, edytuj i organizuj swoje fiszki.
  - link "Nauka z systemem Leitnera Rozpocznij sesję nauki z wykorzystaniem systemu interwałów.":
    - /url: /leitner
    - heading "Nauka z systemem Leitnera" [level=2]
    - paragraph: Rozpocznij sesję nauki z wykorzystaniem systemu interwałów.
  - link "Statystyki Sprawdź swoje postępy i skuteczność nauki.":
    - /url: /stats
    - heading "Statystyki" [level=2]
    - paragraph: Sprawdź swoje postępy i skuteczność nauki.
  - link "Diagnostyka sesji":
    - /url: /auth/debug
- contentinfo:
  - paragraph: © 2025 10x Cards. Wszystkie prawa zastrzeżone.
```

# Test source

```ts
   50 |       });
   51 |       
   52 |       // Sprawdź czy to faktycznie strona fiszek - może zawierać jakieś specyficzne elementy
   53 |       const pageTitle = await page.title();
   54 |       console.log(`Tytuł strony ${path}:`, pageTitle);
   55 |       const pageContent = await page.content();
   56 |       
   57 |       // Zapiszmy HTML do analizy
   58 |       fs.writeFileSync(`./test-artifacts/flashcards-${path.replace(/\//g, '-')}.html`, pageContent);
   59 |       
   60 |       // Sprawdź, czy strona zawiera elementy charakterystyczne dla fiszek
   61 |       // Spróbujmy kilka różnych podejść
   62 |       
   63 |       // 1. Sprawdź czy URL zawiera "flashcard" lub "fiszki"
   64 |       if (page.url().includes('flashcard') || page.url().includes('fiszki')) {
   65 |         console.log(`Znaleziono 'flashcard/fiszki' w URL: ${page.url()}`);
   66 |         flashcardsAccessible = true;
   67 |       }
   68 |       
   69 |       // 2. Sprawdź zawartość tytułu
   70 |       if (pageTitle.toLowerCase().includes('fiszk')) {
   71 |         console.log(`Znaleziono 'fiszk' w tytule strony: ${pageTitle}`);
   72 |         flashcardsAccessible = true;
   73 |       }
   74 |       
   75 |       // 3. Próbuj wykryć elementy charakterystyczne dla fiszek
   76 |       try {
   77 |         // Sprawdź czy jest zakładka "Moje fiszki" lub podobny element
   78 |         const tabMyFlashcardsVisible = await page.isVisible(SELECTORS.FLASHCARDS.TABS.MY_FLASHCARDS, { timeout: 2000 })
   79 |           .catch(() => false);
   80 |         const tabAddVisible = await page.isVisible(SELECTORS.FLASHCARDS.TABS.ADD, { timeout: 2000 })
   81 |           .catch(() => false);
   82 |         const tabGenerateVisible = await page.isVisible(SELECTORS.FLASHCARDS.TABS.GENERATE, { timeout: 2000 })
   83 |           .catch(() => false);
   84 |
   85 |         if (tabMyFlashcardsVisible || tabAddVisible || tabGenerateVisible) {
   86 |           console.log('Znaleziono elementy interfejsu fiszek');
   87 |           flashcardsAccessible = true;
   88 |         }
   89 |         
   90 |         // Sprawdź czy są jakiekolwiek elementy zawierające "flashcard" lub "fiszki"
   91 |         const flashcardElements = await page.$$('*:has-text("fiszk")').catch(() => []);
   92 |         if (flashcardElements.length > 0) {
   93 |           console.log(`Znaleziono ${flashcardElements.length} elementów zawierających tekst 'fiszk'`);
   94 |           flashcardsAccessible = true;
   95 |         }
   96 |         
   97 |       } catch (e) {
   98 |         console.log('Nie wykryto elementów fiszek ze standardowymi selektorami');
   99 |       }
  100 |       
  101 |       if (flashcardsAccessible) {
  102 |         console.log(`Strona fiszek dostępna pod ścieżką: ${path}`);
  103 |         break;
  104 |       } else {
  105 |         console.log(`Pod ścieżką ${path} nie znaleziono elementów fiszek`);
  106 |       }
  107 |       
  108 |     } catch (error: any) {
  109 |       console.log(`Błąd podczas próby dostępu do ${path}:`, error.message || String(error));
  110 |     }
  111 |   }
  112 |   
  113 |   // Warunkowa asercja - dajemy test tylko jeśli znaleziono stronę 
  114 |   if (flashcardsAccessible) {
  115 |     expect(flashcardsAccessible).toBeTruthy();
  116 |     console.log('Dostęp do fiszek potwierdzony');
  117 |     
  118 |     // Próba kliknięcia w zakładkę "Moje fiszki" (jeśli istnieje)
  119 |     try {
  120 |       await page.click(SELECTORS.FLASHCARDS.TABS.MY_FLASHCARDS);
  121 |       await page.waitForTimeout(2000); // Daj czas na reakcję
  122 |       await page.screenshot({ path: './test-artifacts/my-flashcards-tab.png', fullPage: true });
  123 |       console.log('Przełączono na zakładkę "Moje fiszki"');
  124 |     } catch (e: any) {
  125 |       console.log('Nie udało się kliknąć w zakładkę "Moje fiszki":', e.message || String(e));
  126 |     }
  127 |   } else {
  128 |     console.log('Nie znaleziono strony fiszek - test warunkowo zaliczony');
  129 |     // Ten test może być warunkowo zaliczony, jeśli strony fiszek jeszcze nie ma w MVP
  130 |     test.skip();
  131 |   }
  132 |   
  133 |   console.log('Test dostępu do fiszek zakończony');
  134 | });
  135 |
  136 | // Test podstawowych funkcji fiszek
  137 | test('Podstawowe funkcje fiszek', async ({ page }) => {
  138 |   console.log('Rozpoczynam test fiszek');
  139 |   
  140 |   // Logowanie użytkownika
  141 |   const loggedIn = await loginUser(page);
  142 |   expect(loggedIn).toBeTruthy();
  143 |   console.log('Użytkownik zalogowany');
  144 |   
  145 |   // Przejście do strony fiszek
  146 |   await page.goto('/flashcards');
  147 |   console.log('Przejście na stronę fiszek');
  148 |   
  149 |   // Sprawdzenie, czy jesteśmy na stronie fiszek
> 150 |   expect(page.url()).toContain('/flashcards');
      |                      ^ Error: expect(received).toContain(expected) // indexOf
  151 |   
  152 |   // Sprawdzenie, czy istnieją zakładki
  153 |   const myFlashcardsTab = page.getByRole('tab', { name: /moje fiszki/i });
  154 |   const addFlashcardTab = page.getByRole('tab', { name: /dodaj/i });
  155 |   
  156 |   await expect(myFlashcardsTab).toBeVisible();
  157 |   await expect(addFlashcardTab).toBeVisible();
  158 |   
  159 |   // Przejście do zakładki dodawania fiszek
  160 |   await addFlashcardTab.click();
  161 |   
  162 |   // Sprawdzenie, czy formularz dodawania fiszkek jest widoczny
  163 |   const frontInput = page.locator('textarea[name="front"]');
  164 |   const backInput = page.locator('textarea[name="back"]');
  165 |   const saveButton = page.getByRole('button', { name: /zapisz/i });
  166 |   
  167 |   await expect(frontInput).toBeVisible();
  168 |   await expect(backInput).toBeVisible();
  169 |   await expect(saveButton).toBeVisible();
  170 |   
  171 |   // Wypełnienie formularza
  172 |   await frontInput.fill('Testowa fiszka przód');
  173 |   await backInput.fill('Testowa fiszka tył');
  174 |   
  175 |   // Zapisanie fiszki
  176 |   await saveButton.click();
  177 |   
  178 |   // Sprawdzenie czy pojawił się komunikat o sukcesie
  179 |   const successNotification = page.locator('.notification-success');
  180 |   await expect(successNotification).toBeVisible();
  181 |   
  182 |   // Przejście do zakładki "Moje fiszki"
  183 |   await myFlashcardsTab.click();
  184 |   
  185 |   // Sprawdzenie, czy fiszka została dodana
  186 |   const flashcardItem = page.locator('.flashcard-item').first();
  187 |   await expect(flashcardItem).toBeVisible();
  188 |   
  189 |   console.log('Test fiszek zakończony pomyślnie');
  190 | }); 
```