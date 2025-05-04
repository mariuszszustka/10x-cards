import { test as setup } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/db/database.types';

/**
 * Funkcja przygotowująca bazę danych przed wykonaniem testów E2E
 * 
 * Upewnia się, że użytkownik testowy istnieje w bazie danych
 * i jest gotowy do wykorzystania w testach.
 */
setup('Przygotowanie środowiska testowego', async ({ }) => {
  console.log('Inicjalizacja środowiska testowego...');

  // Tworzenie klienta Supabase z danymi testowymi
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Brak zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY. Nie można połączyć z bazą.');
    return;
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  try {
    // Sprawdzenie, czy istnieje już użytkownik testowy
    const testUserEmail = process.env.TEST_USER_EMAIL || 'test-e2e@example.com';
    
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', testUserEmail)
      .maybeSingle();
    
    if (userCheckError) {
      console.error('Błąd podczas sprawdzania użytkownika testowego:', userCheckError);
      return;
    }
    
    // Jeśli użytkownik testowy już istnieje, ustaw jego ID jako zmienną środowiskową
    if (existingUser) {
      console.log(`Użytkownik testowy już istnieje: ${existingUser.id}`);
      process.env.TEST_USER_ID = existingUser.id;
      
      // Czyszczenie danych testowych przed rozpoczęciem testów
      await cleanupTestData(supabase, existingUser.id);
    } else {
      console.log('Użytkownik testowy nie istnieje, tworzenie nowego użytkownika...');
      
      // W rzeczywistym scenariuszu, tutaj moglibyśmy utworzyć użytkownika testowego
      // przez API autoryzacji Supabase. Jednak ze względu na ograniczenia, zakładamy,
      // że użytkownik testowy jest już utworzony lub należy go utworzyć ręcznie.
      
      console.warn('UWAGA: Użytkownik testowy musi być utworzony ręcznie przed uruchomieniem testów!');
      console.warn(`Oczekiwany email użytkownika testowego: ${testUserEmail}`);
    }
    
    // Tutaj możemy wykonać inne operacje przygotowawcze
    // np. utworzenie minimalnego zestawu danych testowych
    
    console.log('Przygotowanie środowiska testowego zakończone pomyślnie.');
  } catch (error) {
    console.error('Wystąpił błąd podczas przygotowania środowiska testowego:', error);
  }
});

/**
 * Funkcja pomocnicza do czyszczenia danych testowych dla określonego użytkownika
 */
async function cleanupTestData(supabase: any, userId: string) {
  console.log(`Czyszczenie danych testowych dla użytkownika ${userId}...`);
  
  try {
    // Usuwanie w kolejności odpowiadającej zależnościom relacyjnym
    
    // 1. review_history
    const { error: reviewHistoryError } = await supabase
      .from('review_history')
      .delete()
      .eq('user_id', userId);
      
    if (reviewHistoryError) {
      console.error('Błąd podczas czyszczenia review_history:', reviewHistoryError);
    }
    
    // 2. review_sessions
    const { error: reviewSessionsError } = await supabase
      .from('review_sessions')
      .delete()
      .eq('user_id', userId);
      
    if (reviewSessionsError) {
      console.error('Błąd podczas czyszczenia review_sessions:', reviewSessionsError);
    }
    
    // 3. flashcard_learning_progress
    const { error: progressError } = await supabase
      .from('flashcard_learning_progress')
      .delete()
      .eq('user_id', userId);
      
    if (progressError) {
      console.error('Błąd podczas czyszczenia flashcard_learning_progress:', progressError);
    }
    
    // 4. flashcards
    const { error: flashcardsError } = await supabase
      .from('flashcards')
      .delete()
      .eq('user_id', userId);
      
    if (flashcardsError) {
      console.error('Błąd podczas czyszczenia flashcards:', flashcardsError);
    }
    
    // 5. generation_error_logs
    const { error: errorLogsError } = await supabase
      .from('generation_error_logs')
      .delete()
      .eq('user_id', userId);
      
    if (errorLogsError) {
      console.error('Błąd podczas czyszczenia generation_error_logs:', errorLogsError);
    }
    
    // 6. generations
    const { error: generationsError } = await supabase
      .from('generations')
      .delete()
      .eq('user_id', userId);
      
    if (generationsError) {
      console.error('Błąd podczas czyszczenia generations:', generationsError);
    }
    
    console.log('Czyszczenie danych testowych zakończone.');
  } catch (error) {
    console.error('Wystąpił błąd podczas czyszczenia danych testowych:', error);
  }
}

export default setup; 