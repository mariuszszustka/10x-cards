# Diagram podróży użytkownika dla 10x-cards

## 1. Analiza podróży użytkownika

### 1.1 Główne ścieżki użytkownika

- **Dostęp do aplikacji** - Rejestracja (US-001), logowanie (US-002), odzyskiwanie hasła
- **Zarządzanie fiszkami** - Generowanie z AI (US-003), przegląd i zatwierdzanie (US-004), edycja (US-005), usuwanie (US-006), ręczne tworzenie (US-007)
- **Nauka** - Sesje nauki z algorytmem powtórek (US-008)
- **Zarządzanie kontem** - Edycja profilu, zmiana hasła, wylogowanie

### 1.2 Szczegółowy opis ścieżek

1. **Rejestracja konta** (US-001)

   - Użytkownik wypełnia formularz rejestracyjny (email, hasło)
   - System tworzy konto i loguje użytkownika
   - Przekierowanie do panelu głównego

2. **Logowanie do aplikacji** (US-002)

   - Użytkownik wprowadza dane logowania
   - System uwierzytelnia użytkownika
   - Przekierowanie do panelu głównego

3. **Odzyskiwanie hasła**

   - Użytkownik podaje adres email
   - System generuje link resetujący
   - Użytkownik ustawia nowe hasło

4. **Generowanie fiszek przy użyciu AI** (US-003)

   - Użytkownik wprowadza tekst źródłowy (1000-10000 znaków)
   - System przetwarza tekst i generuje propozycje fiszek
   - Wyświetlenie listy wygenerowanych fiszek

5. **Przegląd i zatwierdzanie propozycji fiszek** (US-004)

   - Użytkownik przegląda wygenerowane fiszki
   - Może zatwierdzić, edytować lub odrzucić każdą fiszkę
   - Zatwierdzone fiszki są zapisywane do bazy

6. **Edycja fiszek** (US-005)

   - Użytkownik wybiera fiszkę do edycji
   - Modyfikuje zawartość przodu i/lub tyłu
   - Zapisuje zmiany

7. **Usuwanie fiszek** (US-006)

   - Użytkownik wybiera fiszkę do usunięcia
   - Potwierdza operację
   - System usuwa fiszkę

8. **Ręczne tworzenie fiszek** (US-007)

   - Użytkownik wypełnia formularz nowej fiszki
   - System weryfikuje poprawność danych
   - Fiszka zostaje dodana do kolekcji użytkownika

9. **Sesja nauki z algorytmem powtórek** (US-008)

   - Użytkownik rozpoczyna sesję nauki
   - System wybiera fiszki według algorytmu Leitnera
   - Użytkownik ocenia swoją znajomość każdej fiszki
   - System aktualizuje poziom fiszki w algorytmie powtórek

10. **Wylogowanie**
    - Użytkownik klika przycisk wylogowania
    - System kończy sesję
    - Przekierowanie na stronę główną dla niezalogowanych

### 1.3 Punkty decyzyjne i alternatywne ścieżki

- **Rejestracja/Logowanie**: Użytkownik wybiera rejestrację lub logowanie
- **Odzyskiwanie hasła**: Alternatywna ścieżka podczas logowania
- **Tworzenie fiszek**: Wybór między generowaniem AI a tworzeniem ręcznym
- **Przegląd wygenerowanych fiszek**: Zatwierdzenie, edycja lub odrzucenie każdej fiszki
- **Sesja nauki**: Ocena znajomości fiszki (przeniesienie do innego poziomu)

### 1.4 Cele poszczególnych stanów

- **Strona Główna (niezalogowany)**: Zachęcenie użytkownika do rejestracji
- **Rejestracja**: Utworzenie nowego konta użytkownika
- **Logowanie**: Uwierzytelnienie istniejącego użytkownika
- **Strona Główna (zalogowany)**: Centralny punkt dostępu do funkcji aplikacji
- **Generowanie fiszek AI**: Automatyczne tworzenie zestawu fiszek
- **Tworzenie ręczne**: Dodawanie własnych fiszek
- **Przegląd fiszek**: Zarządzanie istniejącymi fiszkami
- **Sesja nauki**: Efektywne przyswajanie wiedzy z wykorzystaniem algorytmu powtórek

## 2. Diagram stanu podróży użytkownika

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
```
