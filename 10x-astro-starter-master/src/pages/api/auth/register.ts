import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase.client.ts';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.json();
    const { email, password, confirmPassword } = formData;

    console.log("Próba rejestracji dla:", email);

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
    
    if (password !== confirmPassword) {
      console.log("Hasła nie są zgodne");
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Hasła nie są zgodne',
        }),
        { status: 400 }
      );
    }

    // Walidacja hasła
    if (password.length < 8) {
      console.log("Hasło za krótkie");
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Hasło musi mieć co najmniej 8 znaków',
        }),
        { status: 400 }
      );
    }

    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Rejestracja użytkownika
    console.log("Wywołanie Supabase auth.signUp");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/auth/login`,
      },
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

    console.log("Zarejestrowano pomyślnie, user:", data.user?.id);
    console.log("Status potwierdzenia:", data);

    // Zwracamy dane użytkownika
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Błąd podczas rejestracji:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd podczas rejestracji',
      }),
      { status: 500 }
    );
  }
};

// Funkcja mapująca błędy Supabase na przyjazne komunikaty
function mapSupabaseError(error: any): string {
  switch (error.message) {
    case 'User already registered':
      return 'Użytkownik o podanym adresie email już istnieje';
    case 'Password should be at least 6 characters':
      return 'Hasło powinno mieć co najmniej 6 znaków';
    default:
      return error.message || 'Wystąpił błąd podczas rejestracji';
  }
} 