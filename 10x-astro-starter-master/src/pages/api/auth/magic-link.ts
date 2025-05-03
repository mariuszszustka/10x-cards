import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase.client.ts';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.json();
    const { email } = formData;
    
    console.log("Próba wysłania magic link dla:", email);

    // Walidacja danych wejściowych
    if (!email) {
      console.log("Brak adresu email");
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Adres email jest wymagany',
        }),
        { status: 400 }
      );
    }

    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Wysłanie magic linku
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true // pozwala utworzyć użytkownika, jeśli nie istnieje
      }
    });

    if (error) {
      console.error("Błąd Supabase przy wysyłaniu magic linku:", error.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Nie udało się wysłać linku do logowania: ${error.message}`,
        }),
        { status: 400 }
      );
    }

    console.log("Magic link wysłany pomyślnie do:", email);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Link do logowania został wysłany na podany adres email',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Błąd podczas wysyłania magic linku:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd podczas wysyłania linku do logowania',
      }),
      { status: 500 }
    );
  }
}; 