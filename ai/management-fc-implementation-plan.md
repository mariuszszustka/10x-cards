# API Endpoint Implementation Plan: Zarządzanie fiszkami

## 1. Przegląd punktów końcowych
Endpointy zarządzania fiszkami umożliwiają użytkownikom pobieranie, tworzenie, aktualizację i usuwanie fiszek w systemie.

### Endpoint listy fiszek
- Pobiera listę fiszek użytkownika z opcjonalną filtracją i paginacją
- Zwraca stronicowane wyniki

### Endpoint tworzenia fiszki
- Umożliwia utworzenie nowej fiszki manualnie
- Zapisuje fiszkę w bazie danych
- Zwraca dane utworzonej fiszki

### Endpoint aktualizacji fiszki
- Umożliwia modyfikację istniejącej fiszki
- Zwraca zaktualizowane dane fiszki

### Endpoint usuwania fiszki
- Usuwa istniejącą fiszkę z bazy danych

## 2. Szczegóły żądania

### Lista fiszek
- Metoda HTTP: GET
- Ścieżka URL: /api/flashcards
- Parametry:
  - Opcjonalne:
    - page: integer (domyślnie: 1)
    - per_page: integer (domyślnie: 20, maks: 100)
    - source: string (jedna z: 'ai-full', 'ai-edited', 'manual')
    - search: string (wyszukiwanie w polach front i back)
    - generation_id: integer
- Nagłówki: Authorization: Bearer {token}

### Tworzenie fiszki
- Metoda HTTP: POST
- Ścieżka URL: /api/flashcards
- Parametry: brak
- Nagłówki: 
  - Content-Type: application/json
  - Authorization: Bearer {token}
- Request Body:
  ```json
  {
    "front": "string",
    "back": "string"
  }
  ```

### Aktualizacja fiszki
- Metoda HTTP: PUT
- Ścieżka URL: /api/flashcards/{id}
- Parametry:
  - Wymagane:
    - id: integer (identyfikator fiszki)
- Nagłówki: 
  - Content-Type: application/json
  - Authorization: Bearer {token}
- Request Body:
  ```json
  {
    "front": "string",
    "back": "string"
  }
  ```

### Usuwanie fiszki
- Metoda HTTP: DELETE
- Ścieżka URL: /api/flashcards/{id}
- Parametry:
  - Wymagane:
    - id: integer (identyfikator fiszki)
- Nagłówki: Authorization: Bearer {token}

## 3. Wykorzystywane typy
- `FlashcardDTO` - reprezentacja fiszki
- `FlashcardListResponseDTO` - odpowiedź zawierająca listę fiszek z informacją o paginacji
- `CreateFlashcardDTO` - dane potrzebne do utworzenia nowej fiszki
- `UpdateFlashcardDTO` - dane potrzebne do aktualizacji fiszki
- `FlashcardFilters` - parametry filtrowania dla listy fiszek
- `ValidatedFrontText` i `ValidatedBackText` - walidowane teksty przedniej i tylnej strony fiszki

## 4. Szczegóły odpowiedzi

### Lista fiszek
- Sukces (200 OK):
  ```json
  {
    "items": [
      {
        "id": "integer",
        "front": "string",
        "back": "string",
        "source": "string",
        "generation_id": "integer|null",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    ],
    "total": "integer",
    "page": "integer",
    "per_page": "integer",
    "total_pages": "integer"
  }
  ```
- Błędy:
  - 400 Bad Request - nieprawidłowe parametry
  - 401 Unauthorized - brak/niepoprawna autoryzacja

