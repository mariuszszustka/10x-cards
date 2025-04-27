import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase.client.ts';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.json();
    const { email, password } = formData;
    
    console.log("Próba logowania dla:", email);

    // Walidacja danych wejściowych
    if (!email || !password) {
      console.log("Brak email lub hasła");
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email i hasło są wymagane',
        }),
        { status: 400 }
      );
    }

    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Logowanie użytkownika
    console.log("Wywołanie Supabase auth.signInWithPassword");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Błąd Supabase:", error.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: mapSupabaseError(error),
        }),
        { status: 400 }
      );
    }

    console.log("Zalogowano pomyślnie, user:", data.user.id);

    // Zwracamy dane użytkownika
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd podczas logowania',
      }),
      { status: 500 }
    );
  }
};

// Funkcja mapująca błędy Supabase na przyjazne komunikaty
function mapSupabaseError(error: any): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Nieprawidłowy email lub hasło';
    case 'Email not confirmed':
      return 'Adres email nie został potwierdzony';
    case 'User not found':
      return 'Użytkownik o podanym adresie email nie istnieje';
    default:
      return error.message || 'Wystąpił błąd podczas logowania';
  }
} 