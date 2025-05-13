import { createClient } from '@supabase/supabase-js';
import type { CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

// Diagnostyka
console.log('[auth-helper] Sprawdzam zmienne środowiskowe:');
console.log('SUPABASE_URL =', import.meta.env.SUPABASE_URL);
console.log('SUPABASE_KEY =', import.meta.env.SUPABASE_KEY ? 'ISTNIEJE' : 'BRAK');
console.log('SUPABASE_ANON_KEY =', import.meta.env.SUPABASE_ANON_KEY ? 'ISTNIEJE' : 'BRAK');

// Stałe
const LOCAL_SUPABASE_URL = (import.meta.env.SUPABASE_URL || 'https://example.supabase.co') as string;
const SUPABASE_KEY = (import.meta.env.SUPABASE_KEY || import.meta.env.SUPABASE_ANON_KEY || 'dummy-key-for-testing') as string;

if (!LOCAL_SUPABASE_URL || LOCAL_SUPABASE_URL === 'https://example.supabase.co') {
  console.warn('[OSTRZEŻENIE] Używam domyślnego SUPABASE_URL w auth-helper - to może być problem w produkcji!');
}
if (!SUPABASE_KEY || SUPABASE_KEY === 'dummy-key-for-testing') {
  console.warn('[OSTRZEŻENIE] Używam domyślnego SUPABASE_KEY w auth-helper - to może być problem w produkcji!');
}

// Dostosowanie URL dla różnych środowisk
export function getAdjustedSupabaseUrl(requestHost: string): string {
  // Jeśli mamy dostęp z zewnętrznego IP, dostosuj URL do tego samego IP
  if (requestHost && 
      requestHost.includes('192.168.') && 
      LOCAL_SUPABASE_URL.includes('127.0.0.1')) {
    
    // Wyciągnij IP hosta z requestHost
    const hostParts = requestHost.split(':');
    const hostIP = hostParts[0]; // np. 192.168.0.169
    
    // Zamień 127.0.0.1 na konkretny adres IP w sieci lokalnej
    return LOCAL_SUPABASE_URL.replace('127.0.0.1', hostIP);
  }
  
  return LOCAL_SUPABASE_URL;
}

// Dostosowanie nazwy ciasteczka sesji w zależności od środowiska
export function getSessionCookieName(requestHost: string): string {
  // W celu uproszczenia obsługi sesji i rozwiązania problemów z różnymi
  // nazwami ciasteczek w zależności od sieci, używamy zawsze tej samej nazwy
  return 'sb-auth-token';

  // Poniższy kod jest wyłączony dla stabilności (używaliśmy różnych nazw w zależności od IP)
  /*
  const supabaseUrl = getAdjustedSupabaseUrl(requestHost);
  
  try {
    // Wyciągamy tylko część IP bez portu dla nazwy ciasteczka
    const hostname = new URL(supabaseUrl).hostname;
    // W przypadku adresów IP, bierzemy tylko pierwszą część (np. 192 z 192.168.0.169)
    // aby zapewnić spójność między różnymi adresami w sieci
    const domainPart = hostname.split('.')[0];
    return `sb-${domainPart}-auth-token`;
  } catch (e) {
    console.error("Błąd przy generowaniu nazwy ciasteczka:", e);
    return 'sb-auth-token';
  }
  */
}

// Opcje ciasteczek dostosowane do środowiska
export function getCookieOptions(requestHost: string): CookieOptions {
  const isLocalhost = requestHost.includes('127.0.0.1') || 
                      requestHost.includes('localhost') ||
                      requestHost.includes('192.168.');
  
  // Dla lokalnego środowiska używamy tych samych ustawień co dla produkcyjnego,
  // ale z wyłączoną flagą secure
  return {
    path: '/',
    secure: false, // Wyłączamy dla lokalnego środowiska
    httpOnly: true, // Używamy httpOnly dla bezpieczeństwa
    sameSite: 'lax', // Używamy lax zamiast none, żeby uniknąć problemów cross-site
    maxAge: 60 * 60 * 24 * 7, // 7 dni
  };
}

// Funkcja do ustawiania ciasteczka sesji bezpośrednio
export function setSessionCookie(
  cookies: AstroCookies, 
  requestHost: string, 
  sessionData: any
): void {
  const cookieName = getSessionCookieName(requestHost);
  const cookieOptions = getCookieOptions(requestHost);
  
  console.log(`Ustawianie ciasteczka: ${cookieName} z opcjami:`, cookieOptions);
  
  // Usuń poprzednie ciasteczko jeśli istnieje
  cookies.delete(cookieName, { path: '/' });
  cookies.delete('auth-session', { path: '/' });
  
  // Ustaw nowe ciasteczko z odpowiednimi opcjami - bez kodowania URL
  cookies.set(cookieName, JSON.stringify(sessionData), cookieOptions);
  
  // Dodatkowo ustaw ogólne ciasteczko sesji jako backup - również bez kodowania URL
  cookies.set('auth-session', JSON.stringify(sessionData), cookieOptions);
  
  console.log(`Ustawiono ciasteczka sesji: ${cookieName} i auth-session`);
}

// Funkcja zwracająca klienta Supabase z odpowiednim URL
export function getSupabaseClient(requestHost: string) {
  const supabaseUrl = getAdjustedSupabaseUrl(requestHost);
  console.log(`Inicjalizacja klienta Supabase z URL: ${supabaseUrl}`);
  
  return createClient(supabaseUrl, SUPABASE_KEY);
} 