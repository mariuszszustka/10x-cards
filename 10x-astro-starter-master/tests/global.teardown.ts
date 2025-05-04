import { test as teardown } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/db/database.types';

/**
 * Funkcja czyszcząca bazę danych po wykonaniu testów E2E
 * 
 * Usuwa wszystkie dane testowe, które mogły zostać utworzone podczas testów,
 * zachowując odpowiednią kolejność usuwania by respektować klucze obce.
 */
teardown('Czyszczenie bazy danych po testach', async ({ }) => {
  console.log('Rozpoczynam czyszczenie bazy danych testowej...');

  // Tworzenie klienta Supabase z danymi testowymi
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Brak zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY. Nie można połączyć z bazą.');
    return;
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  try {
    // Uruchomienie wszystkich operacji czyszczących w ramach jednej transakcji
    // (w miarę możliwości)
    
    // Usuwanie danych z tabel - zachowujemy kolejność ze względu na zależności
    
    // 1. Najpierw usuwamy historię przeglądania
    console.log('Usuwanie danych z tabeli review_history...');
    const { error: reviewHistoryError } = await supabase
      .from('review_history')
      .delete()
      .eq('user_id', process.env.TEST_USER_ID || '');
      
    if (reviewHistoryError) {
      console.error('Błąd podczas usuwania z review_history:', reviewHistoryError);
    }

    // 2. Następnie usuwamy sesje przeglądania
    console.log('Usuwanie danych z tabeli review_sessions...');
    const { error: reviewSessionsError } = await supabase
      .from('review_sessions')
      .delete()
      .eq('user_id', process.env.TEST_USER_ID || '');
      
    if (reviewSessionsError) {
      console.error('Błąd podczas usuwania z review_sessions:', reviewSessionsError);
    }

    // 3. Usuwamy postęp nauki fiszek
    console.log('Usuwanie danych z tabeli flashcard_learning_progress...');
    const { error: progressError } = await supabase
      .from('flashcard_learning_progress')
      .delete()
      .eq('user_id', process.env.TEST_USER_ID || '');
      
    if (progressError) {
      console.error('Błąd podczas usuwania z flashcard_learning_progress:', progressError);
    }

    // 4. Usuwamy fiszki
    console.log('Usuwanie danych z tabeli flashcards...');
    const { error: flashcardsError } = await supabase
      .from('flashcards')
      .delete()
      .eq('user_id', process.env.TEST_USER_ID || '');
      
    if (flashcardsError) {
      console.error('Błąd podczas usuwania z flashcards:', flashcardsError);
    }

    // 5. Usuwamy logi błędów generacji
    console.log('Usuwanie danych z tabeli generation_error_logs...');
    const { error: errorLogsError } = await supabase
      .from('generation_error_logs')
      .delete()
      .eq('user_id', process.env.TEST_USER_ID || '');
      
    if (errorLogsError) {
      console.error('Błąd podczas usuwania z generation_error_logs:', errorLogsError);
    }

    // 6. Usuwamy generacje
    console.log('Usuwanie danych z tabeli generations...');
    const { error: generationsError } = await supabase
      .from('generations')
      .delete()
      .eq('user_id', process.env.TEST_USER_ID || '');
      
    if (generationsError) {
      console.error('Błąd podczas usuwania z generations:', generationsError);
    }

    // 7. Opcjonalnie - usuwanie testowego użytkownika (zwykle nie robimy tego w testach E2E)
    // Jeśli chcemy usunąć użytkownika testowego, należy odkomentować ten kod
    /*
    console.log('Usuwanie testowego użytkownika...');
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', process.env.TEST_USER_ID || '');
      
    if (userError) {
      console.error('Błąd podczas usuwania użytkownika testowego:', userError);
    }
    */

    console.log('Czyszczenie bazy danych testowej zakończone pomyślnie.');
  } catch (error) {
    console.error('Wystąpił błąd podczas czyszczenia bazy danych:', error);
  }
});

export default teardown; 