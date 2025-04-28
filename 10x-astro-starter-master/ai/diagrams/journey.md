<user_journey_analysis>
## Analiza podróży użytkownika

### 1. Ścieżki użytkownika zidentyfikowane w PRD:
- Rejestracja konta (US-001)
- Logowanie do aplikacji (US-002)
- Odzyskiwanie hasła (wymienione w PRD, sekcja 9)
- Generowanie fiszek przy użyciu AI (US-003)
- Przegląd i zatwierdzanie propozycji fiszek (US-004)
- Edycja fiszek (US-005)
- Usuwanie fiszek (US-006)
- Ręczne tworzenie fiszek (US-007)
- Sesja nauki z algorytmem powtórek (US-008)
- Wylogowanie (wspomniane w PRD)

### 2. Główne podróże i stany:
- **Dostęp do aplikacji**: Strona główna (niezalogowany) → Rejestracja / Logowanie → Strona główna (zalogowany)
- **Zarządzanie kontem**: Logowanie → Panel użytkownika → Edycja hasła / Usunięcie konta
- **Tworzenie fiszek**: Generowanie AI / Tworzenie ręczne → Przegląd i zatwierdzanie → Zapisywanie fiszek
- **Nauka**: Wybór sesji nauki → Algorytm powtórek → Ocena znajomości → Zmiana poziomu fiszki

### 3. Punkty decyzyjne i alternatywne ścieżki:
- **Rejestracja/Logowanie**: Użytkownik wybiera rejestrację lub logowanie
- **Odzyskiwanie hasła**: Alternatywna ścieżka podczas logowania
- **Tworzenie fiszek**: Wybór między generowaniem AI a tworzeniem ręcznym
- **Przegląd wygenerowanych fiszek**: Zatwierdzenie, edycja lub odrzucenie każdej fiszki
- **Sesja nauki**: Ocena znajomości fiszki (przeniesienie do innego poziomu)

### 4. Cele stanów:
- **Strona Główna (niezalogowany)**: Zachęcenie użytkownika do rejestracji
- **Rejestracja**: Utworzenie nowego konta użytkownika
- **Logowanie**: Uwierzytelnienie istniejącego użytkownika
- **Strona Główna (zalogowany)**: Punkt startowy dla korzystania z aplikacji
- **Generowanie fiszek AI**: Automatyczne tworzenie fiszek z wprowadzonego tekstu
- **Tworzenie ręczne**: Dodawanie własnych fiszek
- **Przegląd fiszek**: Zarządzanie istniejącymi fiszkami
- **Sesja nauki**: Efektywne przyswajanie wiedzy z wykorzystaniem algorytmu powtórek
</user_journey_analysis>

