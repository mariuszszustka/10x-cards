import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerInstance } from '../db/supabase.client.ts';
import { getSessionCookieName, getAdjustedSupabaseUrl } from '../utils/auth-helper.ts';

// Ścieżki publiczne - dostępne bez logowania
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/update-password',
  '/auth/callback',
  '/auth/debug',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/reset-password',
  '/api/auth/update-password',
  '/api/auth/magic-link'
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    console.log("[Middleware] Przetwarzanie ścieżki:", url.pathname);
    
    // Pobierz host z żądania
    const requestHost = request.headers.get('host') || '';
    
    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Zapisujemy instancję do locals dla późniejszego użycia w komponentach
    locals.supabase = supabase;
    
    // Diagnostyka: sprawdź ciasteczka sesji
    const cookieHeader = request.headers.get('Cookie') || '';
    const sessionCookieName = getSessionCookieName(requestHost);
    const hasCookie = cookieHeader.includes(sessionCookieName);
    console.log("[Middleware] Ciasteczko sesji w zapytaniu:", hasCookie ? "Tak" : "Nie");
    console.log("[Middleware] Szukana nazwa ciasteczka:", sessionCookieName);
    
    // Sprawdź czy mamy alternatywne ciasteczko sesji
    const hasBackupCookie = cookieHeader.includes('auth-session') || cookieHeader.includes('session=');
    if (!hasCookie && hasBackupCookie) {
      console.log("[Middleware] Znaleziono alternatywne ciasteczko sesji");
    }
    
    // Opcjonalnie, wyświetl wszystkie ciasteczka w żądaniu
    if (cookieHeader) {
      console.log("[Middleware] Wszystkie ciasteczka:", cookieHeader);
    }

    // Sprawdzanie ścieżek publicznych - nie wymagają autoryzacji
    if (PUBLIC_PATHS.some(path => url.pathname === path || url.pathname.startsWith(path + '/'))) {
      console.log("[Middleware] Ścieżka publiczna - zezwalam bez autoryzacji");
      
      // Dodajemy skrypt do sprawdzenia localStorage tylko dla stron logowania
      if (url.pathname === '/auth/login') {
        return next().then(response => {
          if (response.headers.get('content-type')?.includes('text/html')) {
            return response.text().then(html => {
              const script = `
              <script>
                // Sprawdź czy jest sesja w localStorage dla strony logowania
                if (localStorage.getItem('userId') && localStorage.getItem('authSession')) {
                  console.log('Znaleziono sesję w localStorage, przekierowuję na dashboard');
                  window.location.href = '/dashboard';
                }
              </script>
              `;
              const modifiedHtml = html.replace('</body>', `${script}</body>`);
              return new Response(modifiedHtml, {
                status: response.status,
                headers: response.headers
              });
            });
          }
          return response;
        });
      }
      
      return next();
    }

    // Sprawdzenie sesji użytkownika - najpierw z bieżącej sesji
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (session) {
      // Użytkownik ma aktywną sesję
      console.log("[Middleware] Znaleziono sesję użytkownika:", session.user.id);
      console.log("[Middleware] Session expires at:", session.expires_at ? new Date(session.expires_at * 1000).toISOString() : "nie ustawiono");
      
      // Zapisujemy dane użytkownika do locals
      locals.user = {
        id: session.user.id,
        email: session.user.email || null,
      };
      return next();
    }

    // Jeśli nie ma sesji, ale jest cookie auth-session, spróbuj załadować sesję ręcznie
    if (!session && hasBackupCookie) {
      console.log("[Middleware] Próba odzyskania sesji z alternatywnego ciasteczka");
      
      try {
        // Próba parsowania alternatywnego ciasteczka
        const authSessionCookie = cookieHeader.split(';')
          .find(cookie => cookie.trim().startsWith('auth-session='));
        
        if (authSessionCookie) {
          const authSessionValue = authSessionCookie.split('=').slice(1).join('=').trim();
          const authSessionData = JSON.parse(decodeURIComponent(authSessionValue));
          
          if (authSessionData && authSessionData.user && authSessionData.user.id) {
            console.log("[Middleware] Odzyskano dane użytkownika z auth-session:", authSessionData.user.id);
            
            // Ustaw sesję ręcznie
            const { data: manualSessionData, error: setSessionError } = await supabase.auth.setSession({
              access_token: authSessionData.access_token || '',
              refresh_token: authSessionData.refresh_token || ''
            });
            
            if (!setSessionError && manualSessionData.user) {
              console.log("[Middleware] Ręcznie ustawiono sesję dla:", manualSessionData.user.id);
              
              locals.user = {
                id: manualSessionData.user.id,
                email: manualSessionData.user.email || null,
              };
              
              return next();
            } else if (setSessionError) {
              console.error("[Middleware] Błąd przy ręcznym ustawianiu sesji:", setSessionError.message);
            }
          }
        }
      } catch (e) {
        console.error("[Middleware] Błąd odzyskiwania sesji z alternatywnego ciasteczka:", e);
      }
    }

    // Sprawdź, czy to jest strona dashboard i dodaj skrypt localStorage
    if (url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/')) {
      return next().then(response => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          return response.text().then(html => {
            const script = `
            <script>
              // Sprawdź, czy mamy dane sesji w localStorage
              const authSession = localStorage.getItem('authSession');
              const userId = localStorage.getItem('userId');
              const userEmail = localStorage.getItem('userEmail');
              
              if (authSession && userId) {
                console.log("Znaleziono sesję w localStorage, ustawiając dane użytkownika");
                
                // Ustaw informacje o użytkowniku w aplikacji
                window.userSession = {
                  user: {
                    id: userId,
                    email: userEmail || ''
                  },
                  isAuthenticated: true
                };
              } else {
                // Brak sesji, przekieruj na stronę logowania
                window.location.href = '/auth/login';
              }
            </script>
            `;
            const modifiedHtml = html.replace('</body>', `${script}</body>`);
            return new Response(modifiedHtml, {
              status: response.status,
              headers: response.headers
            });
          });
        }
        return response;
      });
    }

    // Brak sesji i nie jest to strona dashboard - przekieruj na logowanie
    console.log("[Middleware] Brak autoryzacji - przekierowuję do logowania");
    return redirect('/auth/login');
  }
);

// Funkcja pomocnicza do parsowania ciasteczek
function parseCookieString(cookieStr: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieStr.split(';').forEach(cookie => {
    const parts = cookie.trim().split('=');
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      cookies[name] = value;
    }
  });
  return cookies;
} 