# API Endpoint Implementation Plan: Generowanie fiszek przez AI

## 1. Przegląd punktów końcowych

Endpointy generowania fiszek umożliwiają użytkownikom tworzenie fiszek automatycznie przy pomocy AI, sprawdzanie statusu procesu generacji oraz akceptację wygenerowanych fiszek.

### Wykorzystanie lokalnego serwera Ollama

W wersji MVP system korzysta z lokalnego serwera Ollama dostępnego pod adresem http://192.168.0.11:11434.
Wykorzystywane modele:

- gemma3:27b - duży model o wysokiej jakości generacji
- llama3.2:3b - mniejszy model (domyślny) zapewniający szybsze działanie
- deepseek-r1:32b - zaawansowany model z rozszerzonym kontekstem
- llama3.3:latest - najnowsza wersja modelu llama

### Endpoint tworzenia generacji

- Rozpoczyna proces generowania fiszek przez AI
- Zapisuje początkowe dane generacji w bazie danych
- Zwraca informacje o utworzonej generacji

### Endpoint statusu generacji

- Sprawdza aktualny status procesu generacji
- Zwraca informacje o generacji wraz z wygenerowanymi fiszkami

### Endpoint akceptacji wygenerowanych fiszek

- Zapisuje wybrane wygenerowane fiszki do kolekcji użytkownika
- Aktualizuje statystyki generacji
- Zwraca informacje o zaakceptowanych fiszkach

## 2. Szczegóły żądania

### Tworzenie generacji

- Metoda HTTP: POST
- Ścieżka URL: /api/generations
- Parametry: brak
- Nagłówki:
  - Content-Type: application/json
  - Authorization: Bearer {token}
- Request Body:
  ```json
  {
    "source_text": "string",
    "model": "string"
  }
  ```

### Status generacji

- Metoda HTTP: GET
- Ścieżka URL: /api/generations/{id}
- Parametry:
  - Wymagane:
    - id: integer (identyfikator generacji)
- Nagłówki: Authorization: Bearer {token}

### Akceptacja wygenerowanych fiszek

- Metoda HTTP: PUT
- Ścieżka URL: /api/generations/{id}/accept
- Parametry:
  - Wymagane:
    - id: integer (identyfikator generacji)
- Nagłówki:
  - Content-Type: application/json
  - Authorization: Bearer {token}
- Request Body:
  ```json
  {
    "flashcards": [
      {
        "id": "integer",
        "front": "string",
        "back": "string",
        "edited": "boolean"
      }
    ]
  }
  ```

## 3. Wykorzystywane typy

- `CreateGenerationDTO` - dane potrzebne do rozpoczęcia procesu generacji
- `GenerationStatusDTO` - status procesu generacji wraz z wygenerowanymi fiszkami
- `AcceptGeneratedFlashcardsDTO` - dane fiszek do zaakceptowania
- `AcceptGeneratedFlashcardsResponseDTO` - dane zaakceptowanych fiszek
- `ValidatedFrontText` i `ValidatedBackText` - walidowane teksty przedniej i tylnej strony fiszki

## 4. Szczegóły odpowiedzi

### Tworzenie generacji

- Sukces (202 Accepted):
  ```json
  {
    "id": "integer",
    "status": "processing",
    "generated_count": 0,
    "source_text_hash": "string",
    "source_text_length": "integer",
    "created_at": "timestamp"
  }
  ```
- Błędy:
  - 400 Bad Request - nieprawidłowe dane wejściowe
  - 401 Unauthorized - brak/niepoprawna autoryzacja

### Status generacji

- Sukces (200 OK):
  ```json
  {
    "id": "integer",
    "status": "processing" | "completed" | "error",
    "generated_count": "integer",
    "accepted_unedited_count": "integer",
    "accepted_edited_count": "integer",
    "source_text_hash": "string",
    "source_text_length": "integer",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "generation_duration": "integer",
    "flashcards": [
      {
        "id": "integer",
        "front": "string",
        "back": "string",
        "source": "ai-full"
      }
    ]
  }
  ```
- Błędy:
  - 401 Unauthorized - brak/niepoprawna autoryzacja
  - 404 Not Found - generacja nie istnieje lub nie należy do użytkownika

### Akceptacja wygenerowanych fiszek

- Sukces (200 OK):
  ```json
  {
    "accepted_count": "integer",
    "flashcards": [
      {
        "id": "integer",
        "front": "string",
        "back": "string",
        "source": "string"
      }
    ]
  }
  ```
- Błędy:
  - 400 Bad Request - nieprawidłowe dane wejściowe
  - 401 Unauthorized - brak/niepoprawna autoryzacja
  - 404 Not Found - generacja nie istnieje lub nie należy do użytkownika

## 5. Przepływ danych

### Tworzenie generacji

