import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObsługaJWT } from "../ObsługaJWT";

interface MockStorage {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
}

describe("ObsługaJWT", () => {
  let obsługaJWT: ObsługaJWT;
  let mockLocalStorage: MockStorage;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    // @ts-ignore - pomijamy błąd typowania dla localStorage w testach
    global.localStorage = mockLocalStorage;
    obsługaJWT = new ObsługaJWT();
  });

  describe("zapisywanie tokenu", () => {
    it("powinien zapisać token JWT w localStorage", () => {
      // Arrange
      const token = "jwt_token_123";

      // Act
      obsługaJWT.zapiszToken(token);

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("auth_token", token);
    });

    it("nie powinien zapisać pustego tokenu", () => {
      // Act
      const wynik = obsługaJWT.zapiszToken("");

      // Assert
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(wynik).toBe(false);
    });
  });

  describe("pobieranie tokenu", () => {
    it("powinien pobrać token z localStorage", () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue("zapisany_token");

      // Act
      const token = obsługaJWT.pobierzToken();

      // Assert
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("auth_token");
      expect(token).toBe("zapisany_token");
    });

    it("powinien zwrócić null gdy token nie istnieje", () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null);

      // Act
      const token = obsługaJWT.pobierzToken();

      // Assert
      expect(token).toBeNull();
    });
  });

  describe("usuwanie tokenu", () => {
    it("powinien usunąć token z localStorage", () => {
      // Act
      obsługaJWT.usuńToken();

      // Assert
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");
    });
  });

  describe("weryfikacja tokenu", () => {
    it("powinien zweryfikować ważny token", () => {
      // Arrange
      const ważnyToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbiBLb3dhbHNraSIsImV4cCI6MTk1ODMyNDgwMH0.FPFEt9S16MZgIh0LrQmGsQj9uWa6GwRxlOw4iZ6ulAo";

      // Act
      const wynik = obsługaJWT.zweryfikujToken(ważnyToken);

      // Assert
      expect(wynik.ważny).toBe(true);
      expect(wynik.dane).toHaveProperty("name", "Jan Kowalski");
    });

    it("powinien odrzucić wygasły token", () => {
      // Arrange
      const wygasłyToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbiBLb3dhbHNraSIsImV4cCI6MTUxNjIzOTAyMn0.FPFEt9S16MZgIh0LrQmGsQj9uWa6GwRxlOw4iZ6ulAo";

      // Act
      const wynik = obsługaJWT.zweryfikujToken(wygasłyToken);

      // Assert
      expect(wynik.ważny).toBe(false);
      expect(wynik.błąd).toContain("wygasł");
    });

    it("powinien odrzucić nieprawidłowy token", () => {
      // Act
      const wynik = obsługaJWT.zweryfikujToken("nieprawidłowy_token");

      // Assert
      expect(wynik.ważny).toBe(false);
      expect(wynik.błąd).toContain("nieprawidłowy format");
    });
  });

  describe("sprawdzanie czasu wygaśnięcia", () => {
    it("powinien zwrócić czas pozostały do wygaśnięcia dla ważnego tokenu", () => {
      // Arrange
      const ważnyToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbiBLb3dhbHNraSIsImV4cCI6MTk1ODMyNDgwMH0.FPFEt9S16MZgIh0LrQmGsQj9uWa6GwRxlOw4iZ6ulAo";

      // Act
      const pozostałyCzas = obsługaJWT.pozostałyCzasDo(ważnyToken);

      // Assert
      expect(pozostałyCzas).toBeGreaterThan(0);
    });

    it("powinien zwrócić wartość ujemną dla wygasłego tokenu", () => {
      // Arrange
      const wygasłyToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbiBLb3dhbHNraSIsImV4cCI6MTUxNjIzOTAyMn0.FPFEt9S16MZgIh0LrQmGsQj9uWa6GwRxlOw4iZ6ulAo";

      // Act
      const pozostałyCzas = obsługaJWT.pozostałyCzasDo(wygasłyToken);

      // Assert
      expect(pozostałyCzas).toBeLessThan(0);
    });
  });
});
