// src/tests/e2e/minimal-flashcards.spec.ts
import { test, expect } from '@playwright/test';
import { loginUser, goToFlashcards, saveScreenshot } from './helpers';

// Minimalny test funkcji fiszek
test('Minimalny test fiszek', async ({ page }) => {
  console.log('Rozpoczynam minimalny test fiszek');
  
  // 1. Zaloguj użytkownika
  const loggedIn = await loginUser(page);
  expect(loggedIn).toBeTruthy();
  
  if (!loggedIn) {
    console.log('Test przerwany - nie udało się zalogować');
    return;
  }
  
  // 2. Przejdź do strony fiszek
  const flashcardsAccessible = await goToFlashcards(page);
  expect(flashcardsAccessible).toBeTruthy();
  
  if (!flashcardsAccessible) {
    console.log('Test przerwany - nie udało się przejść do fiszek');
    return;
  }
  
  // Zapisz zrzut ekranu strony fiszek
  await saveScreenshot(page, 'flashcards-page');
  
  // 3. Sprawdź czy są widoczne podstawowe elementy interfejsu
  // Zakładki
  const tabs = page.locator('[role="tab"]');
  const tabCount = await tabs.count();
  expect(tabCount).toBeGreaterThan(0);
  
  console.log(`Znaleziono ${tabCount} zakładek na stronie fiszek`);
  
  // Sprawdź czy jest zakładka "Dodaj"
  const addTab = page.getByRole('tab', { name: /dodaj/i });
  
  if (await addTab.isVisible()) {
    // Kliknij w zakładkę "Dodaj"
    await addTab.click();
    console.log('Kliknięto zakładkę Dodaj');
    
    // Sprawdź czy formularz dodawania jest widoczny
    const frontInput = page.locator('textarea[name="front"], input[name="front"]');
    const backInput = page.locator('textarea[name="back"], input[name="back"]');
    
    const frontVisible = await frontInput.isVisible();
    const backVisible = await backInput.isVisible();
    
    if (frontVisible && backVisible) {
      console.log('Formularz dodawania fiszek jest widoczny');
      
      // Wypełnij formularz
      await frontInput.fill('Testowa fiszka (przód)');
      await backInput.fill('Testowa fiszka (tył)');
      
      // Zapisz zrzut ekranu wypełnionego formularza
      await saveScreenshot(page, 'flashcards-form-filled');
      
      // Znajdź i kliknij przycisk zapisz
      const saveButton = page.getByRole('button', { name: /zapisz/i });
      
      if (await saveButton.isVisible()) {
        await saveButton.click();
        console.log('Kliknięto przycisk Zapisz');
        
        // Poczekaj na akcję zapisu
        await page.waitForTimeout(1000);
        
        // Zapisz zrzut ekranu po zapisie
        await saveScreenshot(page, 'flashcards-after-save');
      } else {
        console.log('Przycisk Zapisz nie jest widoczny');
      }
    } else {
      console.log('Formularz dodawania fiszek nie jest w pełni widoczny');
    }
  } else {
    console.log('Zakładka Dodaj nie jest widoczna');
  }
  
  console.log('Minimalny test fiszek zakończony');
});