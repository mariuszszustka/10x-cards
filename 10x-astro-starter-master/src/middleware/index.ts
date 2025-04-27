import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerInstance } from '../db/supabase.client.ts';

// Ścieżki publiczne - dostępne bez logowania
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/update-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/reset-password',
  '/api/auth/update-password'
];

export const onRequest = defineMiddleware(
  async ({ locals, cookies, url, request, redirect }, next) => {
    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // Zapisujemy instancję do locals dla późniejszego użycia w komponentach
    locals.supabase = supabase;

    // Sprawdzanie ścieżek publicznych - nie wymagają autoryzacji
    if (PUBLIC_PATHS.some(path => url.pathname === path || url.pathname.startsWith(path + '/'))) {
      return next();
    }

    // Sprawdzenie sesji użytkownika
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Zapisujemy dane użytkownika do locals
      locals.user = {
        id: user.id,
        email: user.email,
      };
      return next();
    } else {
      // Przekierowanie do logowania
      return redirect('/auth/login');
    }
  }
); 