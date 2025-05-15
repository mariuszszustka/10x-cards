export class ObsługaJWT {
  private readonly TOKEN_KEY = "auth_token";

  zapiszToken(token: string): boolean {
    if (!token) {
      return false;
    }

    localStorage.setItem(this.TOKEN_KEY, token);
    return true;
  }

  pobierzToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  usuńToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  zweryfikujToken(token: string): { ważny: boolean; dane?: any; błąd?: string } {
    if (!token || token === "nieprawidłowy_token") {
      return { ważny: false, błąd: "Token ma nieprawidłowy format" };
    }

    try {
      // Symulacja dekodowania tokenu JWT
      const części = token.split(".");
      if (części.length !== 3) {
        return { ważny: false, błąd: "Token ma nieprawidłowy format" };
      }

      const payload = JSON.parse(atob(części[1]));
      const teraz = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < teraz) {
        return { ważny: false, błąd: "Token wygasł" };
      }

      return { ważny: true, dane: payload };
    } catch (error) {
      return { ważny: false, błąd: "Błąd podczas weryfikacji tokenu" };
    }
  }

  pozostałyCzasDo(token: string): number {
    try {
      const części = token.split(".");
      if (części.length !== 3) {
        return -1;
      }

      const payload = JSON.parse(atob(części[1]));
      const teraz = Math.floor(Date.now() / 1000);

      if (!payload.exp) {
        return -1;
      }

      return payload.exp - teraz;
    } catch (error) {
      return -1;
    }
  }
}
