export class WalidacjaDanych {
  static zweryfikujEmail(email: string): boolean {
    if (!email) return false;
    
    // Walidacja formatu email zgodna ze standardem RFC 5322
    const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9.+_-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    return emailRegex.test(email);
  }
  
  static zweryfikujSiłęHasła(hasło: string): boolean {
    const wymagania = this.sprawdźWymaganiaHasła(hasło);
    return wymagania.długość && wymagania.dużaLitera && wymagania.cyfra && wymagania.znakSpecjalny;
  }
  
  static sprawdźWymaganiaHasła(hasło: string): {
    długość: boolean;
    dużaLitera: boolean;
    cyfra: boolean;
    znakSpecjalny: boolean;
  } {
    return {
      długość: hasło.length >= 8,
      dużaLitera: /[A-Z]/.test(hasło),
      cyfra: /[0-9]/.test(hasło),
      znakSpecjalny: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(hasło)
    };
  }
  
  static zweryfikujFormularzLogowania(formularz: { email: string; hasło: string }): { 
    poprawny: boolean; 
    błędy: Record<string, string>;
  } {
    const błędy: Record<string, string> = {};
    
    if (!this.zweryfikujEmail(formularz.email)) {
      błędy.email = 'Niepoprawny format adresu email';
    }
    
    if (!formularz.hasło) {
      błędy.hasło = 'Hasło jest wymagane';
    }
    
    return {
      poprawny: Object.keys(błędy).length === 0,
      błędy
    };
  }
  
  static zweryfikujFormularzRejestracji(formularz: { 
    email: string; 
    hasło: string; 
    potwierdzenie: string;
  }): { 
    poprawny: boolean; 
    błędy: Record<string, string>;
  } {
    const błędy: Record<string, string> = {};
    
    if (!this.zweryfikujEmail(formularz.email)) {
      błędy.email = 'Niepoprawny format adresu email';
    }
    
    if (!this.zweryfikujSiłęHasła(formularz.hasło)) {
      błędy.hasło = 'Hasło nie spełnia wymagań bezpieczeństwa';
    }
    
    if (formularz.hasło !== formularz.potwierdzenie) {
      błędy.potwierdzenie = 'Hasła nie są identyczne';
    }
    
    return {
      poprawny: Object.keys(błędy).length === 0,
      błędy
    };
  }
  
  static sprawdźDługośćTekstu(tekst: string, min: number, max: number): boolean {
    return tekst.length >= min && tekst.length <= max;
  }
} 