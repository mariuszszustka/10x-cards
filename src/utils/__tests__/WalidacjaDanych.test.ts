import { describe, it, expect } from "vitest";
import { WalidacjaDanych } from "../WalidacjaDanych";

describe("WalidacjaDanych", () => {
  describe("walidacja adresu email", () => {
    it("powinien zaakceptować poprawny adres email", () => {
      // Arrange
      const poprawneEmails = [
        "test@example.com",
        "jan.kowalski@domena.pl",
        "imie-nazwisko@subdomena.domena.com",
        "uzytkownik+tag@gmail.com",
        "nazwa.123@firma.io",
      ];

      // Act & Assert
      poprawneEmails.forEach((email) => {
        expect(WalidacjaDanych.zweryfikujEmail(email)).toBe(true);
      });
    });

    it("powinien odrzucić niepoprawny adres email", () => {
      // Arrange
      const niepoprawneEmails = [
        "test",
        "test@",
        "@example.com",
        "test@example",
        "test@@example.com",
        "test@example..com",
        "test@.com",
        "test@example.com.",
        "test@example.c",
      ];

      // Act & Assert
      niepoprawneEmails.forEach((email) => {
        expect(WalidacjaDanych.zweryfikujEmail(email)).toBe(false);
      });
    });

    it("powinien odrzucić pusty adres email", () => {
      expect(WalidacjaDanych.zweryfikujEmail("")).toBe(false);
    });
  });

  describe("walidacja hasła", () => {
    it("powinien zaakceptować hasło spełniające wymagania siły", () => {
      // Arrange
      const mocneHasła = ["Hasło123!", "SuperTajne#42", "Q!w2e3r4t5", "XyZ_789AbC", "B3zpi3czn3!"];

      // Act & Assert
      mocneHasła.forEach((hasło) => {
        expect(WalidacjaDanych.zweryfikujSiłęHasła(hasło)).toBe(true);
      });
    });

    it("powinien odrzucić hasło niespełniające wymagań siły", () => {
      // Arrange
      const słabeHasła = [
        "haslo", // brak dużej litery, cyfry i znaku specjalnego
        "Haslo", // brak cyfry i znaku specjalnego
        "haslo123", // brak dużej litery i znaku specjalnego
        "haslo!@#", // brak dużej litery i cyfry
        "Hasl1!", // za krótkie (min. 8 znaków)
        "abcdefghi", // brak dużej litery, cyfry i znaku specjalnego
      ];

      // Act & Assert
      słabeHasła.forEach((hasło) => {
        expect(WalidacjaDanych.zweryfikujSiłęHasła(hasło)).toBe(false);
      });
    });

    it("powinien zwrócić odpowiednie komunikaty błędów dla różnych wymagań", () => {
      // Act & Assert
      expect(WalidacjaDanych.sprawdźWymaganiaHasła("abc")).toEqual({
        długość: false,
        dużaLitera: false,
        cyfra: false,
        znakSpecjalny: false,
      });

      expect(WalidacjaDanych.sprawdźWymaganiaHasła("Abcdefghij")).toEqual({
        długość: true,
        dużaLitera: true,
        cyfra: false,
        znakSpecjalny: false,
      });

      expect(WalidacjaDanych.sprawdźWymaganiaHasła("abcdefgh1!")).toEqual({
        długość: true,
        dużaLitera: false,
        cyfra: true,
        znakSpecjalny: true,
      });
    });
  });

  describe("walidacja pól formularza", () => {
    it("powinien zweryfikować poprawny formularz logowania", () => {
      // Arrange
      const formularz = {
        email: "test@example.com",
        hasło: "Hasło123!",
      };

      // Act
      const wynik = WalidacjaDanych.zweryfikujFormularzLogowania(formularz);

      // Assert
      expect(wynik.poprawny).toBe(true);
      expect(wynik.błędy).toEqual({});
    });

    it("powinien zwrócić błędy dla niepoprawnego formularza logowania", () => {
      // Arrange
      const formularz = {
        email: "niepoprawny_email",
        hasło: "",
      };

      // Act
      const wynik = WalidacjaDanych.zweryfikujFormularzLogowania(formularz);

      // Assert
      expect(wynik.poprawny).toBe(false);
      expect(wynik.błędy).toHaveProperty("email");
      expect(wynik.błędy).toHaveProperty("hasło");
    });

    it("powinien zweryfikować poprawny formularz rejestracji", () => {
      // Arrange
      const formularz = {
        email: "test@example.com",
        hasło: "Hasło123!",
        potwierdzenie: "Hasło123!",
      };

      // Act
      const wynik = WalidacjaDanych.zweryfikujFormularzRejestracji(formularz);

      // Assert
      expect(wynik.poprawny).toBe(true);
      expect(wynik.błędy).toEqual({});
    });

    it("powinien wykryć różne hasła przy rejestracji", () => {
      // Arrange
      const formularz = {
        email: "test@example.com",
        hasło: "Hasło123!",
        potwierdzenie: "InneHasło123!",
      };

      // Act
      const wynik = WalidacjaDanych.zweryfikujFormularzRejestracji(formularz);

      // Assert
      expect(wynik.poprawny).toBe(false);
      expect(wynik.błędy).toHaveProperty("potwierdzenie", "Hasła nie są identyczne");
    });
  });

  describe("walidacja długości tekstu", () => {
    it("powinien zweryfikować poprawną długość tekstu", () => {
      // Act & Assert
      expect(WalidacjaDanych.sprawdźDługośćTekstu("Test", 1, 10)).toBe(true);
    });

    it("powinien odrzucić tekst krótszy niż minimum", () => {
      // Act & Assert
      expect(WalidacjaDanych.sprawdźDługośćTekstu("AB", 3, 10)).toBe(false);
    });

    it("powinien odrzucić tekst dłuższy niż maksimum", () => {
      // Act & Assert
      expect(WalidacjaDanych.sprawdźDługośćTekstu("To jest zbyt długi tekst", 5, 15)).toBe(false);
    });
  });
});
