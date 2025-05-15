import { describe, it, expect, vi, beforeEach } from "vitest";
import { SerwisAutoryzacji } from "../SerwisAutoryzacji";
import type {
  SupabaseClient,
  SupabaseResult,
  SupabaseError,
  SupabaseUser,
  SupabaseSession,
} from "../SerwisAutoryzacji";

// Interfejs dla mocka Supabase
interface MockSupabaseAuth {
  signUp: ReturnType<typeof vi.fn<[{ email: string; password: string }], Promise<SupabaseResult>>>;
  signIn: ReturnType<typeof vi.fn<[{ email: string; password: string }], Promise<SupabaseResult>>>;
  signOut: ReturnType<typeof vi.fn<[], Promise<SupabaseResult>>>;
  refreshSession: ReturnType<typeof vi.fn<[string], Promise<SupabaseResult>>>;
  resetPasswordForEmail: ReturnType<typeof vi.fn<[string], Promise<SupabaseResult>>>;
}

interface MockSupabase extends SupabaseClient {
  auth: MockSupabaseAuth;
}

// Mock Supabase
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      refreshSession: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  }),
}));

describe("SerwisAutoryzacji", () => {
  let serwisAutoryzacji: SerwisAutoryzacji;
  let mockSupabase: MockSupabase;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signUp: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
        refreshSession: vi.fn(),
        resetPasswordForEmail: vi.fn(),
      },
    };

    serwisAutoryzacji = new SerwisAutoryzacji(mockSupabase);
  });

  describe("logowanie", () => {
    it("powinien zalogować użytkownika z prawidłowymi danymi", async () => {
      // Arrange
      const email = "test@example.com";
      const hasło = "Hasło123!";
      mockSupabase.auth.signIn.mockResolvedValue({
        data: {
          user: { id: "123" } as SupabaseUser,
          session: { access_token: "token123" } as SupabaseSession,
        },
        error: undefined,
      });

      // Act
      const wynik = await serwisAutoryzacji.zaloguj(email, hasło);

      // Assert
      expect(mockSupabase.auth.signIn).toHaveBeenCalledWith({ email, password: hasło });
      expect(wynik.sukces).toBe(true);
      expect(wynik.użytkownik).toEqual({ id: "123" });
    });

    it("powinien zwrócić błąd gdy dane logowania są nieprawidłowe", async () => {
      // Arrange
      mockSupabase.auth.signIn.mockResolvedValue({
        data: undefined,
        error: { message: "Invalid login credentials" } as SupabaseError,
      });

      // Act
      const wynik = await serwisAutoryzacji.zaloguj("test@example.com", "złe_hasło");

      // Assert
      expect(wynik.sukces).toBe(false);
      expect(wynik.błąd).toBe("Invalid login credentials");
    });
  });

  describe("rejestracja", () => {
    it("powinien zarejestrować nowego użytkownika", async () => {
      // Arrange
      const email = "nowy@example.com";
      const hasło = "NoweHasło123!";
      mockSupabase.auth.signUp.mockResolvedValue({
        data: {
          user: { id: "456" } as SupabaseUser,
          session: { access_token: "token456" } as SupabaseSession,
        },
        error: undefined,
      });

      // Act
      const wynik = await serwisAutoryzacji.zarejestruj(email, hasło);

      // Assert
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({ email, password: hasło });
      expect(wynik.sukces).toBe(true);
      expect(wynik.użytkownik).toEqual({ id: "456" });
    });

    it("powinien zwrócić błąd gdy email już istnieje", async () => {
      // Arrange
      mockSupabase.auth.signUp.mockResolvedValue({
        data: undefined,
        error: { message: "User already registered" } as SupabaseError,
      });

      // Act
      const wynik = await serwisAutoryzacji.zarejestruj("istniejący@example.com", "Hasło123!");

      // Assert
      expect(wynik.sukces).toBe(false);
      expect(wynik.błąd).toBe("User already registered");
    });
  });

  describe("wylogowanie", () => {
    it("powinien wylogować użytkownika", async () => {
      // Arrange
      mockSupabase.auth.signOut.mockResolvedValue({ error: undefined });

      // Act
      const wynik = await serwisAutoryzacji.wyloguj();

      // Assert
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(wynik.sukces).toBe(true);
    });
  });

  describe("odświeżanie sesji", () => {
    it("powinien odświeżyć sesję z ważnym refresh tokenem", async () => {
      // Arrange
      mockSupabase.auth.refreshSession.mockResolvedValue({
        data: {
          session: { access_token: "nowy_token" } as SupabaseSession,
        },
        error: undefined,
      });

      // Act
      const wynik = await serwisAutoryzacji.odświeżSesję("refresh_token");

      // Assert
      expect(mockSupabase.auth.refreshSession).toHaveBeenCalledWith("refresh_token");
      expect(wynik.sukces).toBe(true);
      expect(wynik.nowyToken).toBe("nowy_token");
    });

    it("powinien zwrócić błąd gdy refresh token wygasł", async () => {
      // Arrange
      mockSupabase.auth.refreshSession.mockResolvedValue({
        data: undefined,
        error: { message: "Refresh token has expired" } as SupabaseError,
      });

      // Act
      const wynik = await serwisAutoryzacji.odświeżSesję("wygasły_token");

      // Assert
      expect(wynik.sukces).toBe(false);
      expect(wynik.błąd).toBe("Refresh token has expired");
    });
  });

  describe("resetowanie hasła", () => {
    it("powinien wysłać link do resetowania hasła na podany email", async () => {
      // Arrange
      const email = "reset@example.com";
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: undefined });

      // Act
      const wynik = await serwisAutoryzacji.resetujHasło(email);

      // Assert
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(email);
      expect(wynik.sukces).toBe(true);
    });

    it("powinien obsłużyć błąd gdy email nie istnieje", async () => {
      // Arrange
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: "Email not found" } as SupabaseError,
      });

      // Act
      const wynik = await serwisAutoryzacji.resetujHasło("nieistnieje@example.com");

      // Assert
      expect(wynik.sukces).toBe(false);
      expect(wynik.błąd).toBe("Email not found");
    });
  });
});
