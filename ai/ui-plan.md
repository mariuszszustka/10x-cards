# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

Aplikacja 10x-cards zostanie zbudowana jako aplikacja webowa z ciemnym motywem i minimalistycznym interfejsem. Struktura UI będzie oparta na sześciu głównych widokach, które będą połączone logiczną nawigacją. Podstawowa struktura aplikacji składa się z:

- **Ekranu autoryzacji** - dla logowania i rejestracji
- **Dashboardu** - centralnego punktu nawigacji
- **Widoku generowania fiszek** - z opcjami tworzenia ręcznego i generowania przez AI
- **Listy fiszek** - do przeglądania, wyszukiwania i zarządzania fiszkami
- **Sesji nauki** - implementującej metodę Leitnera z trzema pudełkami
- **Panelu użytkownika** - z podstawowymi informacjami o profilu

Aplikacja będzie korzystać z komponentów Shadcn/ui dla spójnego wyglądu, z naciskiem na prostotę interfejsu i intuicyjną nawigację.

## 2. Lista widoków

### Ekran Autoryzacji
- **Ścieżka**: `/auth`
- **Główny cel**: Umożliwienie użytkownikom rejestracji lub logowania
- **Kluczowe informacje**:
  - Przełączane zakładki logowania i rejestracji
  - Formularze z polami e-mail i hasło
  - Komunikaty o błędach autoryzacji
- **Kluczowe komponenty**:
  - Przełącznik zakładek
  - Formularze z walidacją
  - Przyciski logowania/rejestracji
  - Wskaźnik ładowania podczas przetwarzania
- **UX, dostępność i bezpieczeństwo**:
  - Jasne komunikaty błędów bez ujawniania szczegółów technicznych
  - Walidacja hasła z informacją o wymaganiach
  - Zabezpieczenie przed atakami brute force poprzez limitowanie prób
  - Wsparcie dla czytników ekranu

### Dashboard
- **Ścieżka**: `/dashboard`
- **Główny cel**: Centralna nawigacja do głównych funkcji aplikacji
- **Kluczowe informacje**:
  - Duże kafelki akcji dla głównych funkcji
- **Kluczowe komponenty**:
  - Kafelek "Generuj Fiszki"
  - Kafelek "Rozpocznij Naukę"
  - Kafelek "Przeglądaj Fiszki"
- **UX, dostępność i bezpieczeństwo**:
  - Minimalistyczny interfejs bez zbędnych informacji
  - Duże, czytelne przyciski
  - Wysoki kontrast dla czytelności

### Widok Generowania Fiszek
- **Ścieżka**: `/generate`
- **Główny cel**: Tworzenie fiszek ręcznie lub za pomocą AI
- **Kluczowe informacje**:
  - Przełącznik między ręcznym tworzeniem a generowaniem AI
  - Formularz ręcznego tworzenia z polami "Przód" i "Tył"
  - Pole tekstowe do wprowadzania źródłowego tekstu dla AI
  - Lista propozycji fiszek z opcjami akcji
- **Kluczowe komponenty**:
  - Przełącznik trybu tworzenia
  - Formularz ręcznego tworzenia
  - Pole tekstowe dla AI z licznikiem znaków (1000-10000)
  - Przycisk generowania
  - Lista wygenerowanych propozycji z kontrolkami akceptacji/edycji/odrzucenia
  - Przyciski akcji zbiorczych
  - Wskaźniki ładowania dla procesów AI
- **UX, dostępność i bezpieczeństwo**:
  - Jasne wskaźniki ładowania podczas generowania
  - Informacja o wybranym modelu AI (gemma3:27b)
  - Walidacja długości tekstu wejściowego
  - Możliwość anulowania procesu generowania
  - Zabezpieczenie przed przypadkową utratą danych

### Lista Fiszek
- **Ścieżka**: `/flashcards`
- **Główny cel**: Przeglądanie, wyszukiwanie, sortowanie i zarządzanie fiszkami
- **Kluczowe informacje**:
  - Lista fiszek w formie kart
  - Informacja o przypisaniu do pudełka Leitnera
  - Opcje wyszukiwania i filtrowania
