import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase.client.ts';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.json();
    const { email } = formData;

    // Walidacja danych wejściowych
    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email jest wymagany',
        }),
        { status: 400 }
      );
    }

    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Żądanie resetowania hasła
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${new URL(request.url).origin}/auth/update-password`,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || 'Wystąpił błąd podczas resetowania hasła',
        }),
        { status: 400 }
      );
    }

    // UWAGA: W MVP dla demonstracji generujemy example token
    // W produkcyjnej wersji email byłby wysyłany automatycznie przez Supabase
    const exampleToken = `example-token-for-${email.replace('@', '-at-')}`;
    const resetUrl = `${new URL(request.url).origin}/auth/update-password?token=${exampleToken}`;

    // Zwracamy token dla MVP
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Link do resetowania hasła został wysłany',
        resetUrl, // Tylko dla MVP
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Błąd podczas żądania resetowania hasła:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd podczas żądania resetowania hasła',
      }),
      { status: 500 }
    );
  }
}; 