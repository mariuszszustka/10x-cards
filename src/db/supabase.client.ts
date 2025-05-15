import type { AstroCookies } from "astro";
import { createServerClient, type CookieOptionsWithName, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.ts";
import { getAdjustedSupabaseUrl, getCookieOptions } from "../utils/auth-helper.ts";

// Diagnostyka - wyświetlamy zmienne środowiskowe
console.log("[Diagnostyka] import.meta.env.SUPABASE_URL =", import.meta.env.SUPABASE_URL);
console.log("[Diagnostyka] import.meta.env.SUPABASE_KEY =", import.meta.env.SUPABASE_KEY);
console.log("[Diagnostyka] import.meta.env.SUPABASE_ANON_KEY =", import.meta.env.SUPABASE_ANON_KEY);
console.log("[Diagnostyka] Wszystkie zmienne env =", JSON.stringify(import.meta.env, null, 2));

// Pobieramy URL z zmiennych środowiskowych lub używamy wartości domyślnych dla testów
const supabaseUrl = import.meta.env.SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey = import.meta.env.SUPABASE_KEY || import.meta.env.SUPABASE_ANON_KEY || "dummy-key-for-testing";

// Sprawdzamy, czy klucze są dostępne
if (!supabaseUrl || supabaseUrl === "https://example.supabase.co")
  console.warn("[OSTRZEŻENIE] Używam domyślnego SUPABASE_URL - to może być problem w produkcji!");
if (!supabaseAnonKey || supabaseAnonKey === "dummy-key-for-testing")
  console.warn("[OSTRZEŻENIE] Używam domyślnego SUPABASE_KEY - to może być problem w produkcji!");

// Klient dla komponentów klienckich (bez cookies)
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Opcje cookie dla uwierzytelniania - domyślne
export const cookieOptions: CookieOptionsWithName = {
  path: "/",
  secure: false, // Wyłączamy dla lokalnego środowiska
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7, // 7 dni
};

// Funkcja pomocnicza do parsowania nagłówka Cookie
function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

// Klient dla SSR z obsługą cookies
export const createSupabaseServerInstance = (context: { headers: Headers; cookies: AstroCookies }) => {
  // Pobieramy host z nagłówków żądania
  const requestHost = context.headers.get("host") || "";

  // Dostosowujemy URL na podstawie hosta żądania
  const adjustedSupabaseUrl = getAdjustedSupabaseUrl(requestHost);

  // Pobieramy dostosowane opcje cookies
  const adjustedCookieOptions = getCookieOptions(requestHost);

  console.log(`[Supabase Client] Inicjalizacja z URL: ${adjustedSupabaseUrl} dla hosta: ${requestHost}`);
  console.log(`[Supabase Client] Używany klucz: ${supabaseAnonKey ? "DOSTĘPNY" : "BRAK KLUCZA"}`);

  const supabase = createServerClient<Database>(adjustedSupabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      ...cookieOptions,
      ...adjustedCookieOptions,
    },
    cookies: {
      getAll() {
        return parseCookieHeader(context.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => context.cookies.set(name, value, options));
      },
    },
  });

  return supabase;
};