- **Kluczowe komponenty**:
  - Pole wyszukiwania
  - Filtry sortowania (alfabetycznie, wg pudełka)
  - Karty fiszek z podglądem treści
  - Wskaźniki pudełka Leitnera
  - Przyciski edycji i usuwania dla każdej fiszki
  - Kontrolki paginacji
  - Modal potwierdzenia usuwania
- **UX, dostępność i bezpieczeństwo**:
  - Edycja inline bez przechodzenia do osobnego widoku
  - Potwierdzenie przed usunięciem
  - Kontekstowe powiadomienia o sukcesie/błędzie
  - Efektywna paginacja dla dużych zbiorów fiszek

### Sesja Nauki
- **Ścieżka**: `/learn`
- **Główny cel**: Nauka fiszek metodą Leitnera
- **Kluczowe informacje**:
  - Pudełko Leitnera do nauki
  - Aktualna fiszka (przód/tył)
  - Postęp sesji (x/10)
  - Przyciski oceny wiedzy
- **Kluczowe komponenty**:
  - Rozwijana lista wyboru pudełka przed rozpoczęciem
  - Karta fiszki z animacją odkrywania
  - Przycisk "Pokaż odpowiedź"
  - Przyciski oceny: "Znam dobrze", "Jestem neutralny", "Nie znam"
  - Wskaźnik postępu
  - Przycisk wyjścia z sesji
  - Ekran zakończenia sesji
- **UX, dostępność i bezpieczeństwo**:
  - Limit 10 fiszek na sesję
  - Możliwość wyjścia w dowolnym momencie
  - Wyraźne rozróżnienie przodu i tyłu fiszki
  - Animacja odkrywania odpowiedzi

### Panel Użytkownika
- **Ścieżka**: `/profile`
- **Główny cel**: Wyświetlanie i zarządzanie podstawowymi informacjami o profilu
- **Kluczowe informacje**:
  - Avatar użytkownika
  - Nazwa użytkownika
  - Adres e-mail
- **Kluczowe komponenty**:
  - Wyświetlanie awatara (jednakowy dla wszystkich w MVP)
  - Pola informacyjne
  - Ograniczone opcje edycji (w MVP)
- **UX, dostępność i bezpieczeństwo**:
  - Proste pole do zmiany hasła
  - Opcja usunięcia konta z potwierdzeniem
  - Bezpieczne przechowywanie danych logowania

## 3. Mapa podróży użytkownika

### Główny przepływ użytkownika:

1. **Rejestracja i logowanie**
   - Użytkownik trafia na ekran autoryzacji
   - Wybiera zakładkę rejestracji lub logowania
   - Wypełnia formularz i przesyła dane
   - Po pomyślnej autoryzacji jest przekierowywany do dashboardu

2. **Generowanie fiszek przez AI**
   - Z dashboardu użytkownik wybiera "Generuj Fiszki"
   - Przełącza się na tryb AI
   - Wkleja tekst źródłowy (1000-10000 znaków)
   - Klika "Generuj"
   - Podczas generowania widzi wskaźnik ładowania
   - Po zakończeniu przegląda listę propozycji
   - Dla każdej fiszki może:
     - Zaakceptować bez zmian
     - Edytować i zaakceptować
     - Odrzucić
   - Zatwierdza wybrane fiszki przyciskiem "Zapisz zatwierdzone"
   - Otrzymuje powiadomienie o sukcesie
   - Może wrócić do dashboardu lub kontynuować generowanie

3. **Ręczne tworzenie fiszek**
   - Z dashboardu użytkownik wybiera "Generuj Fiszki"
   - Przełącza się na tryb ręczny
   - Wypełnia pola "Przód" (maks. 200 znaków) i "Tył" (maks. 500 znaków)
   - Klika "Zapisz"
   - Otrzymuje powiadomienie o sukcesie
   - Może utworzyć kolejną fiszkę lub wrócić do dashboardu

