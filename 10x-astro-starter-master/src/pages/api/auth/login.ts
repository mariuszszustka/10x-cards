import type { APIRoute } from 'astro';
import { createSupabaseServerInstance } from '../../../db/supabase.client.ts';
import { getSessionCookieName, setSessionCookie, getAdjustedSupabaseUrl } from '../../../utils/auth-helper.ts';

// Importujemy URL Supabase z zmiennych środowiskowych
const supabaseUrl = import.meta.env.SUPABASE_URL;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.json();
    const { email, password } = formData;
    
    // Pobieramy host z nagłówków żądania
    const requestHost = request.headers.get('host') || '';
    console.log("Host żądania:", requestHost);
    
    // Dostosowany URL Supabase
    const adjustedSupabaseUrl = getAdjustedSupabaseUrl(requestHost);
    console.log("Dostosowany URL Supabase:", adjustedSupabaseUrl);
    
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

    // Najpierw spróbujmy standardowego logowania
    console.log("Wywołanie Supabase auth.signInWithPassword");
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Jeśli się udało, przekieruj na dashboard
    if (!error) {
      console.log("Zalogowano pomyślnie, user:", data.user?.id || "brak ID");
      
      // Dostosowana nazwa ciasteczka sesji
      const cookieName = getSessionCookieName(requestHost);
      console.log("Nazwa ciasteczka sesji dla tego środowiska:", cookieName);
      
      // Ustaw flagi session
      const { data: userData, error: userError } = await supabase.auth.setSession({
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
      });
      
      if (userError) {
        console.error("Błąd przy ustawianiu sesji:", userError.message);
      } else {
        console.log("Sesja ustawiona pomyślnie dla użytkownika:", userData.user?.id);
      }
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.error("Sesja nie została utworzona pomimo udanego logowania");
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Problem z utworzeniem sesji. Spróbuj ponownie.',
          }),
          { status: 500 }
        );
      }
      
      // Bezpośrednio ustawiamy cookies sesji - kluczowy krok
      setSessionCookie(cookies, requestHost, sessionData.session);
      
      // Dodatkowo zapisujemy dane sesji w zwykłym niepodpisanym ciasteczku
      // jako alternatywna metoda odzyskiwania sesji (dla planu B)
      cookies.set('session', JSON.stringify({
        user_id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_at: sessionData.session.expires_at
      }), {
        path: '/',
        secure: false,
        sameSite: 'lax',
        httpOnly: false, // Pozwalamy na dostęp przez JavaScript
        maxAge: 60 * 60 * 24 * 7 // 7 dni
      });
      
      console.log("Utworzono sesję, session_id:", sessionData.session.user.id);
      
      // Przygotowanie danych sesji do zwrócenia
      const sessionJSON = {
        success: true,
        session: {
          user_id: sessionData.session.user.id,
          email: sessionData.session.user.email,
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_at: sessionData.session.expires_at
        }
      };
      
      // Zwróć dane sesji jako JSON zamiast przekierowywać
      return new Response(JSON.stringify(sessionJSON), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    // Dla MVP: Automatyczne tworzenie i logowanie użytkownika z pominięciem weryfikacji
    if (error && (error.message === 'Email not confirmed' || error.message === 'Invalid login credentials')) {
      console.log("Problem z logowaniem, próbujemy alternatywnej metody...");

      // Najpierw spróbujmy utworzyć nowego użytkownika (jeśli taki nie istnieje)
      const { data: newUserData, error: newUserError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_mvp_user: true // marker dla użytkowników MVP
          }
        }
      });

      if (newUserError && newUserError.message !== 'User already registered') {
        console.error("Błąd podczas próby utworzenia użytkownika:", newUserError.message);
      } else {
        console.log("Utworzono użytkownika lub już istnieje");
      }

      // Jako ostatnia opcja, próbujemy logowania bez hasła (magic link)
      console.log("Próba logowania przez OTP...");
      
      // Jeśli wszystko inne zawiedzie, pozwólmy użytkownikowi zalogować się przez magiczny link
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true
        }
      });

      if (otpError) {
        console.error("Błąd OTP:", otpError.message);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Nie udało się zalogować. Spróbuj użyć magicznego linku wysłanego na Twój email."
          }),
          { status: 400 }
        );
      }

      // Jeśli OTP się powiodło
      return new Response(
        JSON.stringify({
          success: true,
          message: "Wysłaliśmy na Twój adres email link do logowania. Sprawdź swoją skrzynkę odbiorczą i kliknij w link, aby się zalogować."
        }),
        { status: 200 }
      );
    }

    // Jeśli wystąpił inny błąd niż niepotwierdzone konto
    console.error("Błąd Supabase:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: mapSupabaseError(error),
      }),
      { status: 400 }
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
      return 'Adres email nie został potwierdzony. Sprawdź swoją skrzynkę email.';
    case 'User not found':
      return 'Użytkownik o podanym adresie email nie istnieje';
    default:
      return error.message || 'Wystąpił błąd podczas logowania';
  }
} 