```mermaid
stateDiagram-v2
    [*] --> StronaGlowna
    
    state "Dostęp do aplikacji" as DostepDoAplikacji {
        StronaGlowna: Strona zachęcająca do rejestracji
        note right of StronaGlowna
            Niezalogowani użytkownicy widzą 
            tylko zachętę do założenia konta
        end note
        
        state wybor_auth <<choice>>
        StronaGlowna --> wybor_auth
        wybor_auth --> Rejestracja: Nowy użytkownik
        wybor_auth --> Logowanie: Istniejący użytkownik
        
        state "Proces rejestracji" as ProcesRejestracji {
            [*] --> FormularzRejestracji
            FormularzRejestracji: Email i hasło
            FormularzRejestracji --> WalidacjaDanych
            WalidacjaDanych --> RejestracjaUdana: Dane poprawne
            WalidacjaDanych --> FormularzRejestracji: Dane niepoprawne
        }
        
        state "Proces logowania" as ProcesLogowania {
            [*] --> FormularzLogowania
            FormularzLogowania: Email i hasło
            
            state logowanie_wybor <<choice>>
            FormularzLogowania --> logowanie_wybor
            logowanie_wybor --> LogowanieUdane: Dane poprawne
            logowanie_wybor --> FormularzLogowania: Dane niepoprawne
            logowanie_wybor --> OdzyskiwanieHasla: Zapomniane hasło
            
            state "Odzyskiwanie hasła" as OdzyskiwanieHasla {
                [*] --> FormularzOdzyskiwania
                FormularzOdzyskiwania --> WyslanieMailaReset
                WyslanieMailaReset --> FormularzNowegoHasla
                FormularzNowegoHasla --> ZmianaHaslaUdana
            }
        }
        
        Rejestracja --> ProcesRejestracji
        Logowanie --> ProcesLogowania
        
        ProcesRejestracji --> StronaGlownaZalogowany: Rejestracja udana
        LogowanieUdane --> StronaGlownaZalogowany
        ZmianaHaslaUdana --> FormularzLogowania
    }
    
    StronaGlownaZalogowany: Dostęp do wszystkich funkcji aplikacji
    StronaGlownaZalogowany --> PanelUzytkownika: Zarządzanie kontem
    
    state "Panel użytkownika" as PanelUzytkownika {
        [*] --> OpcjeKonta
        
        state opcje_konta_wybor <<choice>>
        OpcjeKonta --> opcje_konta_wybor
        opcje_konta_wybor --> EdycjaHasla: Zmień hasło
        opcje_konta_wybor --> UsuniecieKonta: Usuń konto
        
        EdycjaHasla --> OpcjeKonta: Hasło zmienione
        UsuniecieKonta --> [*]: Konto usunięte
    }
    
    state "Zarządzanie fiszkami" as ZarzadzanieFiszkami {
        [*] --> wybor_tworzenia
        
        state wybor_tworzenia <<choice>>
        wybor_tworzenia --> GenerowanieAI: Generuj przez AI
        wybor_tworzenia --> TworzenieReczne: Utwórz ręcznie
        wybor_tworzenia --> PrzegladFiszek: Zarządzaj fiszkami
        
        state "Generowanie przez AI" as GenerowanieAI {
            [*] --> FormularzTekstu
            FormularzTekstu: Tekst 1000-10000 znaków
            FormularzTekstu --> GenerowaniePropozycji
            GenerowaniePropozycji --> ListaPropozycji
            
            state przegladanie_propozycji <<fork>>
            ListaPropozycji --> przegladanie_propozycji
            przegladanie_propozycji --> ZatwierdzenieFiszki: Zatwierdź
            przegladanie_propozycji --> EdycjaPropozycji: Edytuj
            przegladanie_propozycji --> OdrzuceniePropozycji: Odrzuć
            
            EdycjaPropozycji --> ZatwierdzenieFiszki
            
            state zapisywanie_propozycji <<join>>
            ZatwierdzenieFiszki --> zapisywanie_propozycji
            OdrzuceniePropozycji --> zapisywanie_propozycji
            zapisywanie_propozycji --> ZapisanieFiszek
        }
        
        state "Tworzenie ręczne" as TworzenieReczne {
            [*] --> FormularzFiszki
            FormularzFiszki: Pola "Przód" i "Tył"
            FormularzFiszki --> WalidacjaFiszki
            WalidacjaFiszki --> ZapisanieFiszki: Dane poprawne
            WalidacjaFiszki --> FormularzFiszki: Dane niepoprawne
        }
        
        state "Przegląd fiszek" as PrzegladFiszek {
            [*] --> ListaFiszek
            
            state lista_fiszek_akcje <<choice>>
            ListaFiszek --> lista_fiszek_akcje
            lista_fiszek_akcje --> EdycjaFiszki: Edytuj
            lista_fiszek_akcje --> UsuwanieFiszki: Usuń
            lista_fiszek_akcje --> [*]: Powrót
            
            EdycjaFiszki --> ListaFiszek: Zapisz zmiany
            UsuwanieFiszki --> PotwierdzenieUsuniecia
            PotwierdzenieUsuniecia --> ListaFiszek: Usunięto
        }
        
        ZapisanieFiszek --> PrzegladFiszek
        ZapisanieFiszki --> PrzegladFiszek
    }
    
    state "Sesja nauki" as SesjaNauki {
        [*] --> WyborSesji
        WyborSesji --> AlgorytmPowtorki: Rozpocznij sesję
        
        state "System Leitnera" as SystemLeitnera {
            [*] --> WyswietlenieFiszki
            
            state wybor_pudełka <<choice>>
            WyswietlenieFiszki --> OdsloniecieOdpowiedzi: Pokaż odpowiedź
            OdsloniecieOdpowiedzi --> OcenaZnajomosci
            OcenaZnajomosci --> wybor_pudełka
            wybor_pudełka --> Poziom1: Trudna (codziennie)
            wybor_pudełka --> Poziom2: Średnia (co 3 dni)
            wybor_pudełka --> Poziom3: Łatwa (co 7 dni)
            
            Poziom1 --> KolejnaFiszka
            Poziom2 --> KolejnaFiszka
            Poziom3 --> KolejnaFiszka
            
            state kolejna_fiszka_wybor <<choice>>
            KolejnaFiszka --> kolejna_fiszka_wybor
            kolejna_fiszka_wybor --> WyswietlenieFiszki: Są jeszcze fiszki
            kolejna_fiszka_wybor --> KoniecSesji: Brak więcej fiszek
        }
        
        AlgorytmPowtorki --> SystemLeitnera
        KoniecSesji --> [*]: Podsumowanie sesji
    }
    
    StronaGlownaZalogowany --> ZarzadzanieFiszkami: Tworzenie/edycja fiszek
    StronaGlownaZalogowany --> SesjaNauki: Nauka
    
    state wylogowanie <<choice>>
    StronaGlownaZalogowany --> wylogowanie: Wyloguj
    PanelUzytkownika --> wylogowanie: Wyloguj
    ZarzadzanieFiszkami --> wylogowanie: Wyloguj
    SesjaNauki --> wylogowanie: Wyloguj
    
    wylogowanie --> StronaGlowna
    
    UsuniecieKonta --> StronaGlowna
    
    StronaGlowna --> [*]
</mermaid>
