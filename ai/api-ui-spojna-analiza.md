# Analiza spójności między API a UI w projekcie 10x-cards

## 1. Wprowadzenie

Niniejsza analiza ma na celu weryfikację spójności między planowanymi endpointami API a widokami UI. Sprawdzamy, czy wszystkie funkcjonalności dostępne w interfejsie użytkownika mają odpowiednie wsparcie w API, oraz czy wszystkie endpointy API są wykorzystywane w interfejsie.

## 2. Mapowanie endpointów API do widoków UI

### Autentykacja (Authentication)

| Endpoint API | Widok UI | Spójność | Komentarz |
|--------------|----------|----------|-----------|
| POST /api/auth/register | Ekran Autoryzacji - zakładka rejestracji | ✅ | Kompletna implementacja |
| POST /api/auth/login | Ekran Autoryzacji - zakładka logowania | ✅ | Kompletna implementacja |

### Fiszki (Flashcards)

| Endpoint API | Widok UI | Spójność | Komentarz |
|--------------|----------|----------|-----------|
| GET /api/flashcards | Lista Fiszek | ✅ | Wspiera paginację, wyszukiwanie i filtrowanie w UI |
| POST /api/flashcards | Widok Generowania Fiszek - tryb ręczny | ✅ | Kompletna implementacja |
| PUT /api/flashcards/{id} | Lista Fiszek - funkcja edycji | ✅ | Edycja inline w UI |
| DELETE /api/flashcards/{id} | Lista Fiszek - funkcja usuwania | ✅ | Modal potwierdzenia w UI |

### Generowanie (Generations)

| Endpoint API | Widok UI | Spójność | Komentarz |
|--------------|----------|----------|-----------|
| POST /api/generations | Widok Generowania Fiszek - tryb AI | ✅ | Obsługuje wysyłanie tekstu źródłowego do AI |
| GET /api/generations/{id} | Widok Generowania Fiszek - sprawdzanie statusu | ✅ | Wykorzystywane do pokazywania statusu i wyników generacji |
| PUT /api/generations/{id}/accept | Widok Generowania Fiszek - akceptacja propozycji | ✅ | Obsługuje zatwierdzanie wybranych fiszek |

### System Leitnera

| Funkcjonalność UI | Endpoint API | Spójność | Komentarz |
|-------------------|--------------|----------|-----------|
| Sesja Nauki - wybór pudełka | Brak dedykowanego endpointu | ❌ | Brakuje endpointu do pobierania fiszek według pudełka Leitnera |
| Sesja Nauki - ocena wiedzy | Brak dedykowanego endpointu | ❌ | Brakuje endpointu do aktualizacji statusu fiszki w systemie Leitnera |
| Sesja Nauki - rozpoczęcie sesji | Brak dedykowanego endpointu | ❌ | Brakuje endpointu do rozpoczynania/kończenia sesji nauki |

### Profil użytkownika

| Funkcjonalność UI | Endpoint API | Spójność | Komentarz |
|-------------------|--------------|----------|-----------|
| Panel Użytkownika - zmiana hasła | Brak dedykowanego endpointu | ❌ | Brakuje endpointu do aktualizacji hasła użytkownika |
| Panel Użytkownika - usunięcie konta | Brak dedykowanego endpointu | ❌ | Brakuje endpointu do usuwania konta użytkownika |

## 3. Brakujące endpointy API

Na podstawie analizy zidentyfikowano następujące brakujące endpointy API, które są potrzebne do obsługi funkcjonalności UI:

### System Leitnera
1. **GET /api/leitner/flashcards**
   - Opis: Pobieranie fiszek według pudełka Leitnera dla aktualnego użytkownika
   - Parametry: box (Pudełko Leitnera: 1, 2 lub 3), limit (maksymalna liczba fiszek)
   - Odpowiedź: Lista fiszek z danego pudełka, gotowych do nauki

2. **POST /api/leitner/reviews**
   - Opis: Zapisanie wyniku powtórki dla fiszki
   - Ciało żądania: ID fiszki, ocena wiedzy (np. "good", "medium", "bad")
   - Odpowiedź: Zaktualizowany status fiszki

3. **POST /api/leitner/sessions**
   - Opis: Rozpoczęcie nowej sesji nauki
   - Ciało żądania: Pudełko Leitnera, maksymalna liczba fiszek
   - Odpowiedź: ID sesji, lista fiszek do nauki

4. **PUT /api/leitner/sessions/{id}/complete**
   - Opis: Zakończenie sesji nauki
   - Ciało żądania: Statystyki sesji (poprawne/niepoprawne odpowiedzi, czas)
   - Odpowiedź: Podsumowanie sesji

### Profil użytkownika
1. **PUT /api/users/password**
   - Opis: Zmiana hasła użytkownika
   - Ciało żądania: Aktualne hasło, nowe hasło
   - Odpowiedź: Status aktualizacji

2. **DELETE /api/users/me**
   - Opis: Usunięcie konta użytkownika
   - Ciało żądania: Potwierdzenie (np. hasło)
   - Odpowiedź: Status usunięcia

## 4. Rekomendowane zmiany

### Dodatkowe endpointy API
Zaleca się dodanie wyżej wymienionych endpointów do planu API, aby zapewnić pełną obsługę funkcjonalności UI:
- Komplet endpointów dla systemu Leitnera
- Endpointy do zarządzania kontem użytkownika

### Modyfikacje w dokumentacji API
Uzupełnić dokumentację API o sekcję dedykowaną dla operacji związanych z systemem Leitnera:
- Opisać model danych dla `flashcard_learning_progress`, `review_history` i `review_sessions`
- Dodać szczegółowe opisy nowych endpointów

### Modyfikacje w dokumentacji UI
Uzupełnić dokumentację UI o dokładniejsze informacje dotyczące:
- Wykorzystywanych endpointów API w poszczególnych komponentach
- Strategii obsługi błędów API w interfejsie użytkownika
- Mechanizmu synchronizacji stanu między UI a backend'em

## 5. Podsumowanie

Analiza wykazała, że większość podstawowych funkcjonalności ma spójne mapowanie między API a UI. Główne braki dotyczą endpointów związanych z systemem Leitnera oraz zarządzaniem kontem użytkownika. Dodanie brakujących endpointów zapewni pełną funkcjonalność aplikacji zgodnie z planowanymi widokami UI.

Ogólna ocena spójności: **Dobra, z kilkoma zidentyfikowanymi brakami do uzupełnienia.** 