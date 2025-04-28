export class SystemLeitnera {
  // Stałe dla systemu
  private readonly POZIOM_MAX = 3;
  private readonly INTERWAŁY_DNI = {
    1: 0,  // Poziom 1: codziennie
    2: 3,  // Poziom 2: co 3 dni
    3: 7   // Poziom 3: co 7 dni
  };
  
  inicjalizujFiszkę(fiszka: any): any {
    return {
      ...fiszka,
      poziom: 1,
      następnaPowtórka: new Date()
    };
  }
  
  aktualizujPoPoprawnej(fiszka: any): any {
    const nowyPoziom = Math.min(fiszka.poziom + 1, this.POZIOM_MAX);
    
    return {
      ...fiszka,
      poziom: nowyPoziom,
      następnaPowtórka: this.obliczNastępnąPowtórkę(nowyPoziom)
    };
  }
  
  aktualizujPoNiepoprawnej(fiszka: any): any {
    return {
      ...fiszka,
      poziom: 1,
      następnaPowtórka: new Date()
    };
  }
  
  wybierzFiszkiDoPowtórki(fiszki: any[]): any[] {
    const dzisiaj = new Date();
    
    return fiszki.filter(fiszka => {
      const dataPowtórki = new Date(fiszka.następnaPowtórka);
      return dataPowtórki <= dzisiaj;
    });
  }
  
  obliczNastępnąPowtórkę(poziom: number): Date {
    if (poziom < 1 || poziom > this.POZIOM_MAX) {
      throw new Error(`Nieprawidłowy poziom: ${poziom}. Oczekiwano wartości od 1 do ${this.POZIOM_MAX}.`);
    }
    
    const dzisiaj = new Date();
    const dni = this.INTERWAŁY_DNI[poziom as keyof typeof this.INTERWAŁY_DNI];
    
    if (dni === 0) {
      return dzisiaj;
    }
    
    const nowaData = new Date(dzisiaj);
    nowaData.setDate(nowaData.getDate() + dni);
    
    return nowaData;
  }
  
  przygotujSesję(fiszki: any[]): {
    fiszki: any[];
    całkowita: number;
    ukończona: number;
    zakończona?: boolean;
  } {
    const fiszkiDoPowtórki = this.wybierzFiszkiDoPowtórki(fiszki);
    
    return {
      fiszki: fiszkiDoPowtórki,
      całkowita: fiszkiDoPowtórki.length,
      ukończona: 0,
      zakończona: fiszkiDoPowtórki.length === 0
    };
  }
} 