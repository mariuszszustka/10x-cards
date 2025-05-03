import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase.client.ts';
import { getSessionCookieName } from '../../../utils/auth-helper.ts';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    // Pobieramy host z nagłówków żądania
    const requestHost = request.headers.get('host') || '';
    console.log("[Logout] Host żądania:", requestHost);
    
    // Dostosowana nazwa ciasteczka sesji
    const sessionCookieName = getSessionCookieName(requestHost);
    console.log("[Logout] Usuwanie ciasteczka:", sessionCookieName);
    
    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Wylogowanie użytkownika
    const { error } = await supabase.auth.signOut();

    // Ręcznie usuwamy cookie
    cookies.delete(sessionCookieName, { path: '/' });

    if (error) {
      console.error("[Logout] Błąd wylogowania:", error.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || 'Wystąpił błąd podczas wylogowania',
        }),
        { status: 400 }
      );
    }

    console.log("[Logout] Pomyślnie wylogowano użytkownika");
    
    // Przekierowanie do strony logowania
    return redirect('/auth/login');
  } catch (error) {
    console.error('Błąd podczas wylogowania:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Wystąpił nieoczekiwany błąd podczas wylogowania',
      }),
      { status: 500 }
    );
  }
}; 