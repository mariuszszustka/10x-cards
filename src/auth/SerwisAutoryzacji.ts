export interface DaneUżytkownika {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface OdpowiedźAutoryzacji {
  sukces: boolean;
  komunikat?: string;
  błąd?: string;
  token?: string;
  dane?: DaneUżytkownika;
  użytkownik?: DaneUżytkownika;
  nowyToken?: string;
}

// Definiujemy typy dla Supabase
export interface SupabaseError {
  message: string;
}

export interface SupabaseUser {
  id: string;
  user_metadata?: {
    email?: string;
    name?: string;
  };
}

export interface SupabaseSession {
  access_token: string;
}

export interface SupabaseResult {
  error?: SupabaseError;
  data?: {
    user?: SupabaseUser;
    session?: SupabaseSession;
  };
}

export interface SupabaseClient {
  auth: {
    signIn(credentials: { email: string; password: string }): Promise<SupabaseResult>;
    signUp(credentials: { email: string; password: string }): Promise<SupabaseResult>;
    signOut(): Promise<SupabaseResult>;
    refreshSession(token: string): Promise<SupabaseResult>;
    resetPasswordForEmail(email: string): Promise<SupabaseResult>;
  };
}

export class SerwisAutoryzacji {
  constructor(private supabase: SupabaseClient) {}

  async zaloguj(email: string, hasło: string): Promise<OdpowiedźAutoryzacji> {
    try {
      const result = await this.supabase.auth.signIn({ email, password: hasło });

      if (result.error) {
        return {
          sukces: false,
          błąd: result.error.message,
          komunikat: result.error.message,
        };
      }

      if (!result.data || !result.data.session || !result.data.user) {
        return {
          sukces: false,
          błąd: "Brak danych autentykacji",
          komunikat: "Brak danych autentykacji",
        };
      }

      return {
        sukces: true,
        token: result.data.session.access_token,
        dane: {
          id: result.data.user.id,
          email: result.data.user?.user_metadata?.email,
          name: result.data.user?.user_metadata?.name,
        },
        użytkownik: { id: result.data.user.id }
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        sukces: false,
        błąd: err.message,
        komunikat: err.message,
      };
    }
  }

  async zarejestruj(email: string, hasło: string): Promise<OdpowiedźAutoryzacji> {
    try {
      const result = await this.supabase.auth.signUp({ email, password: hasło });

      if (result.error) {
        return {
          sukces: false,
          błąd: result.error.message,
          komunikat: result.error.message,
        };
      }

      if (!result.data || !result.data.session || !result.data.user) {
        return {
          sukces: false,
          błąd: "Brak danych rejestracji",
          komunikat: "Brak danych rejestracji",
        };
      }

      return {
        sukces: true,
        token: result.data.session.access_token,
        dane: {
          id: result.data.user.id,
          email: result.data.user?.user_metadata?.email,
          name: result.data.user?.user_metadata?.name,
        },
        użytkownik: { id: result.data.user.id }
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        sukces: false,
        błąd: err.message,
        komunikat: err.message,
      };
    }
  }

  async wyloguj(): Promise<OdpowiedźAutoryzacji> {
    try {
      const result = await this.supabase.auth.signOut();

      if (result.error) {
        return { 
          sukces: false, 
          błąd: result.error.message,
          komunikat: result.error.message 
        };
      }

      return { sukces: true };
    } catch (error: unknown) {
      const err = error as Error;
      return { 
        sukces: false, 
        błąd: err.message,
        komunikat: err.message 
      };
    }
  }

  async odświeżSesję(refreshToken: string): Promise<OdpowiedźAutoryzacji> {
    try {
      const result = await this.supabase.auth.refreshSession(refreshToken);

      if (result.error) {
        return { 
          sukces: false, 
          błąd: result.error.message,
          komunikat: result.error.message 
        };
      }

      if (!result.data || !result.data.session) {
        return { 
          sukces: false, 
          błąd: "Nie można odświeżyć sesji",
          komunikat: "Nie można odświeżyć sesji"
        };
      }

      return {
        sukces: true,
        nowyToken: result.data.session.access_token,
      };
    } catch (error: unknown) {
      const err = error as Error;
      return { 
        sukces: false, 
        błąd: err.message,
        komunikat: err.message 
      };
    }
  }

  async resetujHasło(email: string): Promise<OdpowiedźAutoryzacji> {
    try {
      const result = await this.supabase.auth.resetPasswordForEmail(email);

      if (result.error) {
        return {
          sukces: false,
          błąd: result.error.message,
          komunikat: result.error.message,
        };
      }

      return {
        sukces: true,
        komunikat: "Link do resetowania hasła został wysłany na podany adres email",
      };
    } catch (error: unknown) {
      const err = error as Error;
      return {
        sukces: false,
        błąd: err.message,
        komunikat: err.message,
      };
    }
  }
}
