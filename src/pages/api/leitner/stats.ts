import { createErrorResponse, type LearningStatsDTO, type LeitnerBox } from '@/types';
import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import type { Database } from '@/db/database.types';

// Inicjalizacja klienta Supabase
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tymczasowe rozwiązanie dla uwierzytelniania podczas developmentu
const DEFAULT_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

// Funkcja do uwierzytelniania użytkownika
async function getUser(request: Request) {
  // Tymczasowe uproszczone uwierzytelnianie dla developmentu
  return { 
    id: DEFAULT_USER_ID,
    email: 'test@example.com'
  };
}

/**
 * GET /api/leitner/stats - Pobieranie statystyk nauki
 * Zwraca zagregowane statystyki dotyczące postępu użytkownika w nauce
 */
export const GET: APIRoute = async ({ request }) => {
  try {
    // 1. Ekstrakcja i weryfikacja tokenu użytkownika
    const user = await getUser(request);
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Pobranie liczby fiszek w każdym pudełku Leitnera
    const { data: boxCounts, error: boxCountError } = await supabase
      .from('flashcard_learning_progress')
      .select('leitner_box, count')
      .eq('user_id', user.id)
      .group('leitner_box');

    if (boxCountError) {
      console.error('Błąd podczas pobierania liczby fiszek w pudełkach:', boxCountError);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas pobierania statystyk nauki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Inicjalizacja licznika dla każdego pudełka
    const cardsByBox: Record<LeitnerBox, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };

    // Wypełnienie danych z bazy
    boxCounts.forEach((item) => {
      cardsByBox[item.leitner_box as LeitnerBox] = parseInt(item.count as unknown as string);
    });

    // 4. Pobranie łącznej liczby fiszek
    const { count: totalCards, error: totalCountError } = await supabase
      .from('flashcard_learning_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (totalCountError) {
      console.error('Błąd podczas pobierania łącznej liczby fiszek:', totalCountError);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas pobierania statystyk nauki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Pobranie liczby fiszek do powtórki dzisiaj
    const { count: cardsToReviewToday, error: reviewCountError } = await supabase
      .from('flashcard_learning_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .lte('next_review_at', new Date().toISOString());

    if (reviewCountError) {
      console.error('Błąd podczas pobierania liczby fiszek do powtórki:', reviewCountError);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas pobierania statystyk nauki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Pobranie informacji o sesjach nauki
    const { data: sessionData, error: sessionError } = await supabase
      .from('review_sessions')
      .select('COUNT(*), SUM(cards_reviewed)')
      .eq('user_id', user.id)
      .single();

    if (sessionError) {
      console.error('Błąd podczas pobierania informacji o sesjach:', sessionError);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas pobierania statystyk nauki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const totalSessions = parseInt(sessionData.count as unknown as string) || 0;
    const totalReviews = parseInt(sessionData.sum as unknown as string) || 0;
    
    // 7. Obliczenie średniej liczby fiszek na sesję
    const avgCardsPerSession = totalSessions > 0 ? Math.round(totalReviews / totalSessions * 10) / 10 : 0;

    // 8. Pobranie wskaźnika skuteczności (poprawne odpowiedzi / wszystkie odpowiedzi)
    const { data: historyData, error: historyError } = await supabase
      .from('review_history')
      .select('COUNT(*), SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)')
      .eq('user_id', user.id)
      .single();

    if (historyError) {
      console.error('Błąd podczas pobierania historii odpowiedzi:', historyError);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas pobierania statystyk nauki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const totalAnswers = parseInt(historyData.count as unknown as string) || 0;
    const correctAnswers = parseInt(historyData.sum as unknown as string) || 0;
    
    // Obliczenie wskaźnika skuteczności (w procentach)
    const reviewSuccessRate = totalAnswers > 0 ? Math.round(correctAnswers / totalAnswers * 1000) / 10 : 0;

    // 9. Przygotowanie obiektu wynikowego
    const stats: LearningStatsDTO = {
      total_cards: totalCards || 0,
      cards_by_box: cardsByBox,
      cards_to_review_today: cardsToReviewToday || 0,
      review_success_rate: reviewSuccessRate,
      avg_cards_per_session: avgCardsPerSession,
      total_review_sessions: totalSessions,
      total_reviews: totalReviews
    };

    // 10. Zwrócenie statystyk
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Nieoczekiwany błąd:', error);
    return new Response(
      JSON.stringify(createErrorResponse('server_error', 'Wystąpił nieoczekiwany błąd')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 