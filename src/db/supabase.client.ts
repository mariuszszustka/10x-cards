import type { AstroCookies } from 'astro';
import { createServerClient, type CookieOptionsWithName, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';
import { getAdjustedSupabaseUrl, getCookieOptions } from '../utils/auth-helper.ts';

// Pobieramy URL z zmiennych środowiskowych
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

// Klient dla komponentów klienckich (bez cookies)
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Opcje cookie dla uwierzytelniania - domyślne
export const cookieOptions: CookieOptionsWithName = {
  path: '/',
  secure: false, // Wyłączamy dla lokalnego środowiska
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 dni
};

// Funkcja pomocnicza do parsowania nagłówka Cookie
function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader.split(';').map((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    return { name, value: rest.join('=') };
  });
}

// Klient dla SSR z obsługą cookies
export const createSupabaseServerInstance = (context: {
  headers: Headers;
  cookies: AstroCookies;
}) => {
  // Pobieramy host z nagłówków żądania
  const requestHost = context.headers.get('host') || '';
  
  // Dostosowujemy URL na podstawie hosta żądania
  const adjustedSupabaseUrl = getAdjustedSupabaseUrl(requestHost);
  
  // Pobieramy dostosowane opcje cookies
  const adjustedCookieOptions = getCookieOptions(requestHost);
  
  console.log(`[Supabase Client] Inicjalizacja z URL: ${adjustedSupabaseUrl} dla hosta: ${requestHost}`);
  
  const supabase = createServerClient<Database>(
    adjustedSupabaseUrl,
    supabaseAnonKey,
    {
      cookieOptions: {
        ...cookieOptions,
        ...adjustedCookieOptions
      },
      cookies: {
        getAll() {
          return parseCookieHeader(context.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            context.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return supabase;
}; 