1. Ekstrakcja tokenu JWT z nagłówka i weryfikacja tożsamości użytkownika
2. Walidacja danych wejściowych (długość tekstu źródłowego, dostępność modelu)
3. Obliczenie hasha tekstu źródłowego
4. Utworzenie nowego rekordu w tabeli `generations` ze statusem 'processing'
5. Uruchomienie procesu generacji fiszek w tle (np. przy użyciu kolejki zadań)
6. Zwrócenie odpowiedzi 202 Accepted z danymi utworzonej generacji

### Status generacji

1. Ekstrakcja tokenu JWT z nagłówka i weryfikacja tożsamości użytkownika
2. Sprawdzenie czy generacja istnieje i należy do żądającego użytkownika
3. Pobranie danych generacji i wygenerowanych fiszek z bazy danych
4. Zwrócenie statusu generacji i wygenerowanych fiszek

### Akceptacja wygenerowanych fiszek

1. Implementacja middleware uwierzytelniania
2. Implementacja walidacji danych wejściowych (AcceptGeneratedFlashcardsDTO) z wykorzystaniem funkcji `validateFrontText` i `validateBackText` do weryfikacji limitów długości tekstów każdej fiszki
3. Implementacja serwisu do zapisywania zaakceptowanych fiszek
4. Implementacja serwisu do aktualizacji liczników w generacji
5. Implementacja kontrolera obsługującego żądanie akceptacji fiszek
6. Implementacja obsługi błędów z uwzględnieniem przekroczenia limitów długości tekstów
7. Testy jednostkowe i integracyjne
8. Dokumentacja API

## 6. Względy bezpieczeństwa

- Wymaganie tokenu JWT dla wszystkich endpointów
- Weryfikacja, czy użytkownik ma dostęp tylko do swoich własnych generacji
- Walidacja danych wejściowych (zwłaszcza długości tekstu źródłowego)
- Limitowanie częstotliwości żądań generacji (rate limiting)
- Bezpieczne przechowywanie hasha tekstu zamiast pełnego tekstu
- Implementacja Row Level Security (RLS) na poziomie bazy danych

## 7. Obsługa błędów

- Zbyt krótki/długi tekst źródłowy - 400 Bad Request z opisem błędu
- Nieznany model AI - 400 Bad Request z opisem błędu
- Brak/nieprawidłowy token JWT - 401 Unauthorized
- Próba dostępu do nieistniejącej generacji - 404 Not Found
- Próba dostępu do generacji należącej do innego użytkownika - 404 Not Found
- Błąd podczas procesu generacji - zapis do tabeli `generation_error_logs` i status 'error' w generacji
- Przekroczenie limitu generacji - 429 Too Many Requests
- Błędy bazy danych - 500 Internal Server Error z logowaniem błędu

## 8. Rozważania dotyczące wydajności

- Asynchroniczne przetwarzanie generacji fiszek (kolejka zadań)
- Timeout dla procesu generacji (maksymalnie 5 minut)
- Indeksowanie kolumn używanych w zapytaniach (`user_id`, `id`)
- Ograniczenie maksymalnej liczby fiszek na generację (50)
- Ograniczenie długości tekstu źródłowego (1000-10000 znaków)
- Monitorowanie czasu generacji i zużycia zasobów

## 9. Etapy wdrożenia

### Tworzenie generacji

1. Implementacja middleware uwierzytelniania
2. Implementacja walidacji danych wejściowych (CreateGenerationDTO)
3. Implementacja serwisu do obliczania hasha tekstu
4. Implementacja serwisu do tworzenia rekordów generacji
5. Implementacja mechanizmu kolejki zadań do asynchronicznego przetwarzania
6. Implementacja serwisu AI do generowania fiszek
7. Implementacja kontrolera obsługującego żądanie tworzenia generacji
8. Implementacja obsługi błędów i mechanizmu rate limiting
9. Testy jednostkowe i integracyjne
10. Dokumentacja API

### Status generacji

1. Implementacja middleware uwierzytelniania
2. Implementacja serwisu do pobierania danych generacji
3. Implementacja kontrolera obsługującego żądanie statusu generacji
4. Implementacja obsługi błędów
5. Testy jednostkowe i integracyjne
6. Dokumentacja API

### Akceptacja wygenerowanych fiszek

1. Implementacja middleware uwierzytelniania
2. Implementacja walidacji danych wejściowych (AcceptGeneratedFlashcardsDTO)
3. Implementacja serwisu do zapisywania zaakceptowanych fiszek
4. Implementacja serwisu do aktualizacji liczników w generacji
5. Implementacja kontrolera obsługującego żądanie akceptacji fiszek
6. Implementacja obsługi błędów
7. Testy jednostkowe i integracyjne
8. Dokumentacja API