4. **Przeglądanie i zarządzanie fiszkami**
   - Z dashboardu użytkownik wybiera "Przeglądaj Fiszki"
   - Przegląda listę swoich fiszek
   - Może wyszukiwać, filtrować lub sortować
   - Dla wybranej fiszki może:
     - Kliknąć "Edytuj" i zmodyfikować treść inline
     - Kliknąć "Usuń" i potwierdzić usunięcie
   - Po każdej akcji otrzymuje powiadomienie o sukcesie

5. **Sesja nauki**
   - Z dashboardu użytkownik wybiera "Rozpocznij Naukę"
   - Opcjonalnie wybiera pudełko Leitnera (domyślnie pierwsze)
   - Klika "Start"
   - System wybiera maksymalnie 10 fiszek
   - Dla każdej fiszki:
     - Użytkownik widzi przód
     - Klika "Pokaż odpowiedź"
     - Widzi tył fiszki
     - Ocenia swoją wiedzę jednym z trzech przycisków
     - System przenosi fiszkę do odpowiedniego pudełka
   - Po zakończeniu sesji widzi ekran podsumowania
   - Wraca do dashboardu

## 4. Układ i struktura nawigacji

### Globalny pasek nawigacyjny
Dostępny na wszystkich stronach po zalogowaniu, zawiera:
- Logo (link do dashboardu)
- Główne linki nawigacyjne:
  - Dashboard
  - Generuj Fiszki
  - Moje Fiszki
  - Nauka
- Avatar użytkownika z rozwijanym menu:
  - Profil
  - Wyloguj

### Nawigacja kontekstowa
- W każdym widoku przyciski akcji specyficzne dla danego kontekstu
- Przyciski powrotu do dashboardu
- Przyciski zapisywania/anulowania w formularzach

### Wizualna hierarchia
- Dashboard jako centralny punkt nawigacji
- Główne zadania (generowanie, nauka, przeglądanie) jako równorzędne opcje
- Panel użytkownika jako funkcja poboczna

### Przepływy wieloetapowe
- Generowanie fiszek przez AI:
  1. Wprowadzenie tekstu → 2. Przetwarzanie → 3. Przegląd propozycji → 4. Zapisywanie
- Sesja nauki:
  1. Wybór pudełka → 2. Nauka fiszek → 3. Podsumowanie

## 5. Kluczowe komponenty

### Karta Fiszki
- Uniwersalny komponent do wyświetlania fiszek w różnych kontekstach
- Właściwości:
  - Przód i tył fiszki
  - Wskaźnik pudełka Leitnera (kolorowy pasek/ikona)
  - Przyciski akcji (edycja, usunięcie)
  - Animacja odwracania w trybie nauki

### Formularz Fiszki
- Komponent do tworzenia i edycji fiszek
- Właściwości:
  - Pola tekstowe z limitami znaków
  - Walidacja danych
  - Przyciski akcji (zapisz, anuluj)

### System Powiadomień
- Komponent do wyświetlania informacji o wynikach akcji
- Właściwości:
  - Powiadomienia o sukcesie (zielone)
  - Ostrzeżenia (żółte)
  - Błędy (czerwone)
  - Automatyczne znikanie po określonym czasie

### Wskaźniki Ładowania
- Kontekstowe spinnery dla operacji asynchronicznych
- Właściwości:
  - Spójny wygląd w całej aplikacji
  - Informacja o trwającym procesie
  - Możliwość anulowania długotrwałych operacji

### Modalne Okna Potwierdzenia
- Komponent do potwierdzania krytycznych akcji
- Właściwości:
  - Jasny komunikat
  - Przyciski potwierdzenia i anulowania
  - Blokada interakcji z tłem

### Przełącznik Zakładek
- Komponent do przełączania między zakładkami w ramach widoku
- Właściwości:
  - Wyraźne wizualne rozróżnienie aktywnej zakładki
  - Płynne przełączanie zawartości
  - Zachowanie stanu formularzy

### Widok Pudełek Leitnera
- Komponent wizualizujący system trzech pudełek
- Właściwości:
  - Kolorowy kod dla każdego pudełka
  - Informacja o liczbie fiszek w pudełku
  - Możliwość wyboru pudełka do nauki
