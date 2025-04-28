import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SystemLeitnera } from '../SystemLeitnera';

describe('SystemLeitnera', () => {
  let systemLeitnera;
  let dzisiaj;
  
  beforeEach(() => {
    // Ustaw stałą datę dla testów
    dzisiaj = new Date('2023-08-15');
    vi.spyOn(global, 'Date').mockImplementation(() => dzisiaj);
    
    systemLeitnera = new SystemLeitnera();
  });
  
  describe('inicjalizacja fiszek', () => {
    it('powinien przypisać nowe fiszki do poziomu 1', () => {
      // Arrange
      const nowaFiszka = { id: 1, przód: 'Pytanie', tył: 'Odpowiedź' };
      
      // Act
      const fiszkaZPoziomem = systemLeitnera.inicjalizujFiszkę(nowaFiszka);
      
      // Assert
      expect(fiszkaZPoziomem.poziom).toBe(1);
      expect(fiszkaZPoziomem.następnaPowtórka).toEqual(dzisiaj);
    });
  });
  
  describe('przesuwanie fiszek między poziomami', () => {
    it('powinien przesunąć fiszkę o poziom wyżej po poprawnej odpowiedzi', () => {
      // Arrange
      const fiszka = { 
        id: 1, 
        przód: 'Pytanie', 
        tył: 'Odpowiedź', 
        poziom: 1,
        następnaPowtórka: dzisiaj
      };
      
      // Act
      const zaktualizowanaFiszka = systemLeitnera.aktualizujPoPoprawnej(fiszka);
      
      // Assert
      expect(zaktualizowanaFiszka.poziom).toBe(2);
      
      // Sprawdź czy data następnej powtórki to dzisiaj + 3 dni (poziom 2)
      const oczekiwanaData = new Date('2023-08-18');
      expect(zaktualizowanaFiszka.następnaPowtórka).toEqual(oczekiwanaData);
    });
    
    it('nie powinien przesuwać fiszki powyżej poziomu 3', () => {
      // Arrange
      const fiszka = { 
        id: 1, 
        przód: 'Pytanie', 
        tył: 'Odpowiedź', 
        poziom: 3,
        następnaPowtórka: dzisiaj
      };
      
      // Act
      const zaktualizowanaFiszka = systemLeitnera.aktualizujPoPoprawnej(fiszka);
      
      // Assert
      expect(zaktualizowanaFiszka.poziom).toBe(3); // nadal poziom 3 (max)
      
      // Sprawdź czy data następnej powtórki to dzisiaj + 7 dni (poziom 3)
      const oczekiwanaData = new Date('2023-08-22');
      expect(zaktualizowanaFiszka.następnaPowtórka).toEqual(oczekiwanaData);
    });
    
    it('powinien przesunąć fiszkę do poziomu 1 po niepoprawnej odpowiedzi', () => {
      // Arrange
      const fiszka = { 
        id: 1, 
        przód: 'Pytanie', 
        tył: 'Odpowiedź', 
        poziom: 3,
        następnaPowtórka: dzisiaj
      };
      
      // Act
      const zaktualizowanaFiszka = systemLeitnera.aktualizujPoNiepoprawnej(fiszka);
      
      // Assert
      expect(zaktualizowanaFiszka.poziom).toBe(1);
      expect(zaktualizowanaFiszka.następnaPowtórka).toEqual(dzisiaj);
    });
  });
  
  describe('wybieranie fiszek do powtórki', () => {
    it('powinien wybrać tylko fiszki z dzisiejszą lub przeszłą datą powtórki', () => {
      // Arrange
      const fiszki = [
        { id: 1, poziom: 1, następnaPowtórka: dzisiaj },
        { id: 2, poziom: 2, następnaPowtórka: new Date('2023-08-14') }, // wczoraj
        { id: 3, poziom: 3, następnaPowtórka: new Date('2023-08-16') }  // jutro
      ];
      
      // Act
      const fiszkiDoPowtórki = systemLeitnera.wybierzFiszkiDoPowtórki(fiszki);
      
      // Assert
      expect(fiszkiDoPowtórki).toHaveLength(2);
      expect(fiszkiDoPowtórki[0].id).toBe(1);
      expect(fiszkiDoPowtórki[1].id).toBe(2);
    });
    
    it('powinien zwrócić pustą tablicę gdy nie ma fiszek do powtórki', () => {
      // Arrange
      const fiszki = [
        { id: 1, poziom: 1, następnaPowtórka: new Date('2023-08-16') }, // jutro
        { id: 2, poziom: 2, następnaPowtórka: new Date('2023-08-18') }  // za 3 dni
      ];
      
      // Act
      const fiszkiDoPowtórki = systemLeitnera.wybierzFiszkiDoPowtórki(fiszki);
      
      // Assert
      expect(fiszkiDoPowtórki).toHaveLength(0);
    });
  });
  
  describe('obliczanie dat powtórek', () => {
    it('powinien ustawić prawidłowe daty następnych powtórek w zależności od poziomu', () => {
      // Act & Assert
      
      // Poziom 1 - codziennie
      const data1 = systemLeitnera.obliczNastępnąPowtórkę(1);
      expect(data1).toEqual(dzisiaj);
      
      // Poziom 2 - co 3 dni
      const data2 = systemLeitnera.obliczNastępnąPowtórkę(2);
      const oczekiwanaData2 = new Date('2023-08-18');
      expect(data2).toEqual(oczekiwanaData2);
      
      // Poziom 3 - co 7 dni
      const data3 = systemLeitnera.obliczNastępnąPowtórkę(3);
      const oczekiwanaData3 = new Date('2023-08-22');
      expect(data3).toEqual(oczekiwanaData3);
    });
    
    it('powinien obsłużyć nieprawidłowy poziom', () => {
      // Act & Assert
      expect(() => systemLeitnera.obliczNastępnąPowtórkę(0)).toThrow();
      expect(() => systemLeitnera.obliczNastępnąPowtórkę(4)).toThrow();
    });
  });
  
  describe('sesja nauki', () => {
    it('powinien przygotować sesję nauki z dostępnych fiszek', () => {
      // Arrange
      const wszystkieFiszki = [
        { id: 1, poziom: 1, następnaPowtórka: dzisiaj },
        { id: 2, poziom: 2, następnaPowtórka: dzisiaj },
        { id: 3, poziom: 3, następnaPowtórka: new Date('2023-08-16') } // jutro
      ];
      
      // Act
      const sesja = systemLeitnera.przygotujSesję(wszystkieFiszki);
      
      // Assert
      expect(sesja.fiszki).toHaveLength(2);
      expect(sesja.całkowita).toBe(2);
      expect(sesja.ukończona).toBe(0);
    });
    
    it('powinien oznaczyć sesję jako zakończoną gdy nie ma fiszek do powtórki', () => {
      // Arrange
      const wszystkieFiszki = [
        { id: 1, poziom: 1, następnaPowtórka: new Date('2023-08-16') }, // jutro
        { id: 2, poziom: 2, następnaPowtórka: new Date('2023-08-18') }  // za 3 dni
      ];
      
      // Act
      const sesja = systemLeitnera.przygotujSesję(wszystkieFiszki);
      
      // Assert
      expect(sesja.fiszki).toHaveLength(0);
      expect(sesja.całkowita).toBe(0);
      expect(sesja.zakończona).toBe(true);
    });
  });
}); 