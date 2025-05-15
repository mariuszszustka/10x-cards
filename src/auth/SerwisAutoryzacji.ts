export class SerwisAutoryzacji {
  constructor(private supabase: any) {}

  async zaloguj(email: string, hasło: string) {
    try {
      const result = await this.supabase.auth.signIn({ email, password: hasło });

      if (result.error) {
        return { sukces: false, błąd: result.error.message };
      }

      return {
        sukces: true,
        użytkownik: result.data.user,
        token: result.data.session.access_token,
      };
    } catch (error: any) {
      return { sukces: false, błąd: error.message };
    }
  }

  async zarejestruj(email: string, hasło: string) {
    try {
      const result = await this.supabase.auth.signUp({ email, password: hasło });

      if (result.error) {
        return { sukces: false, błąd: result.error.message };
      }

      return {
        sukces: true,
        użytkownik: result.data.user,
        token: result.data.session.access_token,
      };
    } catch (error: any) {
      return { sukces: false, błąd: error.message };
    }
  }

  async wyloguj() {
    try {
      const result = await this.supabase.auth.signOut();

      if (result.error) {
        return { sukces: false, błąd: result.error.message };
      }

      return { sukces: true };
    } catch (error: any) {
      return { sukces: false, błąd: error.message };
    }
  }

  async odświeżSesję(refreshToken: string) {
    try {
      const result = await this.supabase.auth.refreshSession(refreshToken);

      if (result.error) {
        return { sukces: false, błąd: result.error.message };
      }

      return {
        sukces: true,
        nowyToken: result.data.session.access_token,
      };
    } catch (error: any) {
      return { sukces: false, błąd: error.message };
    }
  }

  async resetujHasło(email: string) {
    try {
      const result = await this.supabase.auth.resetPasswordForEmail(email);

      if (result.error) {
        return { sukces: false, błąd: result.error.message };
      }

      return { sukces: true };
    } catch (error: any) {
      return { sukces: false, błąd: error.message };
    }
  }
}
