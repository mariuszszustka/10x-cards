/**
 * Mock klienta Supabase do testów E2E
 */

export const mockSupabaseClient = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Symuluj poprawne logowanie dla test-e2e@example.com / Test123!@#
      if (email === 'test-e2e@example.com' && password === 'Test123!@#') {
        return {
          data: {
            user: { id: 'test-user-id', email },
            session: {
              access_token: 'fake-access-token',
              refresh_token: 'fake-refresh-token',
              user: { id: 'test-user-id', email },
              expires_at: Date.now() + 3600 * 1000
            }
          },
          error: null
        };
      }
      
      // Symuluj błąd logowania dla innych kombinacji
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      };
    },
    
    signUp: async ({ email, password }: { email: string; password: string }) => {
      // Symuluj poprawną rejestrację
      return {
        data: { 
          user: { id: `new-user-${Date.now()}`, email },
          session: {
            access_token: 'fake-access-token',
            refresh_token: 'fake-refresh-token',
            user: { id: `new-user-${Date.now()}`, email },
            expires_at: Date.now() + 3600 * 1000
          }
        },
        error: null
      };
    },
    
    signOut: async () => {
      return { error: null };
    },
    
    getSession: async () => {
      return {
        data: {
          session: {
            access_token: 'fake-access-token',
            refresh_token: 'fake-refresh-token',
            user: { id: 'test-user-id', email: 'test-e2e@example.com' },
            expires_at: Date.now() + 3600 * 1000
          }
        },
        error: null
      };
    },
    
    getUser: async () => {
      return {
        data: { user: { id: 'test-user-id', email: 'test-e2e@example.com' } },
        error: null
      };
    }
  }
};

// Funkcja do podmienienia rzeczywistego klienta Supabase na mocka
export function setupSupabaseMock() {
  // Ta funkcja może być wywołana na początku testów E2E
  console.log('Zastępowanie klienta Supabase mockiem dla testów E2E');
  
  // Tutaj możesz dodać kod do modyfikacji globalnych zmiennych
  // jeśli masz dostęp do modułów aplikacji podczas testów
} 