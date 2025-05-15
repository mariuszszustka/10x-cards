import { test as setup } from '@playwright/test';

/**
 * Ten plik jest używany jako teardown dla testów E2E.
 * Jego zadaniem jest prawidłowe zamknięcie wszystkich zasobów przeglądarki
 * po zakończeniu testów, aby uniknąć wycieków pamięci.
 */
setup('Globalne sprzątanie po testach E2E', async ({ browser }) => {
  console.log('🧹 Sprzątanie po testach E2E...');
  
  try {
    // Upewniamy się, że wszystkie konteksty przeglądarki są zamknięte
    const contexts = browser.contexts();
    for (const context of contexts) {
      await context.close();
    }
    
    // Zamykamy przeglądarkę
    await browser.close();
    
    console.log('✅ Sprzątanie zakończone pomyślnie');
  } catch (error) {
    console.error('❌ Błąd podczas sprzątania:', error);
  }
}); 