### Tworzenie fiszki
- Sukces (201 Created):
  ```json
  {
    "id": "integer",
    "front": "string",
    "back": "string",
    "source": "manual",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- Błędy:
  - 400 Bad Request - nieprawidłowe dane wejściowe
  - 401 Unauthorized - brak/niepoprawna autoryzacja

### Aktualizacja fiszki
- Sukces (200 OK):
  ```json
  {
    "id": "integer",
    "front": "string",
    "back": "string",
    "source": "string",
    "generation_id": "integer|null",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- Błędy:
  - 400 Bad Request - nieprawidłowe dane wejściowe
  - 401 Unauthorized - brak/niepoprawna autoryzacja
  - 404 Not Found - fiszka nie istnieje lub nie należy do użytkownika

### Usuwanie fiszki
- Sukces (204 No Content)
- Błędy:
  - 401 Unauthorized - brak/niepoprawna autoryzacja
  - 404 Not Found - fiszka nie istnieje lub nie należy do użytkownika

## 5. Przepływ danych

### Lista fiszek
1. Ekstrakcja tokenu JWT z nagłówka i weryfikacja tożsamości użytkownika
2. Walidacja parametrów zapytania
3. Budowa zapytania do bazy danych z uwzględnieniem filtrów i paginacji
4. Pobranie fiszek użytkownika z bazy danych
5. Pobranie łącznej liczby fiszek spełniających kryteria dla kalkulacji paginacji
6. Mapowanie danych z bazy danych na DTO
7. Zwrócenie odpowiedzi z paginacją

### Tworzenie fiszki
1. Implementacja middleware uwierzytelniania
2. Implementacja walidacji danych wejściowych (CreateFlashcardDTO)
3. Implementacja serwisu do tworzenia nowych fiszek
4. Implementacja kontrolera obsługującego żądanie utworzenia fiszki
5. Implementacja obsługi błędów
6. Testy jednostkowe i integracyjne
7. Dokumentacja API

### Aktualizacja fiszki
1. Implementacja middleware uwierzytelniania
2. Implementacja walidacji danych wejściowych (UpdateFlashcardDTO)
3. Implementacja serwisu do aktualizacji fiszek z weryfikacją właściciela
4. Implementacja kontrolera obsługującego żądanie aktualizacji fiszki
5. Implementacja obsługi błędów
6. Testy jednostkowe i integracyjne
7. Dokumentacja API

### Usuwanie fiszki
1. Ekstrakcja tokenu JWT z nagłówka i weryfikacja tożsamości użytkownika
2. Sprawdzenie czy fiszka istnieje i należy do żądającego użytkownika
3. Usunięcie rekordu z tabeli `flashcards`
4. Zwrócenie odpowiedzi 204 No Content

## 6. Względy bezpieczeństwa
- Wymaganie tokenu JWT dla wszystkich endpointów
- Weryfikacja, czy użytkownik ma dostęp tylko do swoich własnych fiszek
- Walidacja danych wejściowych dla zapobiegania atakom injekcji SQL i XSS
- Implementacja Row Level Security (RLS) na poziomie bazy danych
- Filtrowanie danych wyjściowych aby zapobiec ujawnieniu wrażliwych informacji

## 7. Obsługa błędów
- Nieprawidłowe parametry paginacji/filtrowania - 400 Bad Request z opisem błędu
- Brak/nieprawidłowy token JWT - 401 Unauthorized
- Próba dostępu do nieistniejącej fiszki - 404 Not Found
- Próba dostępu do fiszki należącej do innego użytkownika - 404 Not Found (nie ujawniamy, że zasób istnieje)
- Przekroczenie limitu długości tekstu - 400 Bad Request z opisem błędu
- Błędy bazy danych - 500 Internal Server Error z logowaniem błędu

## 8. Rozważania dotyczące wydajności
- Paginacja wyników dla zmniejszenia obciążenia bazy danych
- Indeksowanie kolumn używanych w filtrach (indeksy dla `user_id`, `generation_id`, `source`)
- Indeksy typu GIN dla wyszukiwania pełnotekstowego w polach `front` i `back`
- Optymalizacja zapytań SQL
- Cachowanie często używanych zapytań
- Monitorowanie wydajności endpoint'ów

## 9. Etapy wdrożenia

### Lista fiszek
1. Implementacja mechanizmu uwierzytelniania (middleware) do ekstrakcji tokenu JWT
2. Implementacja walidacji parametrów zapytania
3. Implementacja serwisu do pobierania fiszek z zastosowaniem filtrów i paginacji
4. Implementacja kontrolera obsługującego żądanie listy fiszek
5. Implementacja obsługi błędów i odpowiednich kodów statusu
6. Testy jednostkowe serwisu i kontrolera
7. Testy integracyjne całego endpointu
8. Dokumentacja API

### Tworzenie fiszki
1. Implementacja middleware uwierzytelniania
2. Implementacja walidacji danych wejściowych (CreateFlashcardDTO) z wykorzystaniem funkcji `validateFrontText` i `validateBackText` do weryfikacji limitów długości tekstów
3. Implementacja serwisu do tworzenia nowych fiszek
4. Implementacja kontrolera obsługującego żądanie utworzenia fiszki
5. Implementacja obsługi błędów z uwzględnieniem przekroczenia limitów długości tekstów
6. Testy jednostkowe i integracyjne
7. Dokumentacja API

### Aktualizacja fiszki
1. Implementacja middleware uwierzytelniania
2. Implementacja walidacji danych wejściowych (UpdateFlashcardDTO) z wykorzystaniem funkcji `validateFrontText` i `validateBackText` do weryfikacji limitów długości tekstów
3. Implementacja serwisu do aktualizacji fiszek z weryfikacją właściciela
4. Implementacja kontrolera obsługującego żądanie aktualizacji fiszki
5. Implementacja obsługi błędów z uwzględnieniem przekroczenia limitów długości tekstów
6. Testy jednostkowe i integracyjne
7. Dokumentacja API

### Usuwanie fiszki
1. Implementacja middleware uwierzytelniania
2. Implementacja serwisu do usuwania fiszek z weryfikacją właściciela
3. Implementacja kontrolera obsługującego żądanie usunięcia fiszki
4. Implementacja obsługi błędów
5. Testy jednostkowe i integracyjne
6. Dokumentacja API

## Uzupełnienie PRD o system Leitnera

4. Integracja z algorytmem powtórek:
   - Fiszki są przypisywane do harmonogramu powtórek według Systemu Leitnera, popularnej metody spaced repetition.
   - System Leitnera kategoryzuje fiszki do 3 poziomów (pudełek) w zależności od znajomości materiału:
     - Poziom 1: Fiszki nowe lub często niepoprawnie odpowiadane (powtarzane codziennie)
     - Poziom 2: Fiszki z podstawową znajomością (powtarzane co 3 dni)
     - Poziom 3: Fiszki dobrze opanowane (powtarzane co 7 dni)
   - Po poprawnej odpowiedzi, fiszka przechodzi poziom wyżej, po niepoprawnej - wraca do poziomu 1.
   - Integracja umożliwia efektywne stosowanie metody spaced repetition.

## Propozycja struktury bazy danych dla systemu Leitnera

### Tabela: flashcard_learning_progress
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `flashcard_id` INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE
- `leitner_box` INTEGER NOT NULL DEFAULT 1 CHECK (leitner_box BETWEEN 1 AND 3)
- `last_reviewed_at` TIMESTAMP WITH TIME ZONE
- `next_review_at` TIMESTAMP WITH TIME ZONE
- `consecutive_correct_answers` INTEGER NOT NULL DEFAULT 0
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: review_history
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `flashcard_id` INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE
- `is_correct` BOOLEAN NOT NULL
- `previous_box` INTEGER NOT NULL
- `new_box` INTEGER NOT NULL
- `review_time_ms` INTEGER  -- czas odpowiedzi w milisekundach (opcjonalnie)
- `created_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabela: review_sessions
- `id` SERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `started_at` TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- `completed_at` TIMESTAMP WITH TIME ZONE
- `cards_reviewed` INTEGER NOT NULL DEFAULT 0
- `correct_answers` INTEGER NOT NULL DEFAULT 0
- `incorrect_answers` INTEGER NOT NULL DEFAULT 0
- `total_review_time_ms` INTEGER  -- łączny czas sesji w milisekundach (opcjonalnie)

### Indeksy dla tabel powtórek:

- **Tabela flashcard_learning_progress:**
  - `CREATE INDEX idx_flashcard_learning_progress_user_id ON flashcard_learning_progress(user_id);`
  - `CREATE INDEX idx_flashcard_learning_progress_flashcard_id ON flashcard_learning_progress(flashcard_id);`
  - `CREATE INDEX idx_flashcard_learning_progress_leitner_box ON flashcard_learning_progress(leitner_box);`
  - `CREATE INDEX idx_flashcard_learning_progress_next_review_at ON flashcard_learning_progress(next_review_at);`

- **Tabela review_history:**
  - `CREATE INDEX idx_review_history_user_id ON review_history(user_id);`
  - `CREATE INDEX idx_review_history_flashcard_id ON review_history(flashcard_id);`
  - `CREATE INDEX idx_review_history_created_at ON review_history(created_at);`

- **Tabela review_sessions:**
  - `CREATE INDEX idx_review_sessions_user_id ON review_sessions(user_id);`
  - `CREATE INDEX idx_review_sessions_started_at ON review_sessions(started_at);`

### RLS dla tabel powtórek:

- **RLS dla flashcard_learning_progress:**
  ```sql
  ALTER TABLE flashcard_learning_progress ENABLE ROW LEVEL SECURITY;
  CREATE POLICY user_flashcard_learning_progress_policy ON flashcard_learning_progress 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);
  ```

- **RLS dla review_history:**
  ```sql
  ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;
  CREATE POLICY user_review_history_policy ON review_history 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);
  ```

- **RLS dla review_sessions:**
  ```sql
  ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY user_review_sessions_policy ON review_sessions 
    FOR ALL 
    USING (user_id = current_setting('app.current_user_id')::uuid);
  ```

Te zmiany zapewnią kompletną strukturę bazy danych do implementacji systemu Leitnera, umożliwiając śledzenie postępów użytkownika, planowanie sesji powtórek i generowanie statystyk nauki.